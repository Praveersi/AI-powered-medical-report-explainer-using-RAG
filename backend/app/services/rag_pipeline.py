import os
import pickle
import numpy as np
import faiss
from typing import List, Dict
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from app.config import settings

# Load the embedding model ONCE when this module is imported.
print("[rag_pipeline] Loading embedding model (all-MiniLM-L6-v2)...")
_embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
print("[rag_pipeline] Embedding model loaded.")


def chunk_text(text: str) -> List[str]:
    """
    Split a long text into overlapping chunks.
    Uses RecursiveCharacterTextSplitter — tries to split on paragraph
    breaks first, then sentences, then words — to keep chunks meaningful.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""]
    )

    chunks = splitter.split_text(text)

    # Remove any empty or whitespace-only chunks
    chunks = [c.strip() for c in chunks if c.strip()]

    print(f"[rag_pipeline] Split text into {len(chunks)} chunks")
    return chunks


def embed_chunks(chunks: List[str]) -> np.ndarray:
    """
    Convert a list of text chunks into a matrix of vectors.
    Returns a numpy array of shape (num_chunks, 384).
    """
    embeddings = _embedding_model.encode(
        chunks,
        show_progress_bar=True,
        convert_to_numpy=True
    )

    # FAISS requires float32 — sentence-transformers returns float32 by
    # default but we cast explicitly to be safe
    embeddings = embeddings.astype("float32")

    print(f"[rag_pipeline] Embedded {len(chunks)} chunks → shape {embeddings.shape}")
    return embeddings


def build_faiss_index(embeddings: np.ndarray) -> faiss.Index:
    """
    Build a FAISS index from a matrix of embeddings.
    Uses IndexFlatL2 — exact nearest-neighbour search using
    Euclidean distance. Simple, accurate, perfect for small
    documents like a single medical report.
    """
    dimension = embeddings.shape[1]  # 384 for all-MiniLM-L6-v2

    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)  # adds all vectors to the index

    print(f"[rag_pipeline] Built FAISS index with {index.ntotal} vectors")
    return index


def save_index(doc_id: str, index: faiss.Index, chunks: List[str]) -> str:
    """
    Save the FAISS index AND the original text chunks to disk.
    We need both — FAISS only stores vectors, not the original text.
    We use a separate pickle file to map vector positions back to text.
    """
    doc_folder = os.path.join(settings.INDEXES_DIR, doc_id)
    os.makedirs(doc_folder, exist_ok=True)

    # Save the FAISS index itself
    index_path = os.path.join(doc_folder, "index.faiss")
    faiss.write_index(index, index_path)

    # Save the chunks list — position i in this list matches
    # vector i in the FAISS index
    chunks_path = os.path.join(doc_folder, "chunks.pkl")
    with open(chunks_path, "wb") as f:
        pickle.dump(chunks, f)

    print(f"[rag_pipeline] Saved index + chunks to {doc_folder}")
    return doc_folder


def load_index(doc_id: str) -> tuple:
    """
    Load a previously saved FAISS index and its chunks.
    Returns (index, chunks) so you can search and get back the
    matching original text.
    """
    doc_folder = os.path.join(settings.INDEXES_DIR, doc_id)
    index_path = os.path.join(doc_folder, "index.faiss")
    chunks_path = os.path.join(doc_folder, "chunks.pkl")

    if not os.path.exists(index_path):
        raise FileNotFoundError(f"No index found for doc_id: {doc_id}")

    index = faiss.read_index(index_path)

    with open(chunks_path, "rb") as f:
        chunks = pickle.load(f)

    print(f"[rag_pipeline] Loaded index for {doc_id} — {index.ntotal} vectors")
    return index, chunks


def search_similar_chunks(doc_id: str, query: str, top_k: int = None) -> List[str]:
    """
    Given a question, find the most relevant chunks from a document.
    """
    if top_k is None:
        top_k = settings.TOP_K_CHUNKS

    index, chunks = load_index(doc_id)

    # Embed the query the SAME way chunks were embedded
    query_vector = _embedding_model.encode([query], convert_to_numpy=True)
    query_vector = query_vector.astype("float32")

    # Search — returns distances and indices of nearest vectors
    distances, indices = index.search(query_vector, top_k)

    # Get original text chunks at matching vector indices
    matched_chunks = [chunks[i] for i in indices[0] if i < len(chunks)]

    print(f"[rag_pipeline] Found {len(matched_chunks)} relevant chunks for query")
    return matched_chunks


def process_document_for_rag(doc_id: str, text: str) -> Dict:
    """
    Full pipeline: takes raw extracted text and a doc_id,
    chunks it, embeds it, builds a FAISS index, and saves it.
    This is the single function ingest.py will call.
    """
    # Step 1: chunk
    chunks = chunk_text(text)

    if len(chunks) == 0:
        raise ValueError("No text chunks produced — check PDF extraction")

    # Step 2: embed
    embeddings = embed_chunks(chunks)

    # Step 3: build index
    index = build_faiss_index(embeddings)

    # Step 4: save to disk
    save_index(doc_id, index, chunks)

    return {
        "doc_id": doc_id,
        "chunk_count": len(chunks),
        "embedding_dim": embeddings.shape[1],
        "status": "success"
    }