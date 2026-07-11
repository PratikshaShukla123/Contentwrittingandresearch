from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    project_id: Optional[int] = None

class ChatResponse(BaseModel):
    role: str = "ai"
    content: str

from datetime import datetime

class ChatMessageResponse(BaseModel):
    id: int
    project_id: Optional[int]
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
