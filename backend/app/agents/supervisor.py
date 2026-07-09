from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from app.services.llm_service import get_llm
from app.agents.state import GrantState
from typing import Literal

def supervisor_agent(state: GrantState) -> dict:
    """
    The Principal Investigator (Supervisor) agent.
    Decides the next step in the workflow based on current state.
    """
    # Simple hardcoded routing logic for the boilerplate
    # In a full implementation, this uses LLM function calling to pick the next route
    
    current_iteration = state.get("iteration_count", 0)
    score = state.get("quality_score", 0.0)
    
    # Workflow Logic
    if not state.get("found_grants"):
        next_step = "DiscoveryAgent"
    elif not state.get("literature_review"):
        next_step = "LiteratureAgent"
    elif not state.get("proposal_draft"):
        next_step = "WritingAgent"
    elif not state.get("budget"):
        next_step = "BudgetAgent"
    elif not state.get("compliance_report"):
        next_step = "ComplianceAgent"
    elif score < 0.8 and current_iteration < 3:
        # Loop back to reflection/review if quality is too low
        next_step = "ReviewAgent"
    else:
        next_step = "FINISH"
        
    return {"next_node": next_step}
