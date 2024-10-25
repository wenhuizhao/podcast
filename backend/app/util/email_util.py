# utils.py
import boto3
from botocore.exceptions import ClientError

def send_email(to_email, subject, body_text, body_html=None):
    # Replace sender@example.com with your "From" address.
    # This address must be verified with Amazon SES.
    SENDER = "Admin<admin@notebookvideo.com>"  # Replace with your verified sender email

    # If necessary, replace us-east-1 with the AWS Region you're using for SES.
    AWS_REGION = "us-west-2"

    # Create a new SES resource and specify the AWS Region.
    client = boto3.client('ses', region_name=AWS_REGION)

    # The character encoding for the email.
    CHARSET = "UTF-8"

    # Try to send the email.
    try:
        # Provide the contents of the email.
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    to_email,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': body_html or body_text,
                    },
                    'Text': {
                        'Charset': CHARSET,
                        'Data': body_text,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': subject,
                },
            },
            Source=SENDER,
            # If you are not using a configuration set, comment or delete the following line
            # ConfigurationSetName=CONFIGURATION_SET,
        )
    except ClientError as e:
        # Log or handle the exception as needed
        print(f"Error sending email: {e.response['Error']['Message']}")
    else:
        # Log the response or proceed as needed
        print(f"Email sent! Message ID: {response['MessageId']}")
