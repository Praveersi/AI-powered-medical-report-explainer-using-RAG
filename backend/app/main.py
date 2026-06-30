from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ingest  # ← add this

app = FastAPI(title="Medical Report Explainer", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(ingest.router)  # ← add this

@app.get("/")
async def health():
    return {"status": "Medical Report Explainer API is running"} 