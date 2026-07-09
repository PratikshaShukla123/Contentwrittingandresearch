from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check():
    """
    Check if the API is running correctly.
    """
    return {"status": "ok", "message": "AI Grant Writing API is running."}
