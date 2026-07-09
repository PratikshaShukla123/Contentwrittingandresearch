import os
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from app.core.config import settings

CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(__file__), "../../chroma_data")

def get_embeddings():
    """
    Get the embedding model. Uses OpenAI by default.
    """
    if settings.OPENAI_API_KEY:
        return OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY)
    # Fallback to dummy embeddings if no key is present for testing
    from langchain_community.embeddings import FakeEmbeddings
    return FakeEmbeddings(size=1536)

def get_vector_store(collection_name: str = "grants_and_literature") -> Chroma:
    """
    Initialize and return the Chroma vector store instance.
    """
    embeddings = get_embeddings()
    vector_store = Chroma(
        collection_name=collection_name,
        embedding_function=embeddings,
        persist_directory=CHROMA_PERSIST_DIR,
    )
    return vector_store
