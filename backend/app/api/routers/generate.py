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

        # Get chat history (limit to last 10 messages to avoid token rate limits)
        messages = db.query(DBChatMessage).filter(DBChatMessage.project_id == project_id).order_by(DBChatMessage.created_at.asc()).all()
        messages = messages[-10:]
        
        llm = get_llm(temperature=0.4)
        
        lc_messages = []
        
        system_prompt = """You are an elite, professional grant writing consultant and domain expert. 
Based on the conversation history, generate an exceptionally detailed, rigorous, and academic-grade grant proposal. 

For each section, expand thoroughly, providing specific details, technical terms, and concrete explanations. Avoid generic summaries or high-level generalizations. Instead, make the proposal feel comprehensive, authoritative, and implementation-ready.

You MUST output ONLY a valid JSON object matching the following structure exactly (no markdown formatting, no code blocks, just raw JSON):

{
  "title": "A highly professional, academic, and compelling title that reflects the technical depth of the project.",
  "sections": {
    "summary": "An extensive executive summary (300-500 words). Clearly define: 1) The core problem or research gap being addressed. 2) The significance and critical nature of this problem. 3) The novel, innovative solution or technology proposed. 4) The expected societal, scientific, or commercial impact.",
    "objectives": "A detailed, numbered list of primary and secondary research objectives. Each objective must be specific, measurable, achievable, realistic, and time-bound (SMART). Under each objective, explain the exact scientific or technical milestone and the quantitative metrics used to verify success.",
    "methodology": "A deep, comprehensive technical breakdown (500-800 words) of the methodology. This must detail: 1) The step-by-step technical approach, phases of execution, and workflows. 2) The specific tools, libraries, hardware, software architectures, algorithms, or mathematical models utilized. 3) The datasets to be acquired, preprocessed, and used. 4) The validation, testing, and evaluation metrics. 5) A risk mitigation plan addressing potential technical challenges and how they will be circumvented."
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
        
        raw_content = str(response.content).strip()
        
        # Robustly extract JSON block by finding the first '{' and last '}'
        start_idx = raw_content.find('{')
        end_idx = raw_content.rfind('}')
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            content = raw_content[start_idx:end_idx + 1]
        else:
            content = raw_content
            
        parsed_proposal = json.loads(content, strict=False)
        return parsed_proposal
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse LLM JSON response: {str(e)}")
        raise HTTPException(status_code=500, detail="AI returned invalid format. Please try again.")
    except Exception as e:
        logger.error(f"Generation error: {str(e)}")
        err_msg = str(e).lower()
        if "rate_limit" in err_msg or "rate limit" in err_msg or "limit exceeded" in err_msg or "413" in err_msg or "too large" in err_msg or "429" in err_msg:
            raise HTTPException(status_code=429, detail="Groq API rate limit reached. Please wait a few seconds before retrying.")
        raise HTTPException(status_code=500, detail=f"Failed to generate proposal: {str(e)}")
