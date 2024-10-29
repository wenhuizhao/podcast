import os
from werkzeug.utils import secure_filename
from app.util.file_util import generate_unique_filename
import boto3, botocore
print(f"aws access key: ${os.getenv('AWS_ACCESS_KEY')}")
s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)
def upload_file_to_s3(file, acl="public-read"):
    filename = secure_filename(file.filename)
    bucket = os.getenv("AWS_BUCKET_NAME")
    key = generate_unique_filename(filename)
    try:
        s3.upload_fileobj(
            file,
            bucket,
            key,
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )

    except Exception as e:
        # This is a catch all exception, edit this part to fit your needs.
        print("Something Happened: ", e)
        return e
    
    url = f'https://{bucket}.s3.amazonaws.com/{key}'
    # after upload file to s3 bucket, return filename of the uploaded file
    return url

def upload_filename_to_s3(filename, acl="public-read"):
    bucket = os.getenv("AWS_BUCKET_NAME")
    key = generate_unique_filename(filename)
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