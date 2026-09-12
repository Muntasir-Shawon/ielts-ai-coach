"""
IELTS AI Coach — Production FastAPI Backend Application (backend/main.py).
Exposes RESTful endpoints for four IELTS skills, Voice AI speaking examiner,
RAG-augmented AI tutor, ML band score predictions, and admin diagnostics.
"""
import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.session import engine
from database.models import Base

# Ensure project root in sys.path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.routers import (
    auth_router,
    questions_router,
    test_router,
    writing_router,
    speaking_router,
    ai_router,
    progress_router,
    vocabulary_router,
    grammar_router,
    admin_router
)

app = FastAPI(
    title="IELTS AI Coach API",
    description="Production-style backend for AI-powered IELTS preparation across all 4 skills (Listening, Reading, Writing, Speaking).",
    version="2.0.0"
)

# Enable CORS for modern web frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database schema
Base.metadata.create_all(bind=engine)

# Register API routers
app.include_router(auth_router.router)
app.include_router(questions_router.router)
app.include_router(test_router.router)
app.include_router(writing_router.router)
app.include_router(speaking_router.router)
app.include_router(ai_router.router)
app.include_router(progress_router.router)
app.include_router(vocabulary_router.router)
app.include_router(grammar_router.router)
app.include_router(admin_router.router)

@app.get("/")
def root():
    return {
        "app": "IELTS AI Coach API",
        "version": "2.0.0",
        "status": "online",
        "docs_url": "/docs",
        "skills_supported": ["reading", "listening", "writing", "speaking"],
        "disclaimer": "AI-estimated practice scores provided. Not an official IELTS evaluation."
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ielts-ai-coach-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
