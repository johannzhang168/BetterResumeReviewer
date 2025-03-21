from fastapi import FastAPI
from mangum import Mangum
import os
import boto3
from auth.routes import router as oauth_router
from api.user import router as user_router
from starlette.middleware.sessions import SessionMiddleware 
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

FRONTEND_URL=os.getenv("FRONTEND_URL")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

app.add_middleware(SessionMiddleware, secret_key=os.getenv("SESSION_SECRET_KEY"))
app.include_router(oauth_router)
app.include_router(user_router)


handler = Mangum(app)
# @app.get("/")
# async def read_root():
#     dynamodb = boto3.resource(
#         "dynamodb",
#         region_name=os.getenv("AWS_REGION"),
#         aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
#         aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
#     )
#     if dynamodb:
#         return {"message": "successfully initialized dynamo"}
#     return {"message": "failed to initialize dynamo"}








