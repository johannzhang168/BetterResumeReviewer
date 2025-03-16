from fastapi import APIRouter, Request, HTTPException
from auth.oauth import oauth
from db import get_user_by_email, create_user
import datetime
import jwt
import os
from dotenv import load_dotenv
import uuid
import bcrypt


load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")

router = APIRouter()

def generate_jwt(user):
    payload = {
        "id": user["id"],
        "email": user["email"],
        "authProvider": user["authProvider"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

@router.get("/auth/github/callback")
async def github_callback(request: Request):
    token = await oauth.github.authorize_access_token(request)
    user_data = await oauth.github.get("user", token=token)
    user_info = user_data.json()
    email = user_info.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="GitHub account does not have a public email")
    existing_user = get_user_by_email(email)
    if existing_user:
        jwt_token = generate_jwt(existing_user)
        return {"user": existing_user, "token": jwt_token}
    
    new_user = {
        "id": str(uuid.uuid4()),
        "firstName": user_info.get("name", "").split()[0] if user_info.get("name") else None,
        "lastName": user_info.get("name", "").split()[-1] if user_info.get("name") else None,
        "email": email,
        "hashedPassword": None, 
        "graduationYear": None,
        "resumes": [],
        "chats": [],
        "dateCreated": datetime.datetime.utcnow().isoformat(),
        "authProvider": "github"
    }
    create_user(new_user)

    jwt_token = generate_jwt(new_user)
    return {"user": new_user, "token": jwt_token}


@router.get("/auth/google/callback")
async def google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user_data = await oauth.google.get("userinfo", token=token)
    user_info = user_data.json()

    email = user_info.get("email")
    existing_user = get_user_by_email(email)

    if existing_user:
        jwt_token = generate_jwt(existing_user)
        return {"user": existing_user, "token": jwt_token}
    new_user = {
        "id": str(uuid.uuid4()),
        "firstName": user_info.get("given_name"),
        "lastName": user_info.get("family_name"),
        "email": email,
        "hashedPassword": None, 
        "graduationYear": None,
        "resumes": [],
        "chats": [],
        "dateCreated": datetime.datetime.utcnow().isoformat(),
        "authProvider": "google"
    }
    create_user(new_user)

    jwt_token = generate_jwt(new_user)
    return {"user": new_user, "token": jwt_token}

@router.post("/login")
async def login(request: Request):
    user = get_user_by_email(request.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    match_password = bcrypt.checkpw(user["hashed_password"].encode("utf-8"), request.password.encode("utf-8"))
    if not match_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    jwt = generate_jwt(user)
    return {"token": jwt, "user": user}

@router.post("/signup")
async def signup(request: Request):
    user = get_user_by_email(request.email)
    if user:
        raise HTTPException(status_code=409, detail="User with this email exists")

    hashedPassword = bcrypt.hashpw(request.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


    new_user = {
        "id": str(uuid.uuid4()),
        "firstName": request.firstName,
        "lastName": request.lastName,
        "email": request.email,
        "hashedPassword": hashedPassword, 
        "graduationYear": request.graduationYear,
        "resumes": [],
        "chats": [],
        "dateCreated": datetime.datetime.utcnow().isoformat(),
        "authProvider": "local"
    }

    create_user(new_user)

    jwt_token = generate_jwt(new_user)
    return {"user": new_user, "token": jwt_token}


