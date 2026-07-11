from langchain_groq import ChatGroq
from app.core.config import settings
import tiktoken
import logging

logger = logging.getLogger(__name__)

# GPT-4o estimated costs per 1K tokens
COST_PER_1K_INPUT_TOKENS = 0.005
COST_PER_1K_OUTPUT_TOKENS = 0.015

def estimate_tokens(text: str, model_name: str = "gpt-4o") -> int:
    """Returns the number of tokens in a text string."""
    try:
        encoding = tiktoken.encoding_for_model(model_name)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")
    return len(encoding.encode(text))

def estimate_cost(input_text: str, output_text: str, model_name: str = "gpt-4o") -> float:
    """Estimates the cost of a transaction based on input and output tokens."""
    input_tokens = estimate_tokens(input_text, model_name)
    output_tokens = estimate_tokens(output_text, model_name)
    
    cost = (input_tokens / 1000.0) * COST_PER_1K_INPUT_TOKENS + \
           (output_tokens / 1000.0) * COST_PER_1K_OUTPUT_TOKENS
    
    logger.info(f"LLM Transaction: {input_tokens} prompt tokens, {output_tokens} completion tokens. Estimated cost: ${cost:.5f}")
    return cost

def get_llm(model_name: str = "llama3-8b-8192", temperature: float = 0.2):
    """
    Returns an instance of the configured LLM.
    Used by all LangGraph nodes for consistent access and configuration.
    """
    if not settings.GROQ_API_KEY:
        # Fallback dummy for testing if no key is provided
        from langchain_community.chat_models import FakeListChatModel
        return FakeListChatModel(responses=["This is a mock LLM response since no API key is set."])
        
    return ChatGroq(
        model=model_name,
        temperature=temperature,
        api_key=settings.GROQ_API_KEY,
        max_retries=3,
    )
