from fastapi import APIRouter, Request, HTTPException
from auth.oauth import oauth
from db import get_user_by_email, create_user
import datetime
import jwt
import os
from dotenv import load_dotenv
import uuid
import bcrypt
from models.user import User
from starlette.responses import RedirectResponse
from fastapi.responses import HTMLResponse


load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
BASE_URL = os.getenv("BASE_URL")

router = APIRouter()

def generate_jwt(user):
    payload = {
        "id": user["id"],
        "email": user["email"],
        "authProvider": user["authProvider"],
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


@router.get("/auth/github")
async def github_login(request: Request):
    redirect_uri = f"{BASE_URL}/auth/github/callback"
    redirect_response = await oauth.github.authorize_redirect(request, redirect_uri)
    redirect_url = redirect_response.headers["location"]
    return RedirectResponse(redirect_url)

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
        return HTMLResponse(f"""
        <script>
            window.opener.postMessage({{
                token: "{jwt_token}",
                user: {{
                    id: "{existing_user['id']}",
                    email: "{email}",
                    firstName: "{existing_user['firstName']}",
                    lastName: "{existing_user['lastName']}",
                    resumes: "{existing_user['resumes']}",
                    chats: "{existing_user['chats']}",
                    graduationYear: "{existing_user['graduationYear']}"
                }}
            }}, "*");
            window.close();
        </script>
        """)

    new_user = User(
        id=str(uuid.uuid4()),
        firstName= user_info.get("name", "").split()[0] if user_info.get("name") else None,
        lastName= user_info.get("name", "").split()[-1] if user_info.get("name") else None,
        email= email,
        hashedPassword=None,
        graduationYear=None,
        resumes=[],
        chats=[],
        dateCreated=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        authProvider="github",

    )
    create_user(new_user.model_dump())

    jwt_token = generate_jwt(new_user.model_dump())
    return HTMLResponse(f"""
        <script>
            window.opener.postMessage({{
                token: "{jwt_token}",
                user: {{
                    id: "{new_user.id}",
                    email: "{email}",
                    firstName: "{new_user.firstName}",
                    lastName: "{new_user.lastName}",
                    resumes: "{existing_user['resumes']}",
                    chats: "{existing_user['chats']}",
                    graduationYear: "{existing_user['graduationYear']}"
                }}
            }}, "*");
            window.close();
        </script>
    """)

@router.get("/auth/google")
async def google_login(request: Request):
    redirect_uri=f"{BASE_URL}/auth/google/callback"
    redirect_response = await oauth.google.authorize_redirect(request, redirect_uri)
    redirect_url = redirect_response.headers["location"]
    return RedirectResponse(redirect_url)

@router.get("/auth/google/callback")
async def google_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_data = await oauth.google.get("userinfo", token=token)
        user_info = user_data.json()

        email = user_info.get("email")
        existing_user = get_user_by_email(email)

        if existing_user:
            jwt_token = generate_jwt(existing_user)
            return HTMLResponse(f"""
            <script>
                window.opener.postMessage({{
                    token: "{jwt_token}",
                    user: {{
                        id: "{existing_user['id']}",
                        email: "{email}",
                        firstName: "{existing_user['firstName']}",
                        lastName: "{existing_user['lastName']}",
                        graduationYear: "{existing_user['graduationYear']}",
                        resumes: "{existing_user['resumes']}",
                        chats: "{existing_user['chats']}"
                    }}
                }}, "*");
                window.close();
            </script>
            """)
        new_user = User(
            id=str(uuid.uuid4()),
            firstName=user_info.get("given_name"),
            lastName=user_info.get("family_name"),
            email=email,
            hashedPassword=None, 
            graduationYear=None,
            resumes=[],
            chats=[],
            dateCreated=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            authProvider="google",
        )
        create_user(new_user.model_dump())

        jwt_token = generate_jwt(new_user.model_dump())
        return HTMLResponse(f"""
            <script>
                window.opener.postMessage({{
                    token: "{jwt_token}",
                    user: {{
                        id: "{new_user.id}",
                        email: "{email}",
                        firstName: "{new_user.firstName}",
                        lastName: "{new_user.lastName}",
                        resumes: "{existing_user['resumes']}",
                        chats: "{existing_user['chats']}"
                    }}
                }}, "*");
                window.close();
            </script>
        """)
    except Exception as e:
        print("OAuth Error:", str(e))
        return HTMLResponse("""
            <script>
                window.close();
            </script>
        """)

@router.post("/login")
async def login(request: Request):
    data = await request.json()
    user = get_user_by_email(data['email'])
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    
    
    match_password = False
    if(user["hashedPassword"]):
        match_password = bcrypt.checkpw(user["hashedPassword"].encode("utf-8"), request.password.encode("utf-8"))
    if not match_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    jwt = generate_jwt(user)
    return {"token": jwt, "user": user}

@router.post("/signup")
async def signup(request: Request):
    data = await request.json()
    
    user = get_user_by_email(data["email"])
    if user:
        raise HTTPException(status_code=409, detail="User with this email exists")
    
    hashedPassword = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    new_user = User(
        id= str(uuid.uuid4()),
        firstName= data["firstName"],
        lastName= data["lastName"],
        email= data["email"],
        hashedPassword= hashedPassword, 
        graduationYear=data["graduationYear"],
        resumes= [],
        chats= [],
        dateCreated=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        authProvider= "local"
    )

    create_user(new_user.model_dump())

    jwt_token = generate_jwt(new_user.model_dump())
    return {"user": new_user.model_dump(), "token": jwt_token}



