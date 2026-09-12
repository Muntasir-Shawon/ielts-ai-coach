"""
Reading & Listening Tests Router (backend/routers/test_router.py).
"""
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.session import get_db
from database.models import ReadingTest, ListeningTest, User
from backend.auth import get_current_user
from backend.services.test_service import TestService

router = APIRouter(prefix="/api/tests", tags=["Tests"])
test_service = TestService()

class ReadingSubmissionRequest(BaseModel):
    test_id: int
    answers: Dict[str, str] # question_id -> student answer
    time_taken_seconds: int = 1200

class ListeningSubmissionRequest(BaseModel):
    test_id: int
    answers: Dict[str, str]
    time_taken_seconds: int = 900

@router.get("/reading")
def list_reading_tests(db: Session = Depends(get_db)):
    tests = db.query(ReadingTest).all()
    return [
        {
            "id": t.id,
            "title": t.title,
            "topic": t.topic,
            "difficulty": t.difficulty,
            "passage": t.passage,
            "questions": t.questions
        }
        for t in tests
    ]

@router.get("/reading/{test_id}")
def get_reading_test(test_id: int, db: Session = Depends(get_db)):
    test = db.query(ReadingTest).filter(ReadingTest.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Reading test not found")
    return {
        "id": test.id,
        "title": test.title,
        "topic": test.topic,
        "difficulty": test.difficulty,
        "passage": test.passage,
        "questions": test.questions
    }

@router.post("/reading/submit")
def submit_reading_test(
    req: ReadingSubmissionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = test_service.evaluate_reading_attempt(
        db=db,
        user=current_user,
        test_id=req.test_id,
        student_answers=req.answers,
        time_taken_seconds=req.time_taken_seconds
    )
    return result

@router.get("/listening")
def list_listening_tests(db: Session = Depends(get_db)):
    tests = db.query(ListeningTest).all()
    return [
        {
            "id": t.id,
            "section": t.section,
            "title": t.title,
            "audio_url": t.audio_url,
            "transcript_cue": t.transcript_cue,
            "topic": t.topic,
            "questions": t.questions
        }
        for t in tests
    ]

@router.post("/listening/submit")
def submit_listening_test(
    req: ListeningSubmissionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = test_service.evaluate_listening_attempt(
        db=db,
        user=current_user,
        test_id=req.test_id,
        student_answers=req.answers,
        time_taken_seconds=req.time_taken_seconds
    )
    return result
