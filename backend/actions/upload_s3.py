import boto3
import os
import uuid
from botocore.exceptions import NoCredentialsError

s3_client = boto3.client("s3")
S3_BUCKET = os.getenv("S3_BUCKET_NAME")

# def upload_file_to_s3(file, userid: str, chatid: str):
   