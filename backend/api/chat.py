from fastapi import APIRouter, Request, UploadFile, File, Form, HTTPException, Depends
from middleware.get_current_user import get_current_user
from db import get_chat_by_id, update_chat, create_chat, get_user_by_id, update_user_resumes, update_user_chats, get_chat_messages_by_id, update_chat_messages, get_user_chats
from actions.upload_s3 import upload_file_to_s3, upload_thumbnail_to_s3
from models.chat import ResumeReviewChat
from models.chat import ChatMessage
from fastapi.responses import StreamingResponse
from datetime import datetime, timezone
import fitz
from utils.pinecone_utils import retrieve_relevant_chunks, push_to_pinecone 
from utils.llm_utils import query_deepseek_model
import json
import base64



router = APIRouter()

def generate_thumbnail(pdf_bytes: bytes, page_num: int = 0):
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    page = doc.load_page(page_num)
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2)) 
    image_bytes = pix.tobytes("png")
    return image_bytes

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

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
  
        thumbnail = generate_thumbnail(resume_bytes, 0)
        thumbnail_url = await upload_thumbnail_to_s3(file=thumbnail, userid=userId)
        
        chat.thumbnail = thumbnail_url
        
        # update_user_resumes(userId, resume_url)
        create_chat(chat.model_dump())
        update_user_chats(userId, chat.id)

        encoded_resume = base64.b64encode(resume_bytes).decode("utf-8")
        return {"user": userId, "chat": chat.id, "resume": encoded_resume, "resume_name": filename, "job_description": jobDescription, "status": 200 }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error uploading resume: {str(e)}")
    

@router.get("/chat/get/{id}/messages")
async def get_chat_messages(id: str, request: Request):
    try:
        messages = get_chat_messages_by_id(id)
        
        return {"messages": messages}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/chat/get/{id}")
async def get_chat(id: str, request: Request):
    try:
        chat = get_chat_by_id(id)
        if not chat:
            print("here")
            return HTTPException(status_code=404, detail="chat not found")
        return {"chat": chat, "status": 200}
    except Exception as e:
        print("error", e)
        raise HTTPException(status_code=500, detail=str(e))

#get the chats using the filters in the request
@router.post("/chat/get")
async def fetch_chats(request: Request):
    try:
        form = await request.form()

        userId = form.get("userid")
        query = form.get("query")
        chats = get_user_chats(userId)
        if query:
            lower = query.lower()
            chats = [
                chat for chat in chats 
                if lower in chat.get("title", "").lower()
            ]

            return {"chats": chats}

        return {"chats": chats}
    
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/chat/ask/{chat_id}")
async def ask_chat(
    chat_id: str,
    request: Request,
):
    try:
        print("stream request recieved")
        form = await request.form()
        user_id = form.get("userId") #change this to a getCurrentUser function instead of passsing it as a form field
        resume = form.get("resume")
        query = form.get("query")

        user = get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=403, detail="User forbidden")

        chat = get_chat_by_id(chat_id)
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        if chat["userid"] != user_id:
            raise HTTPException(status_code=403, detail="not user's chat")
        
        chat_messages = get_chat_messages_by_id(chat_id)
        history_text = "\n\n".join(
            [f"{msg['role'].capitalize()}: {msg.get('content', '')}" for msg in chat_messages if msg.get('content')]
        )
        resume_text = ""
        resume_msg = None
        if resume:
            resume_url, resume_bytes = await upload_file_to_s3(file=resume, userid=user_id, chatid=chat_id)
            update_user_resumes(user_id=user_id, resume_url=resume_url)
            resume_text = extract_text_from_pdf(resume_bytes)

            filename = resume.filename
            resume_msg = ChatMessage(
                role="user",
                file_url=resume_url,
                content=resume_text,
                file_name=filename,
                timestamp=datetime.now(timezone.utc).isoformat()
            )
            chat_messages.append(resume_msg.model_dump())

        user_msg = None
        if query:
            user_msg = ChatMessage(
                role="user",
                content=query,
                timestamp=datetime.now(timezone.utc).isoformat()
            )
            chat_messages.append(user_msg.model_dump())
        
        pinecone_context = []
        if not query:
            pinecone_context = retrieve_relevant_chunks(resume_text, chat_id)
        else:
            pinecone_context = retrieve_relevant_chunks(query + resume_text, chat_id)

        print(pinecone_context)
        # push_to_pinecone(query, resume_text)
        # print(pinecone_context)
        full_prompt = f"""
            Context:
            {pinecone_context}
            Chat History:
            {history_text}
            Resume Info:
            {resume_text}
            User Query:
            {query}
        """

        system_prompt = f"""
            Some things to keep in mind:
            - Your goal is to be a resume coach: dont just comment on the formatting, also comment on the content
            - When answering questions, make sure you use the context given as a reference for what ideal resumes look like, not just the formatting, but also the content within them.
            - Dont talk about the context, just use it in your responses.
            - Make it second person. 
            Formatting Instructions (do not mention these to the user):
            - Make only single space newlines, not multiple spaces
            - Render all mathematical equations using **LaTeX**, enclosed in $...$ for inline or $$...$$ for block
            - Do not talk about the formatting choices; just follow them"""
        
        def deepseek_stream_with_metadata(prompt: str, chat_id: str, user_msg: ChatMessage, resume_msg: ChatMessage):
            full_response = ""
            yield f"data: {json.dumps({'userMsg': user_msg.model_dump() if user_msg else None, 'resumeMsg': resume_msg.model_dump() if resume_msg else None})}\n"

            for chunk in query_deepseek_model(prompt, system_prompt=system_prompt):
                full_response += chunk
                yield f"data: {json.dumps({'token': chunk})}\n"

            assistant_msg = ChatMessage(
                role="assistant",
                content=full_response,
                timestamp=datetime.now(timezone.utc).isoformat()
            )
            chat_messages.append(assistant_msg.model_dump())
            update_chat_messages(chat_id, chat_messages)

            yield "data: [DONE]\n"

        return StreamingResponse(deepseek_stream_with_metadata(full_prompt, chat_id, user_msg, resume_msg))
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
