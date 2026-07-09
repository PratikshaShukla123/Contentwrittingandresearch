from unittest.mock import patch, MagicMock
from app.agents.state import GrantState
from app.agents.compliance import compliance_node
from app.agents.review import review_node
from app.agents.budget import budget_node

@patch("app.agents.compliance.get_llm")
def test_compliance_node(mock_get_llm):
    # Setup mock LLM
    mock_llm = MagicMock()
    mock_response = MagicMock()
    mock_response.content = '{"passed": true, "notes": "Looks good"}'
    mock_llm.invoke.return_value = mock_response
    mock_get_llm.return_value = mock_llm

    state: GrantState = {
        "research_topic": "AI Testing",
        "proposal_draft": {"title": "Test Title"},
        "budget": {"total": 5000}
    }

    result = compliance_node(state)
    
    assert "compliance_report" in result
    assert result["compliance_report"]["passed"] is True
    mock_llm.invoke.assert_called_once()

@patch("app.agents.review.get_llm")
def test_review_node(mock_get_llm):
    mock_llm = MagicMock()
    mock_response = MagicMock()
    mock_response.content = '{"quality_score": 0.85, "feedback": "Solid draft"}'
    mock_llm.invoke.return_value = mock_response
    mock_get_llm.return_value = mock_llm

    state: GrantState = {
        "proposal_draft": {"title": "Test"},
        "iteration_count": 0
    }

    result = review_node(state)
    
    assert "quality_score" in result
    assert result["quality_score"] == 0.85
    assert result["iteration_count"] == 1
    mock_llm.invoke.assert_called_once()

@patch("app.agents.budget.get_llm")
def test_budget_node(mock_get_llm):
    mock_llm = MagicMock()
    mock_response = MagicMock()
    mock_response.content = '{"total_amount": 10000, "line_items": [{"description": "Servers", "cost": 10000}]}'
    mock_llm.invoke.return_value = mock_response
    mock_get_llm.return_value = mock_llm

    state: GrantState = {
        "proposal_draft": {"methodology": "We need servers"}
    }

    result = budget_node(state)
    
    assert "budget" in result
    assert result["budget"]["total_amount"] == 10000
    mock_llm.invoke.assert_called_once()
