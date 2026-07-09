from typing import List, Dict, Any
from langchain_core.documents import Document
from app.services.vector_store import get_vector_store

def add_documents_to_rag(texts: List[str], metadatas: List[Dict[str, Any]], collection_name: str = "grants_and_literature"):
    """
    Process and add documents to the Vector DB for RAG.
    """
    vector_store = get_vector_store(collection_name)
    documents = [Document(page_content=text, metadata=meta) for text, meta in zip(texts, metadatas)]
    vector_store.add_documents(documents)
    return True

def search_documents(query: str, k: int = 5, collection_name: str = "grants_and_literature") -> List[Document]:
    """
    Search the Vector DB for relevant documents based on semantic similarity.
    """
    vector_store = get_vector_store(collection_name)
    results = vector_store.similarity_search(query, k=k)
    return results

def get_retriever(collection_name: str = "grants_and_literature", k: int = 5):
    """
    Return a LangChain retriever interface for use in LangGraph nodes.
    """
    vector_store = get_vector_store(collection_name)
    return vector_store.as_retriever(search_kwargs={"k": k})
