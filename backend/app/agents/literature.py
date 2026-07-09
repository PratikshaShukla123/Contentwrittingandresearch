from app.agents.state import GrantState
from app.services.llm_service import get_llm
from app.services.rag_service import search_documents

def literature_node(state: GrantState):
    """
    Agent responsible for conducting a literature review.
    """
    topic = state.get("research_topic", "")
    llm = get_llm()
    
    # Find relevant literature using RAG
    results = search_documents(f"literature review academic papers for {topic}", k=5, collection_name="grants_and_literature")
    
    context = "\n\n".join([r.page_content for r in results])
    
    prompt = f"Write a brief literature review for the research topic: {topic}.\n\n"
    if context:
        prompt += f"Use the following context to inform your review:\n{context}"
        
    response = llm.invoke(prompt)
    
    return {
        "literature_review": response.content,
        "next_node": "Supervisor"
    }
