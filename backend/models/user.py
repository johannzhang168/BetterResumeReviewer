from pydantic import BaseModel, EmailStr, Field
from typing import List
import datetime
from datetime import date
import uuid

class User(BaseModel):
        id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="unique identifier for user")
        firstName: str = Field(...)
        lastName: str = Field(...)
        email: EmailStr = Field(...)
        hashedPassword: str = Field(..., description="password will be stored as hash for safety")
        graduationYear: int = Field(...)
        resumes: List[str] = Field(default=[], description="list of users resumes stored as s3 links")
        chats: List[str] = Field(default=[], description="ids of the resume review chats")
        dateCreated: date = Field(default_factory= datetime.utcnow)   



