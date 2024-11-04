import base64
import boto3
import time
import os

current_file_path = os.path.abspath(__file__)
current_folder = os.path.dirname(current_file_path)
job_script_file = f"{current_folder}/process_job.py"

def get_ubuntu_ami_id(region):
    """Fetches the latest Ubuntu 22.04 AMI ID for the given region."""
    ec2 = boto3.client('ec2',
                       region_name=region,
                      aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
                      aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
                      )
    response = ec2.describe_images(
        Owners=['099720109477'],  # Canonical, the publisher of Ubuntu
        Filters=[
            {'Name': 'name', 'Values': ['ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*']},
            {'Name': 'state', 'Values': ['available']}
        ]
    )
    images = sorted(response['Images'], key=lambda x: x['CreationDate'], reverse=True)
    return images[0]['ImageId'] if images else None

def get_instance_public_ip(region, instance_id):
    """Gets the public IP address of the instance."""
    ec2 = boto3.client('ec2',
                       region_name=region,
                      aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
                      aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
                      )
    while True:
        response = ec2.describe_instances(InstanceIds=[instance_id])
        reservations = response.get('Reservations', [])
        if reservations:
            instance = reservations[0]['Instances'][0]
            state = instance['State']['Name']
            if state == 'running':
                if 'PublicIpAddress' in instance:
                    return instance['PublicIpAddress']
            elif state in ['shutting-down', 'terminated', 'stopping', 'stopped']:
                raise Exception(f"Instance is in state {state}")
        print(f"Waiting for instance {instance_id} to have a public IP address...")
        time.sleep(5)

def request_spot_instance(region, instance_type, max_price, user_data, key_name, security_group_id, iam_instance_profile_name):
    """Requests a spot instance with the given configuration."""
    ec2 = boto3.client('ec2',
                       region_name=region,
                      aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
                      aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
                      )

    response = ec2.request_spot_instances(
        InstanceCount=1,
        Type='one-time',
        LaunchSpecification={
            'ImageId': get_ubuntu_ami_id(region),
            'InstanceType': instance_type,
            'KeyName': key_name,
            'SecurityGroupIds': [security_group_id],
            'UserData': base64.b64encode(user_data.encode('utf-8')).decode('utf-8'),
            'IamInstanceProfile': {
                'Name': iam_instance_profile_name
            },
        },
        SpotPrice=str(max_price),
    )
    request_id = response['SpotInstanceRequests'][0]['SpotInstanceRequestId']
    print(f"Spot instance requested. Request ID: {request_id}")

    # Wait for the spot instance to be fulfilled
    instance_id = wait_for_spot_instance(ec2, request_id)
    print(f"Spot instance launched. Instance ID: {instance_id}")

    return instance_id

def wait_for_spot_instance(ec2, request_id):
    """Waits until the spot instance request is fulfilled."""
    while True:
        response = ec2.describe_spot_instance_requests(SpotInstanceRequestIds=[request_id])
        if 'InstanceId' in response['SpotInstanceRequests'][0]:
            return response['SpotInstanceRequests'][0]['InstanceId']
        print("Waiting for spot instance to be fulfilled...")
        time.sleep(10)

def start_spot_instance(region, instance_type, max_price, key_name, security_group_id, iam_instance_profile_name, script_file, script_param):
    """Starts a spot instance with the specified parameters and runs the script with parameter."""
    # Read the script file
    with open(script_file, 'r') as file:
        init_script = file.read()

    # Create the user data script
    user_data = f"""#!/bin/bash
# Install AWS CLI if not already installed
if ! command -v aws &> /dev/null
then
    apt-get update
    apt-get install -y awscli
fi
apt install -y python3-pip
apt install -y ffmpeg
sudo -u ubuntu pip3 install --user flask_sqlalchemy boto3 psycopg2-binary
# Alternatively, retrieve secrets from SSM Parameter Store
DB_USER_PASSWORD=$(aws ssm get-parameter --name db_user_password --region {region} --with-decryption --query Parameter.Value --output text)
S3_AWS_ACCESS_KEY=$(aws ssm get-parameter --name s3_aws_access_key --region {region} --with-decryption --query Parameter.Value --output text)

# Export the secret as an environment variable
export DB_PASSWORD="$DB_USER_PASSWORD"
export AWS_SECRET_ACCESS_KEY="$S3_AWS_ACCESS_KEY"
# Write the script to a file
cat <<'EOF' > /home/ubuntu/process_job.py
{init_script}
EOF
# Run the script with parameter
python3 /home/ubuntu/process_job.py "{script_param}"
"""

    instance_id = request_spot_instance(region, instance_type, max_price, user_data, key_name, security_group_id, iam_instance_profile_name)
    print(f"Spot instance {instance_id} is now running.")
    public_ip = get_instance_public_ip(region, instance_id)
    print(f"Public IP address of the instance: {public_ip}")
    return instance_id, public_ip


def get_spot_request_id(region, instance_id):
    """Retrieves the spot instance request ID associated with the instance."""
    ec2 = boto3.client('ec2',
                       region_name=region,
                      aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
                      aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
                      )
    response = ec2.describe_instances(InstanceIds=[instance_id])
    reservations = response.get('Reservations', [])
    if reservations:
        instance = reservations[0]['Instances'][0]
        if 'SpotInstanceRequestId' in instance:
            return instance['SpotInstanceRequestId']
    return None

def shutdown_spot_instance(region, instance_id):
    """
    Terminates the specified spot instance and cancels the spot request if necessary.
    """
    ec2 = boto3.client('ec2',
                       region_name=region,
                      aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
                      aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
                      )
    
    # Cancel the spot instance request
    try:
        spot_request_id = get_spot_request_id(region, instance_id)
        if spot_request_id:
            print(f"Spot request ID for instance {instance_id} is {spot_request_id}")
            response = ec2.cancel_spot_instance_requests(SpotInstanceRequestIds=[spot_request_id])
            print(f"Spot instance request {spot_request_id} canceled. reponse:{response}")
        else:
            print(f"No spot request ID found for instance {instance_id}, skip shutdown")
            spot_request_id = ''  # Set to empty string to avoid errors
    except Exception as e:
        print(f"Error canceling spot instance request {spot_request_id}: {e}")
    
    # Terminate the instance
    try:
        response = ec2.terminate_instances(InstanceIds=[instance_id])
        print(f"Termination initiated for instance {instance_id}")
    except Exception as e:
        print(f"Error terminating instance {instance_id}: {e}")
        return
    
    # Wait until the instance is terminated
    print(f"Waiting for instance {instance_id} to terminate...")
    waiter = ec2.get_waiter('instance_terminated')
    waiter.wait(InstanceIds=[instance_id])
    print(f"Instance {instance_id} has been terminated.")


def create_ec2_instance_and_run_job(job_id):
    region = 'us-west-2'  # Replace with your AWS region
    instance_type = 'r6a.large' # 'r7a.medium' 'c6a.large' 'c6i.large' 'c7i-flex.large'
    max_price = 0.05  # Maximum hourly price in USD
    key_name = 'wayne-ec2'  # Replace with your key pair name
    security_group_id = 'sg-0ff4538d7ad123896'  # launch-wizard-18, only open port 22
    iam_instance_profile_name = 'ReadAccessForParameterStore'  # Replace with your IAM role name
    script_file = job_script_file  # Replace with your script file name
    script_param = job_id  # Replace with the parameter to pass to the script

    instance_id, public_ip = start_spot_instance(
        region,
        instance_type,
        max_price,
        key_name,
        security_group_id,
        iam_instance_profile_name,
        script_file,
        script_param
    )
    return instance_id, public_ip, region