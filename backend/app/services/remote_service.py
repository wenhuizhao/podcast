from app.services.db_service import get_active_ec2_instance, create_ec2_instance, update_job, update_ec2_instance, jobs_by_instance_id
from app.services.ec2_service import create_ec2_instance_and_run_job, shutdown_spot_instance
from app.services.scheduler_service import scheduler
import boto3
import time
import pytz
import os
from datetime import datetime, timedelta
from app.constant import SPOT_INSTANCE_IDLE_TIME_IN_MIN

def get_command_output(ssm, instance_id, command_id):
    """Retrieves the output of the SSM command."""
    while True:
        time.sleep(2)
        response = ssm.get_command_invocation(
            CommandId=command_id,
            InstanceId=instance_id,
        )
        status = response['Status']
        if status == 'InProgress':
            print("Command is still running...")
            continue
        elif status == 'Success':
            return response['StandardOutputContent']
        else:
            print(f"Command failed with status: {status}")
            return response['StandardErrorContent']

def run_command_ssm(region, instance_ids, command):
    """Runs a command on the instance(s) via SSM Run Command."""
    ssm = boto3.client('ssm', 
                        region_name=region,
                        aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
                        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
                      )
    response = ssm.send_command(
        InstanceIds=instance_ids,
        DocumentName="AWS-RunShellScript",
        Parameters={'commands': [command]},
    )
    command_id = response['Command']['CommandId']
    print(f"Command sent. Command ID: {command_id}")

    # Wait for command execution to complete
    output = get_command_output(ssm, instance_ids[0], command_id)
    print("Command output:")
    print(output)
    return output


def try_shutdown_instance(job_id, region, instance_id):
    jobs = jobs_by_instance_id(instance_id)
    if len(jobs) == 0:
        print(f"no jobs in instance:{instance_id}, shutdown...")
        update_ec2_instance(instance_id=instance_id, status='shutdown')
        shutdown_spot_instance(region=region, instance_id=instance_id)
        print("shutdown done")
    else:
      run_time = datetime.now(pytz.utc) + timedelta(seconds=SPOT_INSTANCE_IDLE_TIME_IN_MIN*60)
      print("Job running in instance:{instance_id}, reschedule shutdown at: {run_time}")
      scheduler.add_job(
        id=job_id,
        func=shutdown_spot_instance,
        trigger='date',
        run_date=run_time,
        args=[job_id, region, instance_id]
      )
        

def run_remote(job_id):
  ec2_instance = get_active_ec2_instance()
  if ec2_instance:
    update_job(job_id=job_id, instance_id=ec2_instance.instance_id, status='processing')
    ssm_client = boto3.client("ssm",
                                region_name=ec2_instance.region,
                                aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
                                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
                              )
    db_user_password_param = ssm_client.get_parameter(Name='db_user_password')
    db_user_password = db_user_password_param["Parameter"]["Value"]
    aws_access_key_param = ssm_client.get_parameter(Name='s3_aws_access_key')
    aws_access_key = aws_access_key_param["Parameter"]["Value"]
    job_command = f"su - ubuntu -c 'DB_PASSWORD={db_user_password} AWS_SECRET_ACCESS_KEY={aws_access_key} python3 /home/ubuntu/process_job.py {job_id} &> out'"
    run_command_ssm(ec2_instance.region, [ec2_instance.instance_id], job_command)
    run_time = datetime.now(pytz.utc) + timedelta(seconds=SPOT_INSTANCE_IDLE_TIME_IN_MIN*60)
    scheduler.add_job(
      id=job_id,
      func=try_shutdown_instance,
      trigger='date',
      run_date=run_time,
      args=[job_id, ec2_instance.region, ec2_instance.instance_id]
    )
    return
  
  instance_id, public_ip, region = create_ec2_instance_and_run_job(job_id)
  create_ec2_instance(instance_id=instance_id, region = region, ip_addr = public_ip, status='active')
  update_job(job_id=job_id, instance_id=instance_id, status='processing')

  #schedule job to shut down ec2 spot instance after 45 minutes.
  run_time = datetime.now(pytz.utc) + timedelta(seconds=SPOT_INSTANCE_IDLE_TIME_IN_MIN*60)
  
  scheduler.add_job(
    id=job_id,
    func=try_shutdown_instance,
    trigger='date',
    run_date=run_time,
    args=[job_id, region, instance_id]
  )



