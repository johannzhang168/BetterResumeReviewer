import uuid
from pydantic import BaseModel, Field
from typing import List, Optional
import datetime
from datetime import datetime, timezone
from decimal import Decimal

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique message ID")
    role: str = Field(..., description="Either 'user' or 'assistant'")
    content: Optional[str] = Field(None, description="Text message content (if applicable)")
    file_url: Optional[str] = Field(None, description="S3 link to the uploaded resume")
    file_name: Optional[str] = Field(None, description="Original name of the uploaded resume")
    timestamp: str = Field(default_factory = lambda:  datetime.now(timezone.utc).isoformat(), description="Message timestamp")

class ResumeReviewChat(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique chat ID")
    userid: str = Field(..., description="User ID associated with this chat")
    resumes: List[str] = Field(default=[], description="List of S3 links to user resumes uploaded during chat")
    name: str = Field(...)
    thumbnail: Optional[str] = Field(None, description="Image of the first uploaded resume")
    
    messages: List[ChatMessage] = Field(default=[], description="List of messages exchanged in the chat")

    model: str = Field(default="deepseek-v1", description="model being used")
    temperature: Decimal = Field(default=Decimal("0.7"), description="Creativity setting for the LLM")
    max_tokens: int = Field(default=4096, description="Token limit per request")
    total_tokens_used: int = Field(default=0, description="Track total tokens used in this chat")
    dateCreated: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())    
    lastUpdated: Optional[str] = Field(default = None)
