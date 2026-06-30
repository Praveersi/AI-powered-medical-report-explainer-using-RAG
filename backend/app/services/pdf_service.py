import fitz          # PyMuPDF — import name is fitz, not pymupdf
import pdfplumber
import os
from typing import List, Dict


import re
import fitz

def clean_extracted_text(text: str) -> str:
    """
    Cleans up the raw extracted text by handling multi-line breaks,
    removing non-printable characters, and collapsing consecutive spaces.
    """
    # Replace multiple blank lines with a single one
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Remove non-printable characters except newlines and tabs
    text = re.sub(r'[^\x09\x0A\x0D\x20-\x7E\u00A0-\uD7FF]', ' ', text)
    
    # Replace multiple spaces with single space
    text = re.sub(r' +', ' ', text)
    
    return text.strip()

def extract_text_with_pymupdf(pdf_path: str) -> str:
    """
    Extract all plain text from a PDF using PyMuPDF.
    Works on digitally created PDFs (hospital portals, labs).
    Returns one big string with page separators.
    """
    text_parts = []

    doc = fitz.open(pdf_path)

    for page_num in range(len(doc)):
        page = doc[page_num]

        # The raw text is passed directly into the cleaner function here
        page_text = clean_extracted_text(page.get_text())

        # Only add if there is actual text (skip blank pages)
        if page_text.strip():
            text_parts.append(f"--- Page {page_num + 1} ---\n{page_text}")

    doc.close()

    # Join all pages with newline separator
    return "\n\n".join(text_parts)


def extract_tables_with_pdfplumber(pdf_path: str) -> str:
    """
    Extract all tables from a PDF using pdfplumber.
    Converts each table row into a readable string like:
    'Test: Haemoglobin | Value: 9.2 | Unit: g/dL | Range: 13.5-17.5'
    """
    table_strings = []

    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages):

            # extract_tables() returns a list of tables
            # each table is a list of rows
            # each row is a list of cell values
            tables = page.extract_tables()

            if not tables:
                continue  # no tables on this page, skip

            table_strings.append(f"--- Tables from Page {page_num + 1} ---")

            for table_idx, table in enumerate(tables):
                if not table:
                    continue

                # First row is usually the header
                header = table[0]
                data_rows = table[1:]

                for row in data_rows:
                    # Clean each cell — remove None, strip whitespace
                    cleaned = [
                        str(cell).strip() if cell is not None else ""
                        for cell in row
                    ]

                    # Skip completely empty rows
                    if not any(cleaned):
                        continue

                    # Format as "Header: Value | Header: Value | ..."
                    if header and len(header) == len(cleaned):
                        parts = []
                        for h, v in zip(header, cleaned):
                            h_clean = str(h).strip() if h else "Field"
                            parts.append(f"{h_clean}: {v}")
                        table_strings.append(" | ".join(parts))
                    else:
                        # No header available — just join values
                        table_strings.append(" | ".join(cleaned))

    return "\n".join(table_strings)


def extract_pdf(pdf_path: str) -> Dict[str, str]:
    """
    Main function — extracts both text and tables from a PDF.
    Returns a dict with:
      - 'text'  : raw text from all pages
      - 'tables': formatted table rows
      - 'combined': merged text + tables (used by RAG pipeline)
    """
    # Safety check — does the file exist?
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    # Extract text using PyMuPDF
    print(f"[pdf_service] Extracting text with PyMuPDF...")
    text = extract_text_with_pymupdf(pdf_path)

    # Extract tables using pdfplumber
    print(f"[pdf_service] Extracting tables with pdfplumber...")
    tables = extract_tables_with_pdfplumber(pdf_path)

    # Combine both into one document string
    combined_parts = []

    if text.strip():
        combined_parts.append("=== DOCUMENT TEXT ===\n" + text)

    if tables.strip():
        combined_parts.append("=== TABLES ===\n" + tables)

    combined = "\n\n".join(combined_parts)

    return {
        "text": text,
        "tables": tables,
        "combined": combined,
        "char_count": len(combined),
        "page_count": _get_page_count(pdf_path)
    }


def _get_page_count(pdf_path: str) -> int:
    """Helper — returns total number of pages in the PDF."""
    doc = fitz.open(pdf_path)
    count = len(doc)
    doc.close()
    return count