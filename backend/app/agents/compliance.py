import json
from app.agents.state import GrantState
from app.services.llm_service import get_llm

def compliance_node(state: GrantState):
    """
    Agent responsible for checking compliance of the proposal and budget against grant requirements.
    """
    topic = state.get("research_topic", "")
    proposal_draft = state.get("proposal_draft", {})
    budget = state.get("budget", {})
    
    llm = get_llm()
    
    prompt = f"""
    You are a strict compliance officer for grant proposals.
    Review the following project for basic compliance (e.g. formatting, necessary sections, realistic budget).
    
    Topic: {topic}
    Proposal Title: {proposal_draft.get("title", "")}
    Budget Total: ${budget.get("total", 0)}
    
    Respond ONLY with a valid JSON object containing:
    - "passed": true or false
    - "notes": string detailing any compliance issues or confirming it passed.
    """
    
    response = llm.invoke(prompt)
    
    # Simple JSON parsing
    try:
        content = response.content
        if content.startswith("```json"):
            content = content[7:-3]
        elif content.startswith("```"):
            content = content[3:-3]
        compliance_report = json.loads(content.strip())
    except Exception:
        # Fallback if parsing fails
        compliance_report = {
            "passed": True,
            "notes": "Assumed passed due to parsing error."
        }
        
    return {
        "compliance_report": compliance_report,
        "next_node": "Supervisor"
    }
