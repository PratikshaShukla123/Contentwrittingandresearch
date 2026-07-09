from fastapi import Request, status
from fastapi.responses import JSONResponse
from app.core.logging import logger

class AIProcessingError(Exception):
    """Exception raised for errors during AI Agent processing."""
    def __init__(self, message: str):
        self.message = message

async def global_exception_handler(request: Request, exc: Exception):
    """
    Handle generic unhandled exceptions globally to prevent server crashes
    and log the exact trace.
    """
    logger.error(f"Unhandled Exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected internal server error occurred. Please try again later."},
    )

async def ai_processing_exception_handler(request: Request, exc: AIProcessingError):
    """
    Handle failures in the LangGraph agent pipelines gracefully.
    """
    logger.warning(f"AI Agent Error: {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": f"AI Processing Error: {exc.message}"},
    )
