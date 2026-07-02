from pydantic import BaseModel
from typing import List, Optional
from enum import Enum


# ── Enums ─────────────────────────────────────────────────
class Severity(str, Enum):
    HIGH   = "high"    # value significantly above normal
    LOW    = "low"     # value significantly below normal
    BORDER = "borderline"
    NORMAL = "normal"


# ── Ingest ────────────────────────────────────────────────
class IngestResponse(BaseModel):
    doc_id: str
    filename: str
    page_count: int
    char_count: int
    chunk_count: int        # filled in Phase 3
    message: str


# ── Analysis ──────────────────────────────────────────────
class Flag(BaseModel):
    name: str               # e.g. "Haemoglobin"
    value: str              # e.g. "9.2"
    unit: Optional[str]     # e.g. "g/dL"
    normal_range: str       # e.g. "13.5 – 17.5"
    severity: Severity
    plain_english: str      # one plain-English sentence


class AnalysisResult(BaseModel):
    doc_id: str
    summary: str            # overall plain-English paragraph
    flags: List[Flag]       # list of abnormal values
    doctor_questions: List[str]
    disclaimer: str


# ── Query ─────────────────────────────────────────────────
class QueryRequest(BaseModel):
    doc_id: str
    question: str


class QueryResponse(BaseModel):
    answer: str
    source_chunks: List[str]