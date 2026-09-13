"""
Admin Dashboard Router (backend/routers/admin_router.py - Section 27 Compliance).
Provides dataset profiling statistics, ML performance metrics, user counts,
and triggers for re-training and re-indexing.
"""
import os
import sys
import pickle
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from database.models import User, Question, Dataset, WritingSubmission, SpeakingSession, TestAttempt, StudyProgress, StudentScore
from backend.auth import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])

SAVED_MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "ml", "saved_models")

@router.get("/stats")
def get_admin_system_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_questions = db.query(Question).count()
    total_writing = db.query(WritingSubmission).count()
    total_speaking = db.query(SpeakingSession).count()
    total_tests = db.query(TestAttempt).count()

    # Load ML metrics from saved artifact
    ml_metrics = {}
    artifact_path = os.path.join(SAVED_MODELS_DIR, "band_predictor.pkl")
    if os.path.exists(artifact_path):
        try:
            with open(artifact_path, "rb") as f:
                pkg = pickle.load(f)
                ml_metrics = {
                    "model_name": pkg.get("model_name"),
                    "features_count": len(pkg.get("features", [])),
                    "metrics": pkg.get("metrics")
                }
        except Exception as e:
            ml_metrics = {"error": str(e)}

    datasets = db.query(Dataset).all()

    # List of all registered users with individual records
    users = db.query(User).all()
    users_list = []
    for u in users:
        prog = db.query(StudyProgress).filter(StudyProgress.user_id == u.id).first()
        latest = db.query(StudentScore).filter(StudentScore.user_id == u.id).order_by(StudentScore.recorded_at.desc()).first()
        users_list.append({
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "target_band": u.target_band,
            "total_tests_completed": prog.total_tests_completed if prog else 0,
            "overall_band": latest.overall_band if latest else None,
            "skills": {
                "reading": latest.reading_band if latest else None,
                "listening": latest.listening_band if latest else None,
                "writing": latest.writing_band if latest else None,
                "speaking": latest.speaking_band if latest else None,
            },
            "created_at": u.created_at
        })

    return {
        "overview": {
            "registered_students": total_users,
            "total_questions_in_bank": total_questions,
            "writing_submissions_evaluated": total_writing,
            "speaking_sessions_conducted": total_speaking,
            "mock_tests_completed": total_tests
        },
        "ml_model_status": ml_metrics,
        "datasets": [
            {
                "id": d.id,
                "name": d.name,
                "source": d.source,
                "record_count": d.record_count,
                "version": d.version,
                "uploaded_at": d.uploaded_at
            }
            for d in datasets
        ],
        "registered_users": users_list
    }
