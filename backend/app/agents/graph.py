from langgraph.graph import StateGraph, END
from app.agents.state import GrantState
from app.agents.supervisor import supervisor_agent

from app.agents.discovery import discovery_node
from app.agents.literature import literature_node
from app.agents.writing import writing_node
from app.agents.budget import budget_node
from app.agents.compliance import compliance_node
from app.agents.review import review_node

def build_graph():
    """
    Constructs the LangGraph state machine.
    """
    workflow = StateGraph(GrantState)
    
    # Add Nodes
    workflow.add_node("Supervisor", supervisor_agent)
    workflow.add_node("DiscoveryAgent", discovery_node)
    workflow.add_node("LiteratureAgent", literature_node)
    workflow.add_node("WritingAgent", writing_node)
    workflow.add_node("BudgetAgent", budget_node)
    workflow.add_node("ComplianceAgent", compliance_node)
    workflow.add_node("ReviewAgent", review_node)
    
    # Define Edges
    workflow.set_entry_point("Supervisor")
    
    # All agent nodes route back to the supervisor
    for node in ["DiscoveryAgent", "LiteratureAgent", "WritingAgent", 
                 "BudgetAgent", "ComplianceAgent", "ReviewAgent"]:
        workflow.add_edge(node, "Supervisor")
        
    # Supervisor conditionally routes to agents or END
    workflow.add_conditional_edges(
        "Supervisor",
        lambda x: x["next_node"],
        {
            "DiscoveryAgent": "DiscoveryAgent",
            "LiteratureAgent": "LiteratureAgent",
            "WritingAgent": "WritingAgent",
            "BudgetAgent": "BudgetAgent",
            "ComplianceAgent": "ComplianceAgent",
            "ReviewAgent": "ReviewAgent",
            "FINISH": END
        }
    )
    
    return workflow.compile()
