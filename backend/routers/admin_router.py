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
from database.models import User, Question, Dataset, WritingSubmission, SpeakingSession, TestAttempt
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
        ]
    }
