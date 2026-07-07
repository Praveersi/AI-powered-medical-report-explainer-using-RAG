from fastapi import APIRouter, HTTPException
from app.services.query_service import answer_question
from app.models.schemas import QueryRequest, QueryResponse

router = APIRouter(prefix="/api", tags=["query"])


@router.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    """
    Accept a doc_id and a user question.
    Return a plain-text answer + the source chunks used.
    """
    # Basic validation
    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    if len(request.question) > 500:
        raise HTTPException(
            status_code=400,
            detail="Question too long. Please keep it under 500 characters."
        )

    try:
        result = answer_question(request.doc_id, request.question)
        return result
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail=f"Document not found: {request.doc_id}. Please ingest the PDF first."
        )
    except Exception as e:
        print(f"[query router] Error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Query failed. Please try again."
        )