import os
from dotenv import load_dotenv

load_dotenv() 

class Settings:
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    STORAGE_DIR: str = os.getenv("STORAGE_DIR", "app/storage")
    CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", "400"))
    CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", "60"))
    TOP_K_CHUNKS: int = int(os.getenv("TOP_K_CHUNKS", "6"))
    MAX_FILE_MB: int = int(os.getenv("MAX_FILE_MB", "15"))

    # Derived paths
    @property
    def UPLOADS_DIR(self) -> str:
        return os.path.join(self.STORAGE_DIR, "uploads")

    @property
    def INDEXES_DIR(self) -> str:
        return os.path.join(self.STORAGE_DIR, "indexes")

settings = Settings() 