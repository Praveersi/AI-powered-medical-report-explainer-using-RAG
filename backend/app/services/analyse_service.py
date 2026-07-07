import os
import json
import re
from typing import List
from app.config import settings, groq_client
from app.services.rag_pipeline import search_similar_chunks
from app.models.schemas import AnalysisResult, Flag, Severity


def _load_prompt(filename: str) -> str:
    """Load a prompt from the prompts/ folder."""
    prompt_path = os.path.join(
        os.path.dirname(__file__),   # this file's folder (services/)
        "..",                        # go up to app/
        "prompts",
        filename
    )
    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read().strip()


# Load prompt once at import time
_ANALYSE_PROMPT = _load_prompt("analyse_prompt.txt")
def _build_context(chunks: List[str]) -> str:
    """
    Join retrieved chunks into a single context string.
    Numbered so the LLM can reference specific passages.
    """
    parts = []
    for i, chunk in enumerate(chunks):
        parts.append(f"[Passage {i+1}]\n{chunk}")
    return "\n\n".join(parts)
def _clean_json_response(raw: str) -> str:
    """
    LLMs sometimes wrap JSON in markdown code blocks like:
    ```json { ... } ```
    This function strips that wrapping so json.loads() works reliably.
    """
    # Remove ```json ... ``` or ``` ... ``` wrappers
    raw = re.sub(r"```(?:json)?\s*", "", raw)
    raw = re.sub(r"```", "", raw)

    # Strip leading/trailing whitespace
    raw = raw.strip()

    # Find the first { and last } — extract just the JSON object
    start = raw.find("{")
    end   = raw.rfind("}")

    if start == -1 or end == -1:
        raise ValueError(f"No JSON object found in LLM response: {raw[:200]}")

    return raw[start : end + 1]
def _call_groq(context: str) -> str:
    """
    Send the system prompt + document context to Groq.
    Returns the raw string response from the LLM.
    """
    user_message = f"""DOCUMENT CONTEXT:
{context}

QUESTION: Please analyse this medical report and return the JSON response."""

    print(f"[analyse_service] Calling Groq ({settings.GROQ_MODEL})...")

    response = groq_client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {"role": "system", "content": _ANALYSE_PROMPT},
            {"role": "user",   "content": user_message}
        ],
        temperature=0.1,   # low temperature = consistent, factual output
        max_tokens=2000,   # enough for a full analysis JSON
    )

    raw = response.choices[0].message.content
    print(f"[analyse_service] Groq responded ({len(raw)} chars)")
    return raw
def _parse_response(raw: str, doc_id: str) -> AnalysisResult:
    """
    Parse the raw LLM string into a typed AnalysisResult object.
    1. Clean JSON string
    2. json.loads() into a dict
    3. Convert each flag dict into a typed Flag object
    4. Return AnalysisResult Pydantic model
    """
    # Clean any markdown wrapping
    clean = _clean_json_response(raw)

    # Parse into Python dict
    try:
        data = json.loads(clean)
    except json.JSONDecodeError as e:
        raise ValueError(f"LLM returned invalid JSON: {e}\nRaw: {clean[:300]}")

    # Convert each flag dict → typed Flag object
    flags = []
    for f in data.get("flags", []):
        try:
            # Map severity string to enum safely
            severity_str = f.get("severity", "normal").lower()
            severity = Severity(severity_str) if severity_str in [s.value for s in Severity] else Severity.NORMAL

            flags.append(Flag(
                name          = f.get("name", "Unknown"),
                value         = str(f.get("value", "")),
                unit          = f.get("unit"),
                normal_range  = f.get("normal_range", "N/A"),
                severity      = severity,
                plain_english = f.get("plain_english", "")
            ))
        except Exception as e:
            print(f"[analyse_service] Warning: skipped flag — {e}")
            continue

    return AnalysisResult(
        doc_id           = doc_id,
        summary          = data.get("summary", "No summary available."),
        flags            = flags,
        doctor_questions = data.get("doctor_questions", []),
        disclaimer       = data.get("disclaimer", "Please consult a qualified doctor.")
    )
def analyse_document(doc_id: str) -> AnalysisResult:
    """
    Full pipeline:
    1. Retrieve most relevant chunks from FAISS for this doc
    2. Build context string from chunks
    3. Call Groq with system prompt + context
    4. Parse and return structured AnalysisResult
    This is the only function the router needs to call.
    """
    # Use a broad query to retrieve all important medical values
    query = "all test values results reference range normal abnormal flags"
    chunks = search_similar_chunks(doc_id, query, top_k=settings.TOP_K_CHUNKS)

    if not chunks:
        raise ValueError(f"No chunks found for doc_id: {doc_id}. Was the document ingested?")

    # Build context from retrieved chunks
    context = _build_context(chunks)

    # Call Groq and get raw response
    raw_response = _call_groq(context)

    # Parse into typed Pydantic object and return
    result = _parse_response(raw_response, doc_id)

    print(f"[analyse_service] Analysis complete — {len(result.flags)} flags found")
    return result
