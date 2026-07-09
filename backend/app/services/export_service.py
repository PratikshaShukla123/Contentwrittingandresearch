import json
from typing import Dict, Any

def export_to_markdown(proposal_data: Dict[str, Any]) -> str:
    """
    Converts a structured JSON proposal into a Markdown document.
    """
    md_content = f"# {proposal_data.get('title', 'Grant Proposal')}\n\n"
    
    for section_title, section_content in proposal_data.get('sections', {}).items():
        md_content += f"## {section_title}\n"
        md_content += f"{section_content}\n\n"
        
    return md_content

def export_to_json(proposal_data: Dict[str, Any]) -> str:
    """
    Exports the proposal exactly as a JSON string.
    """
    return json.dumps(proposal_data, indent=2)

# Placeholder for PDF and DOCX. Real implementations would use python-docx or pdfkit.
def export_to_docx(proposal_data: Dict[str, Any]) -> bytes:
    """
    Placeholder: Convert to DOCX format (requires python-docx).
    """
    raise NotImplementedError("DOCX Export requires python-docx library.")

def export_to_pdf(proposal_data: Dict[str, Any]) -> bytes:
    """
    Placeholder: Convert to PDF format.
    """
    raise NotImplementedError("PDF Export requires a PDF generation library.")
