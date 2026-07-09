from unittest.mock import patch, MagicMock
from app.services.rag_service import add_documents_to_rag, search_documents

@patch("app.services.rag_service.get_vector_store")
def test_add_documents_to_rag(mock_get_vs):
    mock_vs = MagicMock()
    mock_get_vs.return_value = mock_vs
    
    add_documents_to_rag(["This is a test doc"], [{"source": "test"}])
    mock_vs.add_documents.assert_called_once()

@patch("app.services.rag_service.get_vector_store")
def test_search_documents(mock_get_vs):
    mock_vs = MagicMock()
    mock_doc = MagicMock()
    mock_doc.page_content = "This is a test doc"
    mock_vs.similarity_search.return_value = [mock_doc]
    mock_get_vs.return_value = mock_vs
    
    results = search_documents("test", k=5)
    assert len(results) == 1
    assert results[0].page_content == "This is a test doc"
    mock_vs.similarity_search.assert_called_once_with("test", k=5)
