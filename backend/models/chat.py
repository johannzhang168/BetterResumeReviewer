import uuid
from pydantic import BaseModel, Field
from typing import List
import datetime
from datetime import date

class ResumeReviewChat(BaseModel):
        id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="unique identifier for chat")
        userid: str = Field(..., description="userid that the chat is connected to")
        resumes: List[str] = Field(..., description="list of S3 links to user resumes")
        name: str = Field(...)
        thumbnail: str = Field(..., description="this will just be a image of the first resume that the user uploads when making chat")
        #chatbot stuff
        dateCreated: date = Field(default_factory= datetime.utcnow) 