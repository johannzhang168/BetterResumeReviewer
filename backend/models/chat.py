import uuid
from pydantic import BaseModel, Field
from typing import List, Optional
import datetime
from datetime import datetime

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique message ID")
    role: str = Field(..., description="Either 'user' or 'assistant'")
    content: Optional[str] = Field(None, description="Text message content (if applicable)")
    file_url: Optional[str] = Field(None, description="S3 link to the uploaded file (if applicable)")
    file_name: Optional[str] = Field(None, description="Original name of the uploaded file")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Message timestamp")

class ResumeReviewChat(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique chat ID")
    userid: str = Field(..., description="User ID associated with this chat")
    resumes: List[str] = Field(default=[], description="List of S3 links to user resumes uploaded during chat")
    name: str = Field(...)
    thumbnail: str = Field(..., description="Image of the first uploaded resume")
    
    messages: List[ChatMessage] = Field(default=[], description="List of messages exchanged in the chat")

    model: str = Field(default="gpt-4o", description="OpenAI model being used")
    temperature: float = Field(default=0.7, description="Creativity setting for the LLM")
    max_tokens: int = Field(default=4096, description="Token limit per request")
    total_tokens_used: int = Field(default=0, description="Track total tokens used in this chat")

    dateCreated: datetime = Field(default_factory=datetime.utcnow)
    lastUpdated: datetime = Field(default_factory=datetime.utcnow)
