import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.pdf_service import save_upload, extract_pdf
from app.services.rag_pipeline import process_document_for_rag
from app.config import settings

# Keeping your preferred prefix structure
router = APIRouter(prefix="/api", tags=["ingest"])

@router.post("/ingest")
async def ingest_document(file: UploadFile = File(...)):
    # 1. Validation: File Format
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # 2. Validation: File Size Limit Check
    # (FastAPI UploadFile spools to memory/disk dynamically, checking size early)
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0) # Reset stream pointer back to beginning

    if file_size == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    max_bytes = settings.MAX_FILE_MB * 1024 * 1024
    if file_size > max_bytes:
        raise HTTPException(status_code=400, detail=f"File exceeds {settings.MAX_FILE_MB}MB limit.")

    # 3. Generate structured file data paths
    doc_id = str(uuid.uuid4())
    safe_filename = f"{doc_id}_{file.filename}"
    destination_path = os.path.join(settings.UPLOADS_DIR, safe_filename)

    # 4. Process file: Save to disk
    try:
        save_upload(file, destination_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save document: {str(e)}")

    # 5. Process file: Extract Text and Layout Tables
    try:
        extraction = extract_pdf(destination_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failure: {str(e)}")

    if not extraction["combined"].strip():
        raise HTTPException(status_code=422, detail="Could not extract any clean text context from this PDF.")

    # 6. RAG Pipeline: Chunk, generate embeddings, and build FAISS index
    try:
        rag_result = process_document_for_rag(
            doc_id=doc_id,
            text=extraction["combined"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG indexing failure: {str(e)}")

    # 7. Unified JSON Response Schema
    return {
        "doc_id": doc_id,
        "filename": file.filename,
        "page_count": extraction["page_count"],
        "char_count": extraction["char_count"],
        "chunk_count": rag_result.get("chunk_count", 0),
        "message": "PDF processed successfully — text extracted and indexed into FAISS vector space."
    }