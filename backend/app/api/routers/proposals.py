from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.proposal import Proposal
from app.models.project import Project
from app.models.user import User
from app.schemas.proposal import ProposalCreate, ProposalResponse

router = APIRouter()

@router.post("/", response_model=ProposalResponse)
def create_proposal(
    *,
    db: Session = Depends(get_db),
    proposal_in: ProposalCreate,
    current_user: User = Depends(get_current_user),
) -> Proposal:
    project = db.query(Project).filter(Project.id == proposal_in.project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    proposal = Proposal(**proposal_in.dict())
    db.add(proposal)
    db.commit()
    db.refresh(proposal)
    return proposal

@router.get("/project/{project_id}", response_model=List[ProposalResponse])
def read_proposals_by_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[Proposal]:
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db.query(Proposal).filter(Proposal.project_id == project_id).all()
