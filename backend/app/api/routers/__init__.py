from fastapi import APIRouter
from app.api.routers import health, projects, grants, proposals

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(grants.router, prefix="/grants", tags=["grants"])
api_router.include_router(proposals.router, prefix="/proposals", tags=["proposals"])
