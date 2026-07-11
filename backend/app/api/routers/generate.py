from fastapi import APIRouter, HTTPException, Depends
from app.api.deps import SessionDep
from app.models.chat import ChatMessage as DBChatMessage
from app.models.project import Project
from app.services.llm_service import get_llm
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
import json
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/{project_id}")
async def generate_proposal(project_id: int, db: SessionDep):
    try:
        # Verify project exists
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        # Get chat history
        messages = db.query(DBChatMessage).filter(DBChatMessage.project_id == project_id).order_by(DBChatMessage.created_at.asc()).all()
        
        llm = get_llm(temperature=0.4)
        
        lc_messages = []
        
        system_prompt = """You are an expert AI grant writing assistant. 
Based on the following conversation history, generate a comprehensive, structured grant proposal.
You MUST output ONLY a valid JSON object matching the following structure exactly (no markdown formatting, no code blocks, just raw JSON):

{
  "title": "A compelling title for the proposal",
  "sections": {
    "summary": "A concise summary of the project.",
    "objectives": "The main research objectives, bulleted or paragraphed.",
    "methodology": "The methodology and approach to be used."
  }
}"""
        lc_messages.append(SystemMessage(content=system_prompt))
        
        for msg in messages:
            if str(msg.role) == "user":
                lc_messages.append(HumanMessage(content=str(msg.content)))
            else:
                lc_messages.append(AIMessage(content=str(msg.content)))
                
        # Prompt the LLM to start generation
        lc_messages.append(HumanMessage(content="Please generate the JSON proposal now based on our conversation."))
                
        response = await llm.ainvoke(lc_messages)
        
        content = str(response.content).strip()
        # Clean up any potential markdown code blocks
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
            
        parsed_proposal = json.loads(content)
        return parsed_proposal
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse LLM JSON response: {str(e)}")
        raise HTTPException(status_code=500, detail="AI returned invalid format. Please try again.")
    except Exception as e:
        logger.error(f"Generation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate proposal")
