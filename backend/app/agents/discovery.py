from langchain_core.messages import AIMessage
from app.agents.state import GrantState
from app.services.llm_service import get_llm
from app.services.rag_service import search_documents

def discovery_node(state: GrantState):
    """
    Agent responsible for finding relevant grants.
    """
    topic = state.get("research_topic", "")
    llm = get_llm()
    
    # Search RAG for grants
    results = search_documents(f"grants for {topic}", k=3, collection_name="grants_and_literature")
    
    found_grants = []
    if results:
        for res in results:
            found_grants.append({
                "title": res.metadata.get("title", "Relevant Grant"),
                "content": res.page_content,
                "amount": res.metadata.get("amount", "TBD")
            })
    else:
        # Fallback to LLM generating mock grants for demo if no RAG data
        fallback_msg = llm.invoke(f"Suggest 2 hypothetical grant titles and amounts for research on: {topic}. Return in format: Title - Amount - Description.")
        found_grants.append({
            "title": "Hypothetical Grant Suggestion",
            "content": fallback_msg.content,
            "amount": "Varies"
        })
        
    return {
        "found_grants": found_grants,
        "next_node": "Supervisor" # Route back to supervisor
    }
