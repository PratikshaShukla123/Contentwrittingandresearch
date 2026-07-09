from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    version = Column(Integer, default=1)
    status = Column(String, default="draft")  # draft, reviewing, complete
    content = Column(JSON) # Store structured sections (executive summary, background, etc)
    
    project = relationship("Project", back_populates="proposals")
