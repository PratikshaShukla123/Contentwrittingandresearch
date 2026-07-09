from pydantic import BaseModel
from typing import Optional, Dict, Any

class ProposalBase(BaseModel):
    version: Optional[int] = 1
    status: Optional[str] = "draft"
    content: Optional[Dict[str, Any]] = None

class ProposalCreate(ProposalBase):
    project_id: int

class ProposalUpdate(ProposalBase):
    pass

class ProposalResponse(ProposalBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True
