from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .grant import GrantResponse
from .proposal import ProposalResponse

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    title: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    grants: List[GrantResponse] = []
    proposals: List[ProposalResponse] = []

    class Config:
        from_attributes = True
