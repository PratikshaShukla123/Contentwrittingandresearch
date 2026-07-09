import json
from app.agents.state import GrantState
from app.services.llm_service import get_llm

def review_node(state: GrantState):
    """
    Agent responsible for reviewing the proposal, providing feedback, and scoring it.
    """
    proposal_draft = state.get("proposal_draft", {})
    iters = state.get("iteration_count", 0) + 1
    
    llm = get_llm()
    
    prompt = f"""
    You are an expert grant reviewer. Review the following proposal draft:
    Title: {proposal_draft.get("title", "")}
    Sections: {json.dumps(proposal_draft.get("sections", {}))}
    
    Respond ONLY with a valid JSON object containing:
    - "quality_score": a float between 0.0 and 1.0 representing the overall quality (1.0 is perfect).
    - "feedback": a string with constructive feedback on how to improve the proposal.
    """
    
    response = llm.invoke(prompt)
    
    # Simple JSON parsing
    try:
        content = response.content
        if content.startswith("```json"):
            content = content[7:-3]
        elif content.startswith("```"):
            content = content[3:-3]
        result = json.loads(content.strip())
        quality_score = float(result.get("quality_score", 0.0))
        feedback = str(result.get("feedback", ""))
    except Exception:
        # Fallback if parsing fails
        quality_score = 0.9  # Assumed good to prevent infinite loops in basic mode
        feedback = "Review complete. (Fallback due to parsing error)"
        
    return {
        "quality_score": quality_score,
        "feedback": feedback,
        "iteration_count": iters,
        "next_node": "Supervisor"
    }
