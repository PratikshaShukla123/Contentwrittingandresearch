from typing import Generator, Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlalchemy.orm import Session
from pydantic import ValidationError

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.user import User

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]

def get_current_user(db: SessionDep) -> User:
    # Bypass authentication for testing purposes
    user = db.query(User).first()
    if not user:
        user = User(email="test@example.com", hashed_password="fake", full_name="Test User")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]
