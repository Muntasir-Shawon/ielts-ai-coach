"""
Speaking Voice AI Examiner Router (backend/routers/speaking_router.py).
Conducts full 3-part voice speaking test sessions, ingests audio / transcripts,
and delivers multi-criteria analytical band reports.
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.session import get_db
from database.models import User, SpeakingSession, SpeakingTranscript
from backend.auth import get_current_user
from backend.services.speaking_service import SpeakingService

router = APIRouter(prefix="/api/speaking", tags=["Speaking"])
speaking_service = SpeakingService()

class StartSpeakingRequest(BaseModel):
    topic: str = "Technology and Modern Society"

class SpeakingAnswerRequest(BaseModel):
    session_id: int
    transcript: str
    duration_seconds: float = 15.0
    part: int = 1

class FinishSpeakingRequest(BaseModel):
    session_id: int

@router.post("/start")
def start_speaking_test(
    req: StartSpeakingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = speaking_service.start_session(db, current_user, topic=req.topic)
    return result

@router.post("/answer")
def submit_speaking_turn(
    req: SpeakingAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not req.transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript cannot be empty.")

    result = speaking_service.process_turn(
        db=db,
        session_id=req.session_id,
        student_transcript=req.transcript,
        duration_sec=req.duration_seconds,
        part=req.part
    )
    return result

@router.post("/finish")
def finish_speaking_test(
    req: FinishSpeakingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = speaking_service.finish_session(db, req.session_id)
    return result

@router.get("/history")
def get_speaking_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = db.query(SpeakingSession).filter(
        SpeakingSession.user_id == current_user.id
    ).order_by(SpeakingSession.created_at.desc()).limit(10).all()

    return [
        {
            "id": s.id,
            "topic": s.topic,
            "status": s.status,
            "estimated_band": s.estimated_band,
            "scores": {
                "fluency": s.fluency_score,
                "lexical_resource": s.lexical_score,
                "grammar": s.grammar_score,
                "pronunciation": s.pronunciation_score
            },
            "created_at": s.created_at
        }
        for s in sessions
    ]
