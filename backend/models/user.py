from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
import datetime
from datetime import date
import uuid

class User(BaseModel):
        id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="unique identifier for user")
        firstName: Optional[str] = Field(None)
        lastName: Optional[str] = Field(None)
        email: EmailStr = Field(...)
        hashedPassword: Optional[str] = Field(None, description="password will be stored as hash for safety")
        graduationYear: Optional[int] = Field(...)
        resumes: List[str] = Field(default=[], description="list of users resumes stored as s3 links")
        chats: List[str] = Field(default=[], description="ids of the resume review chats")
        dateCreated: str = Field(default_factory=lambda: datetime.datetime.now(datetime.timezone.utc).date().isoformat())
        authProvider: str = Field(..., description="Authentication provider: google, github, local")



