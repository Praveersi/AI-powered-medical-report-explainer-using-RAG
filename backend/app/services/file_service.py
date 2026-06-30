import os
import uuid
from fastapi import UploadFile, HTTPException
from app.config import settings


def validate_pdf(file: UploadFile) -> None:
    """
    Check file is a valid PDF and within size limit.
    Raises HTTPException if invalid.
    """
    # Check file extension
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are accepted."
        )

    # Check MIME type
    if file.content_type not in ["application/pdf", "application/octet-stream"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a PDF."
        )


async def save_uploaded_pdf(file: UploadFile) -> dict:
    """
    Save uploaded PDF to disk.
    Returns doc_id and file_path so other services can use it.
    """
    # Validate first
    validate_pdf(file)

    # Generate unique ID for this document
    doc_id = str(uuid.uuid4())

    # Build the save path
    os.makedirs(settings.UPLOADS_DIR, exist_ok=True)
    file_path = os.path.join(settings.UPLOADS_DIR, f"{doc_id}.pdf")

    # Read all file bytes
    contents = await file.read()

    # Check file size
    max_bytes = settings.MAX_FILE_MB * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Max size is {settings.MAX_FILE_MB}MB."
        )

    # Write bytes to disk
    with open(file_path, "wb") as f:
        f.write(contents)

    print(f"[file_service] Saved PDF: {file_path} ({len(contents)} bytes)")

    return {
        "doc_id": doc_id,
        "file_path": file_path,
        "original_filename": file.filename,
        "size_bytes": len(contents)
    }