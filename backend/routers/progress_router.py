"""
Dashboard Progress and Recommendation Router (backend/routers/progress_router.py).
Integrates the Machine Learning Band Predictor and Personalized Recommendation Engine.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from database.models import User, StudentScore, StudyProgress, TestAttempt, WritingSubmission, SpeakingSession
from backend.auth import get_current_user
from ml.predict import BandPredictor
from ml.recommender import RecommendationEngine

router = APIRouter(prefix="/api", tags=["Progress & Recommendations"])

band_predictor = BandPredictor()
recommender = RecommendationEngine()

@router.get("/progress")
def get_student_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    progress = db.query(StudyProgress).filter(StudyProgress.user_id == current_user.id).first()
    latest_score = db.query(StudentScore).filter(StudentScore.user_id == current_user.id).order_by(StudentScore.recorded_at.desc()).first()

    r_band = latest_score.reading_band if latest_score else 6.0
    l_band = latest_score.listening_band if latest_score else 6.0
    w_band = latest_score.writing_band if latest_score else 5.5
    s_band = latest_score.speaking_band if latest_score else 6.0

    # Execute ML Band Predictor model inference
    student_features = {
        "reading_accuracy": min(1.0, r_band / 9.0),
        "listening_accuracy": min(1.0, l_band / 9.0),
        "writing_score": w_band,
        "speaking_score": s_band,
        "vocabulary_score": 0.68,
        "grammar_score": 0.65,
        "avg_response_time_sec": 45.0,
        "question_difficulty_level": 2,
        "historical_avg_band": round((r_band + l_band + w_band + s_band) / 4.0 * 2) / 2.0
    }

    ml_result = band_predictor.predict(student_features)

    # Execute Recommendation Engine
    skill_scores = {
        "reading": r_band,
        "listening": l_band,
        "writing": w_band,
        "speaking": s_band
    }
    rec_result = recommender.generate_recommendations(skill_scores, top_k=4)

    # Recent attempts
    recent_tests = db.query(TestAttempt).filter(TestAttempt.user_id == current_user.id).order_by(TestAttempt.created_at.desc()).limit(5).all()

    return {
        "user_id": current_user.id,
        "full_name": current_user.full_name,
        "target_band": current_user.target_band,
        "overall_band": ml_result["estimated_band"],
        "raw_continuous_band": ml_result["raw_continuous_band"],
        "skill_breakdown": {
            "reading": r_band,
            "listening": l_band,
            "writing": w_band,
            "speaking": s_band
        },
        "weakest_skill": rec_result["weakest_skill"],
        "strongest_skill": rec_result["strongest_skill"],
        "study_streak_days": progress.study_streak_days if progress else 3,
        "total_tests_completed": progress.total_tests_completed if progress else 4,
        "vocabulary_words_learned": progress.vocabulary_words_learned if progress else 18,
        "recommendations": rec_result["recommendations"],
        "recommendation_summary": rec_result["summary"],
        "recent_tests": [
            {
                "id": t.id,
                "skill": t.skill,
                "score": t.score,
                "estimated_band": t.estimated_band,
                "created_at": t.created_at
            }
            for t in recent_tests
        ],
        "disclaimer": "AI-estimated practice score based on statistical simulation. Not an official IELTS result."
    }

@router.get("/recommendations")
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    latest_score = db.query(StudentScore).filter(StudentScore.user_id == current_user.id).order_by(StudentScore.recorded_at.desc()).first()
    skill_scores = {
        "reading": latest_score.reading_band if latest_score else 6.0,
        "listening": latest_score.listening_band if latest_score else 6.0,
        "writing": latest_score.writing_band if latest_score else 5.5,
        "speaking": latest_score.speaking_band if latest_score else 6.0
    }
    return recommender.generate_recommendations(skill_scores, top_k=6)
