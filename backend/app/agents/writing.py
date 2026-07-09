import json
from app.agents.state import GrantState
from app.services.llm_service import get_llm

def writing_node(state: GrantState):
    """
    Agent responsible for drafting the grant proposal based on research and literature.
    """
    topic = state.get("research_topic", "")
    literature_review = state.get("literature_review", "")
    found_grants = state.get("found_grants", [])
    
    llm = get_llm()
    
    grants_info = "\\n".join([g.get("title", "") + " - " + str(g.get("amount", "")) for g in found_grants])
    
    prompt = f"""
    You are an expert grant writer. Draft a grant proposal based on the following:
    Topic: {topic}
    Literature Review: {literature_review}
    Potential Grants: {grants_info}
    
    Respond ONLY with a valid JSON object containing the following keys:
    - "title": A catchy title for the proposal
    - "sections": An object with keys "background", "objectives", and "methodology", each containing a paragraph of text.
    """
    
    response = llm.invoke(prompt)
    
    # Simple JSON parsing, in production this should use structured output parsers
    try:
        content = response.content
        # Try to strip markdown code blocks if the LLM includes them
        if content.startswith("```json"):
            content = content[7:-3]
        elif content.startswith("```"):
            content = content[3:-3]
        proposal_draft = json.loads(content.strip())
    except Exception:
        # Fallback if parsing fails
        proposal_draft = {
            "title": f"Proposal for {topic}",
            "sections": {
                "background": "Failed to parse LLM response.",
                "objectives": "",
                "methodology": ""
            }
        }
    
    return {
        "proposal_draft": proposal_draft,
        "next_node": "Supervisor"
    }
