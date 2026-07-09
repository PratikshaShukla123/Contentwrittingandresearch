from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.grant import Grant
from app.models.project import Project
from app.models.user import User
from app.schemas.grant import GrantCreate, GrantResponse

router = APIRouter()

@router.post("/", response_model=GrantResponse)
def create_grant(
    *,
    db: Session = Depends(get_db),
    grant_in: GrantCreate,
    current_user: User = Depends(get_current_user),
) -> Grant:
    # Verify project belongs to user
    project = db.query(Project).filter(Project.id == grant_in.project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    grant = Grant(**grant_in.dict())
    db.add(grant)
    db.commit()
    db.refresh(grant)
    return grant

@router.get("/project/{project_id}", response_model=List[GrantResponse])
def read_grants_by_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[Grant]:
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db.query(Grant).filter(Grant.project_id == project_id).all()
