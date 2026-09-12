"""
AI Tutor and Question Generation Router (backend/routers/ai_router.py).
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.session import get_db
from database.models import User
from backend.auth import get_current_user
from backend.services.ai_tutor_service import AITutorService

router = APIRouter(prefix="/api/ai", tags=["AI Tutor"])
ai_tutor_service = AITutorService()

class ChatRequest(BaseModel):
    message: str
    skill: Optional[str] = None

class GenerateQuestionRequest(BaseModel):
    skill: str = "reading" # reading, listening, writing, speaking
    topic: str = "technology"
    difficulty: str = "medium"
    question_type: str = "multiple_choice"

@router.post("/chat")
def chat_with_tutor(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be blank")

    result = ai_tutor_service.ask_tutor(
        db=db,
        user=current_user,
        question=req.message,
        skill=req.skill
    )
    return result

@router.post("/generate-question")
def generate_practice_question(
    req: GenerateQuestionRequest,
    current_user: User = Depends(get_current_user)
):
    result = ai_tutor_service.generate_practice_question(
        skill=req.skill,
        topic=req.topic,
        difficulty=req.difficulty,
        question_type=req.question_type
    )
    return result
