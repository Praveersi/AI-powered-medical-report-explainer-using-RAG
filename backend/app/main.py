from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ingest, analyse, query   # ← add query

app = FastAPI(title="Medical Report Explainer", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest.router)
app.include_router(analyse.router)
app.include_router(query.router)   # ← add this

@app.get("/")
async def health():
    return {"status": "Medical Report Explainer API is running"} 