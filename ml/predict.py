"""
IELTS Band Score Inference Engine (ml/predict.py).
Predicts estimated IELTS band score given a student's performance features.
"""
import os
import sys
import pickle
import numpy as np
import pandas as pd
from typing import Dict, Any

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
SAVED_MODELS_DIR = os.path.join(CURRENT_DIR, "saved_models")

class BandPredictor:
    def __init__(self, model_path: str = None):
        self.model_path = model_path or os.path.join(SAVED_MODELS_DIR, "band_predictor.pkl")
        self.model = None
        self.scaler = None
        self.features = []
        self.model_name = ""
        self.load_model()

    def load_model(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model artifact not found at {self.model_path}. Train model first.")

        with open(self.model_path, "rb") as f:
            data = pickle.load(f)
            self.model = data["model"]
            self.scaler = data.get("scaler")
            self.features = data["features"]
            self.model_name = data.get("model_name", "Band Predictor")

    def predict(self, student_stats: Dict[str, float]) -> Dict[str, Any]:
        """
        Input student features:
        - reading_accuracy: float (0.0 - 1.0)
        - listening_accuracy: float (0.0 - 1.0)
        - writing_score: float (0.0 - 9.0)
        - speaking_score: float (0.0 - 9.0)
        - vocabulary_score: float (0.0 - 1.0)
        - grammar_score: float (0.0 - 1.0)
        - avg_response_time_sec: float (seconds)
        - question_difficulty_level: int (1=easy, 2=medium, 3=hard)
        - historical_avg_band: float (0.0 - 9.0)
        """
        row = {}
        for feat in self.features:
            row[feat] = [student_stats.get(feat, 5.0 if "score" in feat or "band" in feat else 0.6)]

        df_in = pd.DataFrame(row)

        if "Ridge" in self.model_name and self.scaler:
            X = self.scaler.transform(df_in)
            raw_pred = float(self.model.predict(X)[0])
        else:
            raw_pred = float(self.model.predict(df_in)[0])

        raw_pred = float(np.clip(raw_pred, 1.0, 9.0))
        # Round to official IELTS 0.5 increment
        rounded_band = round(raw_pred * 2) / 2.0

        # Sub-skill breakdown & weak area identification
        skill_bands = {
            "reading": round(student_stats.get("reading_accuracy", 0.7) * 9.0 * 2) / 2.0,
            "listening": round(student_stats.get("listening_accuracy", 0.7) * 9.0 * 2) / 2.0,
            "writing": round(student_stats.get("writing_score", 6.0) * 2) / 2.0,
            "speaking": round(student_stats.get("speaking_score", 6.0) * 2) / 2.0
        }

        weakest_skill = min(skill_bands, key=skill_bands.get)
        strongest_skill = max(skill_bands, key=skill_bands.get)

        return {
            "estimated_band": rounded_band,
            "raw_continuous_band": round(raw_pred, 2),
            "skill_breakdown": skill_bands,
            "weakest_skill": weakest_skill,
            "strongest_skill": strongest_skill,
            "disclaimer": "AI-estimated practice score based on simulation; not an official IELTS result."
        }

if __name__ == "__main__":
    predictor = BandPredictor()
    sample_student = {
        "reading_accuracy": 0.78,
        "listening_accuracy": 0.72,
        "writing_score": 5.5,
        "speaking_score": 6.0,
        "vocabulary_score": 0.65,
        "grammar_score": 0.60,
        "avg_response_time_sec": 48.0,
        "question_difficulty_level": 2,
        "historical_avg_band": 6.0
    }
    result = predictor.predict(sample_student)
    print("Inference result for sample student:")
    for k, v in result.items():
        print(f"  {k}: {v}")
