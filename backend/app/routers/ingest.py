from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.file_service import save_uploaded_pdf
from app.services.pdf_service  import extract_pdf
from app.models.schemas import IngestResponse

router = APIRouter(prefix="/api", tags=["ingest"])


@router.post("/ingest", response_model=IngestResponse)
async def ingest_document(file: UploadFile = File(...)):
    """
    Step 1: Accept PDF upload
    Step 2: Save to disk
    Step 3: Extract text + tables
    Step 4: (Phase 3 will add) Chunk + embed + save FAISS
    """
    # Save uploaded file to disk
    file_info = await save_uploaded_pdf(file)

    # Extract text and tables from the saved PDF
    extraction = extract_pdf(file_info["file_path"])

    # Return response (chunk_count = 0 until Phase 3)
    return IngestResponse(
        doc_id     = file_info["doc_id"],
        filename   = file_info["original_filename"],
        page_count = extraction["page_count"], 
        char_count = extraction["char_count"],
        chunk_count= 0,  # updated in Phase 3
        message    = "PDF uploaded and text extracted successfully"
    )