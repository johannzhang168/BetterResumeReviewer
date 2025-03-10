from fastapi import FastAPI
from mangum import Mangum
import os
import boto3

app = FastAPI()

@app.get("/")
async def read_root():
    dynamodb = boto3.resource(
        "dynamodb",
        region_name=os.getenv("AWS_REGION"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
    )
    if dynamodb:
        return {"message": "successfully initialized dynamo"}
    return {"message": "failed to initialize dynamo"}


handler = Mangum(app) #handler for lambda





