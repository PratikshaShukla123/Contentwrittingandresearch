import logging
import sys

def setup_logging():
    logging.basicConfig(
        stream=sys.stdout,
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )
    # Ensure uvicorn logs are properly captured
    logging.getLogger("uvicorn.access").handlers = []
    
    return logging.getLogger("ai_grant_writing")

logger = setup_logging()
