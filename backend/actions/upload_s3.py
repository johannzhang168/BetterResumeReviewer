import boto3
import os
import uuid
import io
from botocore.exceptions import NoCredentialsError

# Fetch secrets and config
S3_ACCESS_POINT_ARN = os.getenv("AWS_S3_ACCESS_POINT_ARN")
S3_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
S3_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
S3_BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME")
REGION = os.getenv("AWS_REGION")

# Configure boto3 client for S3 with access point
s3_client = boto3.client(
    "s3",
    region_name=REGION,
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_ACCESS_KEY,
)

async def upload_file_to_s3(file, userid: str, chatid: str):
    try:
        filename = f"{userid}/{chatid}/resumes/{str(uuid.uuid4())}_{file.filename}"
        file_bytes = await file.read()
        print("file bytes read")
        if not S3_ACCESS_POINT_ARN:
            raise ValueError("S3_ACCESS_POINT_ARN environment variable not set")
        s3_client.upload_fileobj(
            Fileobj=io.BytesIO(file_bytes),
            Bucket=S3_ACCESS_POINT_ARN,
            Key=filename,
            ExtraArgs={
                "ContentType": "application/pdf",
                "ContentDisposition": "inline"
            }
        )

        file_url = f"https://{S3_BUCKET_NAME}/object/{filename}"
        return (file_url, file_bytes)

    except NoCredentialsError:
        print("AWS credentials not available.")
        return None
    except Exception as e:
        print("Upload failed:", e)
        return None

async def upload_thumbnail_to_s3(file, userid: str):
    try:
        filename = f"{userid}/thumbnails/{str(uuid.uuid4())}.png"
        if not S3_ACCESS_POINT_ARN:
            raise ValueError("S3_ACCESS_POINT_ARN environment variable not set")
        s3_client.upload_fileobj(
            Fileobj=io.BytesIO(file),
            Bucket=S3_ACCESS_POINT_ARN,
            Key=filename,
            ExtraArgs={
                "ContentType": "image/png",
                "ContentDisposition": "inline"
            }
        )
        file_url = f"https://{S3_BUCKET_NAME}/object/{filename}"
        return file_url

    except NoCredentialsError:
        print("AWS credentials not available.")
        return None
    except Exception as e:
        print("Upload failed:", e)
        return None
