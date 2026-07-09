import operator
from typing import Annotated, Sequence, TypedDict, Dict, Any, List
from langchain_core.messages import BaseMessage

class GrantState(TypedDict):
    """
    The main state object for the LangGraph workflow.
    It carries all context, intermediate drafts, and messages across agents.
    """
    # Messages list using operator.add to append new messages
    messages: Annotated[Sequence[BaseMessage], operator.add]
    
    # Project Context
    project_id: int
    research_topic: str
    
    # Intermediate Outputs
    found_grants: List[Dict[str, Any]]
    literature_review: str
    proposal_draft: Dict[str, Any]
    budget: Dict[str, Any]
    
    # Review & Reflection Loop
    compliance_report: Dict[str, Any]
    quality_score: float
    feedback: str
    
    # Control Flags
    next_node: str
    iteration_count: int
