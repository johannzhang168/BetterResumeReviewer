from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from middleware import get_current_user
from db import get_chat_by_id, update_chat
from actions import upload_s3
from models import ChatMessage
from datetime import datetime




