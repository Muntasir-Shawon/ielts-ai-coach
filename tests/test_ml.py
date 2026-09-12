"""
Machine Learning and Recommender Unit Tests (tests/test_ml.py).
"""
import os
import sys
import pytest

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
sys.path.insert(0, PROJECT_ROOT)

from ml.predict import BandPredictor
from ml.recommender import RecommendationEngine

def test_band_predictor_inference():
    predictor = BandPredictor()
    sample_student = {
        "reading_accuracy": 0.85,
        "listening_accuracy": 0.80,
        "writing_score": 7.0,
        "speaking_score": 7.5,
        "vocabulary_score": 0.80,
        "grammar_score": 0.75,
        "avg_response_time_sec": 40.0,
        "question_difficulty_level": 2,
        "historical_avg_band": 7.0
    }
    res = predictor.predict(sample_student)

    assert "estimated_band" in res
    assert 1.0 <= res["estimated_band"] <= 9.0
    assert res["estimated_band"] % 0.5 == 0 # Official IELTS 0.5 increment
    assert "skill_breakdown" in res
    assert res["weakest_skill"] in ["reading", "listening", "writing", "speaking"]

def test_recommendation_engine():
    recommender = RecommendationEngine()
    sample_scores = {
        "reading": 7.5,
        "listening": 7.0,
        "writing": 5.5,
        "speaking": 6.0
    }
    rec_res = recommender.generate_recommendations(sample_scores, top_k=4)

    assert rec_res["weakest_skill"] == "writing"
    assert rec_res["strongest_skill"] == "reading"
    assert len(rec_res["recommendations"]) == 4
    # Ensure remedial exercises target writing and grammar
    skills_in_recs = [r["skill"] for r in rec_res["recommendations"]]
    assert "writing" in skills_in_recs or "grammar" in skills_in_recs

def test_recommendation_precision_recall():
    recommender = RecommendationEngine()
    benchmark_cases = [
        {"scores": {"reading": 7.5, "listening": 7.0, "writing": 5.5, "speaking": 6.0}, "ground_truth_remedial_skills": ["writing", "grammar"]},
        {"scores": {"reading": 5.0, "listening": 7.0, "writing": 6.5, "speaking": 6.5}, "ground_truth_remedial_skills": ["reading"]}
    ]
    metrics = recommender.evaluate_precision_recall_at_k(benchmark_cases, k=3)
    assert "Precision@3" in metrics
    assert "Recall@3" in metrics
    assert 0.0 <= metrics["Precision@3"] <= 1.0
    assert 0.0 <= metrics["Recall@3"] <= 1.0
