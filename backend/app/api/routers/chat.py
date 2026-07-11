from fastapi import APIRouter, HTTPException, Depends
from app.schemas.chat import ChatRequest, ChatResponse, ChatMessageResponse
from app.services.llm_service import get_llm
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from app.api.deps import SessionDep
from app.models.chat import ChatMessage as DBChatMessage
from app.models.project import Project
from app.agents.graph import build_graph
from typing import List
import logging
import json

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize workflow once
workflow = build_graph()

@router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, db: SessionDep):
    try:
        project = None
        # Save user message if project_id is provided
        if request.project_id:
            project = db.query(Project).filter(Project.id == request.project_id).first()
            user_msg = request.messages[-1] # The last message is the new one from user
            if user_msg.role == "user":
                db_msg = DBChatMessage(
                    project_id=request.project_id,
                    role=user_msg.role,
                    content=user_msg.content
                )
                db.add(db_msg)
                db.commit()

        llm = get_llm(temperature=0.0)
        last_message = request.messages[-1].content
        
        # Simple Intent Router
        router_prompt = f"""You are a routing assistant. Decide if the user is asking to generate a report, proposal, or use agent tools (e.g., 'generate a compliance report', 'run the budget agent'). 
If yes, reply strictly with '{{"use_agents": true}}'. 
Otherwise, reply strictly with '{{"use_agents": false}}'.

User message: {last_message}"""
        
        router_response = await llm.ainvoke([HumanMessage(content=router_prompt)])
        use_agents = False
        try:
            route_data = json.loads(str(router_response.content).strip())
            use_agents = route_data.get("use_agents", False)
        except Exception:
            pass

        response_content = ""
        
        if use_agents and request.project_id and project:
            # Run LangGraph workflow
            lc_messages = []
            for msg in request.messages:
                if msg.role == "user":
                    lc_messages.append(HumanMessage(content=msg.content))
                else:
                    lc_messages.append(AIMessage(content=msg.content))
                    
            initial_state = {
                "messages": lc_messages,
                "project_id": request.project_id,
                "research_topic": project.title if project.title else "Research Topic",
                "iteration_count": 0,
                "quality_score": 0.0,
            }
            
            final_state = await workflow.ainvoke(initial_state)
            
            response_content = "I've run the agent workflow for you.\n\n"
            
            if final_state.get("compliance_report"):
                response_content += f"**Compliance Report:**\n```json\n{json.dumps(final_state['compliance_report'], indent=2)}\n```\n\n"
            if final_state.get("budget"):
                response_content += f"**Budget:**\n```json\n{json.dumps(final_state['budget'], indent=2)}\n```\n\n"
            if final_state.get("proposal_draft"):
                response_content += f"**Proposal Draft:**\n```json\n{json.dumps(final_state['proposal_draft'], indent=2)}\n```\n\n"
                
            if response_content == "I've run the agent workflow for you.\n\n":
                response_content += "The agents completed their task but didn't generate a specific report format."
                
        else:
            # Standard chat
            llm_chat = get_llm(temperature=0.7)
            lc_messages = []
            lc_messages.append(SystemMessage(content="You are an expert AI grant writing assistant. Help the user refine their proposal."))
            
            # Limit history to avoid hitting rate limits
            chat_history = request.messages[-10:] if len(request.messages) > 10 else request.messages
            for msg in chat_history:
                if msg.role == "user":
                    lc_messages.append(HumanMessage(content=msg.content))
                else:
                    lc_messages.append(AIMessage(content=msg.content))
                    
            response = await llm_chat.ainvoke(lc_messages)
            response_content = str(response.content)
        
        # Save AI response if project_id is provided
        if request.project_id:
            db_msg = DBChatMessage(
                project_id=request.project_id,
                role="ai",
                content=response_content
            )
            db.add(db_msg)
            db.commit()

        return ChatResponse(content=response_content)
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        err_msg = str(e).lower()
        if "rate_limit" in err_msg or "rate limit" in err_msg or "limit exceeded" in err_msg or "413" in err_msg or "too large" in err_msg or "429" in err_msg:
            raise HTTPException(status_code=429, detail="Groq API rate limit reached. Please wait a few seconds before retrying.")
        raise HTTPException(status_code=500, detail="Failed to process chat request")

@router.get("/{project_id}", response_model=List[ChatMessageResponse])
async def get_chat_history(project_id: int, db: SessionDep):
    messages = db.query(DBChatMessage).filter(DBChatMessage.project_id == project_id).order_by(DBChatMessage.created_at.asc()).all()
    return messages

@router.delete("/{project_id}")
async def clear_chat_history(project_id: int, db: SessionDep):
    db.query(DBChatMessage).filter(DBChatMessage.project_id == project_id).delete()
    db.commit()
    return {"message": "Chat history cleared successfully"}
