import os
from typing import List, Dict
from app.config import settings, groq_client
from app.services.rag_pipeline import search_similar_chunks
from app.models.schemas import QueryResponse


def _load_prompt(filename: str) -> str:
    """Load a prompt from the prompts/ folder."""
    prompt_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "prompts",
        filename
    )
    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read().strip()


# Load once at import time
_QUERY_PROMPT = _load_prompt("query_prompt.txt")

def _build_context(chunks: List[str]) -> str:
    """
    Number each retrieved chunk so the LLM knows
    exactly which passages it is working with.
    """
    parts = []
    for i, chunk in enumerate(chunks):
        parts.append(f"[Passage {i+1}]\n{chunk}")
    return "\n\n".join(parts)

def _call_groq_for_answer(context: str, question: str) -> str:
    """
    Send the system prompt + context + user question to Groq.
    Returns plain text answer (not JSON — this is conversational).
    """
    user_message = f"""DOCUMENT CONTEXT:
{context}

USER QUESTION: {question}"""

    print(f"[query_service] Calling Groq for question: '{question[:60]}...'")

    response = groq_client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {"role": "system", "content": _QUERY_PROMPT},
            {"role": "user",   "content": user_message}
        ],
        temperature=0.3,   # slightly more natural than analyse (0.1)
        max_tokens=500,    # concise answers — 2-4 sentences max
    )

    answer = response.choices[0].message.content.strip()
    print(f"[query_service] Answer received ({len(answer)} chars)")
    return answer

def answer_question(doc_id: str, question: str) -> QueryResponse:
    """
    Full Q&A pipeline:
    1. Embed the user's question
    2. Search FAISS for the most relevant chunks
    3. Build context from those chunks
    4. Call Groq with system prompt + context + question
    5. Return answer + the source chunks used

    Key difference from analyse_document():
    Here the user's ACTUAL QUESTION drives the FAISS search,
    not a generic broad query. This gives precise, focused answers.
    """
    # Step 1 + 2: use user's question to find relevant chunks
    chunks = search_similar_chunks(
        doc_id=doc_id,
        query=question,      # ← the actual question, not a generic query
        top_k=settings.TOP_K_CHUNKS
    )

    if not chunks:
        return QueryResponse(
            answer="I could not find relevant information in your report for this question. Please ask your doctor.",
            source_chunks=[]
        )

    # Step 3: build numbered context
    context = _build_context(chunks)

    # Step 4: get plain text answer from Groq
    answer = _call_groq_for_answer(context, question)

    # Step 5: return answer + source chunks so frontend can show them
    return QueryResponse(
        answer=answer,
        source_chunks=chunks   # frontend shows these as collapsible "Sources"
    )
