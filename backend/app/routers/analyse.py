from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.analyse_service import analyse_document
from app.models.schemas import AnalysisResult

router = APIRouter(prefix="/api", tags=["analyse"])


class AnalyseRequest(BaseModel):
    doc_id: str  


@router.post("/analyse", response_model=AnalysisResult)
async def analyse(request: AnalyseRequest):
    """
    Accepts a doc_id, runs the full analysis pipeline,
    returns structured JSON with summary, flags, questions, disclaimer.
    """
    try:
        result = analyse_document(request.doc_id)
        return result
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail=f"Document not found: {request.doc_id}. Please ingest the PDF first."
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        print(f"[analyse router] Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Analysis failed. Check server logs.")