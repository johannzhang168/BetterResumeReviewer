from fastapi import APIRouter, Request, UploadFile, File, Form, HTTPException, Depends
from middleware.get_current_user import get_current_user
from db import get_chat_by_id, update_chat, create_chat, get_user_by_id, update_user_resumes, update_user_chats
from actions.upload_s3 import upload_file_to_s3, upload_thumbnail_to_s3
from models.chat import ResumeReviewChat
from models.chat import ChatMessage
from datetime import datetime
import fitz


router = APIRouter()

def generate_thumbnail(pdf_bytes: bytes, page_num: int = 0):
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    page = doc.load_page(page_num)
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2)) 
    image_bytes = pix.tobytes("png")
    return image_bytes

@router.post("/chat/create")
async def createChat(request: Request):
    try:
        form = await request.form()
        userId = form.get("userId")
        chatName = form.get("chatName")
        jobDescription = form.get("jobDescription")
        resume = form.get("resume")
        user = get_user_by_id(userId)

        if not user:
            raise HTTPException(status_code=403, detail="User forbidden")


        chat = ResumeReviewChat(
            userid = userId,
            name = chatName,
        )
        
        resume_url, resume_bytes = await upload_file_to_s3(file=resume, userid=userId, chatid=chat.id)

        filename_with_id = resume_url.split("/")[-1]

        _, filename = filename_with_id.split("_", 1)

        chat.resumes.append(resume_url)

        resumeMessage = ChatMessage(
            role="user",
            file_url=resume_url,
            file_name= filename
        )
        jdMessage = ChatMessage(
            role="user",
            content=jobDescription,
        )
        chat.messages.append(resumeMessage)
        chat.messages.append(jdMessage)
        
        thumbnail = generate_thumbnail(resume_bytes, 0)
        thumbnail_url = await upload_thumbnail_to_s3(file=thumbnail, userid=userId)

        chat.thumbnail = thumbnail_url
    
        update_user_resumes(userId, resume_url)
        create_chat(chat.model_dump())
        update_user_chats(userId, chat.id)

        return {"chat": chat.id, "status": 200}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading resume: {str(e)}")
    

