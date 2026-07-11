from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers import api_router
from app.core.exceptions import global_exception_handler, ai_processing_exception_handler, AIProcessingError
from app.core.logging import logger
from app.db.base import Base
from app.db.session import engine
# Import all models to register them on Base.metadata
from app.models import User, Project, Grant, Proposal, ChatMessage
import time
from fastapi import Request

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include routers
app.include_router(api_router, prefix=settings.API_V1_STR)

# Initialize database
Base.metadata.create_all(bind=engine)



# Exception Handlers
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(AIProcessingError, ai_processing_exception_handler)

# Logging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    formatted_process_time = '{0:.2f}'.format(process_time)
    logger.info(f"Method={request.method} Path={request.url.path} Status={response.status_code} Time={formatted_process_time}ms")
    return response

@app.get("/")
def root():
    return {"message": f"Welcome to the {settings.PROJECT_NAME} API"}
