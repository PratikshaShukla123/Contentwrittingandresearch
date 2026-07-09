import json
from app.agents.state import GrantState
from app.services.llm_service import get_llm

def budget_node(state: GrantState):
    """
    Agent responsible for generating a line-item budget for the proposal.
    """
    topic = state.get("research_topic", "")
    proposal_draft = state.get("proposal_draft", {})
    
    llm = get_llm()
    
    prompt = f"""
    You are an expert grant budget estimator. Draft a realistic budget for a research project.
    Topic: {topic}
    Proposal Title: {proposal_draft.get("title", "")}
    
    Respond ONLY with a valid JSON object containing the following keys:
    - "total": an integer representing the total budget amount in USD.
    - "items": a list of objects, each with "description" (string) and "amount" (integer).
    """
    
    response = llm.invoke(prompt)
    
    # Simple JSON parsing
    try:
        content = response.content
        if content.startswith("```json"):
            content = content[7:-3]
        elif content.startswith("```"):
            content = content[3:-3]
        budget = json.loads(content.strip())
    except Exception:
        # Fallback if parsing fails
        budget = {
            "total": 50000,
            "items": [
                {"description": "Personnel", "amount": 30000},
                {"description": "Equipment", "amount": 10000},
                {"description": "Travel & Supplies", "amount": 10000}
            ]
        }
    
    return {
        "budget": budget,
        "next_node": "Supervisor"
    }
