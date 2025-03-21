import os
import jwt
from fastapi import Depends, HTTPException, Request, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from db import get_user_by_id

JWT_SECRET = str(os.getenv("JWT_SECRET"))

security = HTTPBearer()

def get_current_user(auth: HTTPAuthorizationCredentials = Security(security),):
        token = auth.credentials
        try:
                payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
                print("Invalid Token, expired")
                return None
        except jwt.InvalidTokenError:

                print("Invalid Token")
                return None
        user_id = payload.get("id")
        if not user_id:
                raise HTTPException(status_code=401, detail="id not found")
        user = get_user_by_id(user_id)
        user = {
          "id": user["id"],
          "chats": user["chats"],
          "email": user["email"],
          "firstName": user["firstName"],
          "lastName": user["lastName"],
          "graduationYear": user["graduationYear"],
          "resumes": user["resumes"]
        }
        return user
        