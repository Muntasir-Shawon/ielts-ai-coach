"""
Mock Test API Router (backend/routers/mock_test_router.py).
Handles authoritative mock examination lifecycle, auto-saving, section transitions,
session recovery, history retrieval, and detailed diagnostic reporting.
"""
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from database.session import get_db
from database.models import User, MockTestSession
from backend.auth import get_current_user
from backend.services.mock_test_engine import MockTestEngine

router = APIRouter(prefix="/api/mock-tests", tags=["Mock Test Simulator"])
mock_engine = MockTestEngine()

class StartMockTestRequest(BaseModel):
    test_type: str = Field(default="academic", description="academic | general_training")
    mode: str = Field(default="exam", description="exam | practice")
    module: str = Field(default="full", description="full | listening | reading | writing | speaking")
    set_id: Optional[int] = Field(default=1, description="Question Test Set (1, 2, 3)")

class AutosaveRequest(BaseModel):
    answers: Dict[str, Any]
    current_section: str
    current_question_index: int = 0

class SubmitSectionRequest(BaseModel):
    section_name: str
    answers: Dict[str, Any]

@router.post("/start")
def start_mock_test(
    req: StartMockTestRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        session_state = mock_engine.create_session(
            db=db,
            user=current_user,
            test_type=req.test_type,
            mode=req.mode,
            module=req.module,
            set_id=req.set_id or 1
        )
        return session_state
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initialize mock test session: {str(e)}")

@router.get("/history")
def get_mock_test_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns history of completed and in-progress mock tests for the authenticated student.
    """
    sessions = db.query(MockTestSession).filter(
        MockTestSession.user_id == current_user.id
    ).order_by(MockTestSession.created_at.desc()).limit(20).all()

    return [
        {
            "session_id": s.session_id,
            "test_type": s.test_type,
            "mode": s.mode,
            "module": s.module,
            "status": s.status,
            "overall_band": s.overall_band,
            "section_scores": s.section_scores,
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "updated_at": s.updated_at.isoformat() if s.updated_at else None
        }
        for s in sessions
    ]

@router.get("/{session_id}")
def get_or_recover_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Authoritative recovery endpoint on browser refresh or reconnect.
    Restores answers, current section, and remaining timer without reset.
    """
    try:
        return mock_engine.recover_session(db=db, session_id=session_id, user=current_user)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error recovering session: {str(e)}")

@router.post("/{session_id}/autosave")
def autosave_session(
    session_id: str,
    req: AutosaveRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Called periodically every few seconds to guarantee zero loss of candidate work.
    """
    try:
        return mock_engine.autosave(
            db=db,
            session_id=session_id,
            user=current_user,
            answers=req.answers,
            current_section=req.current_section,
            current_question_index=req.current_question_index
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Autosave failed: {str(e)}")

@router.post("/{session_id}/submit-section")
def submit_section(
    session_id: str,
    req: SubmitSectionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submits current section, calculates scores, and advances to next section or finalizes.
    """
    try:
        return mock_engine.submit_section(
            db=db,
            session_id=session_id,
            user=current_user,
            section_name=req.section_name,
            answers=req.answers
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Submission failed: {str(e)}")

@router.get("/{session_id}/result")
def get_session_result(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves full post-exam diagnostic report for a completed mock test session.
    """
    session = db.query(MockTestSession).filter(
        MockTestSession.session_id == session_id,
        MockTestSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Mock test session not found.")

    if session.status != "completed":
        raise HTTPException(status_code=400, detail="Test session is not yet completed.")

    return session.result_summary or {
        "session_id": session.session_id,
        "overall_band": session.overall_band,
        "section_scores": session.section_scores,
        "disclaimer": "AI-estimated practice score. Not an official IELTS evaluation."
    }
