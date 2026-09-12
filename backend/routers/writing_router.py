"""
Writing Evaluation Router (backend/routers/writing_router.py).
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.session import get_db
from database.models import User, WritingSubmission
from backend.auth import get_current_user
from backend.services.writing_service import WritingService

router = APIRouter(prefix="/api/writing", tags=["Writing"])
writing_service = WritingService()

class WritingSubmissionRequest(BaseModel):
    task: str = "Task 2" # Task 1 | Task 2
    prompt: str
    essay_text: str

@router.post("/evaluate")
def evaluate_essay(
    req: WritingSubmissionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if len(req.essay_text.strip()) < 30:
        raise HTTPException(status_code=400, detail="Essay text is too brief for an IELTS evaluation.")

    result = writing_service.evaluate_essay(
        db=db,
        user=current_user,
        task=req.task,
        prompt=req.prompt,
        essay_text=req.essay_text
    )
    return result

@router.get("/history")
def get_writing_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    submissions = db.query(WritingSubmission).filter(
        WritingSubmission.user_id == current_user.id
    ).order_by(WritingSubmission.created_at.desc()).limit(15).all()

    return [
        {
            "id": s.id,
            "task": s.task,
            "prompt": s.prompt[:100] + "..." if len(s.prompt) > 100 else s.prompt,
            "word_count": s.word_count,
            "estimated_band": s.estimated_band,
            "scores": {
                "task_response": s.task_response_score,
                "coherence_cohesion": s.coherence_score,
                "lexical_resource": s.lexical_score,
                "grammatical_accuracy": s.grammar_score
            },
            "created_at": s.created_at
        }
        for s in submissions
    ]
