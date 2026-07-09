from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class GrantBase(BaseModel):
    title: str
    funding_agency: Optional[str] = None
    deadline: Optional[datetime] = None
    amount: Optional[float] = None
    requirements: Optional[str] = None

class GrantCreate(GrantBase):
    project_id: int

class GrantUpdate(GrantBase):
    title: Optional[str] = None

class GrantResponse(GrantBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True
