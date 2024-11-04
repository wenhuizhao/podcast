from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm.exc import NoResultFound
import os
import sys
import subprocess
import traceback
import boto3, botocore

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY', 'AKIAYRS2JETHFEK5G3WO'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)
ssm_client = boto3.client("ssm")

db = SQLAlchemy()
db_host = os.getenv('DB_HOST', 'db.notebookvideo.com')
db_username = os.getenv('DB_USERNAME', 'postgres')
db_password = os.getenv('DB_PASSWORD', 'postgres')
db_name = os.getenv('DB_NAME', 'notebookvideo')
database_url = f"postgresql://{db_username}:{db_password}@{db_host}/{db_name}"
print(f"dburl: {database_url}")
engine = db.create_engine(database_url)
Session = sessionmaker(bind=engine)
session = Session()


ffmpeg = os.getenv('FFMPEG', 'ffmpeg')
output_video_path = os.getenv('downloads/', '')


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150))
    is_verified = db.Column(db.Boolean, default=False)
    google_id = db.Column(db.String(150), unique=True)
    time_created = db.Column(db.DateTime(timezone=True), server_default=func.now())
    time_updated = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    time_subscribed = db.Column(db.DateTime(timezone=True))

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.String(150), index=True)
    title = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), index=True, nullable=True)
    session_id =db.Column(db.String(150), index=True)
    status = db.Column(db.String(150))
    output = db.Column(db.Text)
    error = db.Column(db.Text)
    command = db.Column(JSONB)
    time_created = db.Column(db.DateTime(timezone=True), server_default=func.now())
    time_updated = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    time_start_process = db.Column(db.DateTime(timezone=True))
    process_host = db.Column(db.String(150))
    process_id = db.Column(db.String(150))
    user = db.relationship("User", backref="jobs")


def upload_filename_to_s3(filename, acl="public-read"):
    bucket = os.getenv("AWS_BUCKET_NAME", 'notebookvideo')
    key = filename
    try:
        s3.upload_file(
            Filename = filename,
            Bucket = bucket,
            Key = key,
            ExtraArgs={
                "ACL": acl
            }
        )

    except Exception as e:
        # This is a catch all exception, edit this part to fit your needs.
        print("Something Happened: ", e)
        raise e
    
    url = f'https://{bucket}.s3.amazonaws.com/{key}'
    # after upload file to s3 bucket, return filename of the uploaded file
    return url

def process_job(job_id):
  output_video_path = f"{os.getenv('DOWNLOAD_FOLDER', '')}{job_id}.mp4" 
  try:
    job = session.execute(db.select(Job).filter_by(job_id=job_id)).scalar_one()
    if job.status == 'completed' and not job.output == None:
       print(f"job:{job_id} already processed")
       return
    commands = job.command
    job.status = 'processing'
    session.commit()
    command_run = [ffmpeg] + [cmd for cmd in commands] + [output_video_path]
    print(f"ffmpeg {' '.join(commands)} {output_video_path}", flush=True)
    # Run ffmpeg command
    subprocess.run(command_run, check=True)

    video_url = upload_filename_to_s3(output_video_path)
    job.output = video_url
    job.status = "completed"

    session.commit()
  except NoResultFound as err:
     print(f"Invalid job_id:{job_id}")
  except Exception as err:
    traceback.print_exc()
    job.error = str(err)
    job.status = 'failed'
    session.commit()
  print(f"done process job: {job_id}")
