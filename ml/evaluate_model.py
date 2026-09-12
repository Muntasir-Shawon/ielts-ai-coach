"""
Model Evaluation Script (Section 24 Compliance).
Provides comprehensive regression metrics (MAE, RMSE, R²), classification metrics
(Accuracy, Precision, Recall, F1-score, Confusion Matrix for discretized bands),
and documents model limitations.
"""
import os
import sys
import pickle
import numpy as np
import pandas as pd
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    classification_report,
    confusion_matrix
)

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
sys.path.insert(0, PROJECT_ROOT)

from ml.train_band_model import generate_student_performance_dataset

SAVED_MODELS_DIR = os.path.join(CURRENT_DIR, "saved_models")

def evaluate():
    artifact_path = os.path.join(SAVED_MODELS_DIR, "band_predictor.pkl")
    if not os.path.exists(artifact_path):
        print(f"Artifact {artifact_path} not found. Run train_band_model.py first.")
        return

    with open(artifact_path, "rb") as f:
        pkg = pickle.load(f)

    model = pkg["model"]
    scaler = pkg.get("scaler")
    features = pkg["features"]
    model_name = pkg["model_name"]

    print("=" * 75)
    print(f"EVALUATION REPORT: {model_name}")
    print("=" * 75)

    # Generate held-out evaluation dataset with a distinct random seed
    eval_df = generate_student_performance_dataset(num_samples=1000, random_state=999)
    X = eval_df[features]
    y_true = eval_df["overall_band"]

    if "Ridge" in model_name and scaler:
        X_scaled = scaler.transform(X)
        preds = model.predict(X_scaled)
    else:
        preds = model.predict(X)

    # 1. Regression Metrics
    mae = mean_absolute_error(y_true, preds)
    rmse = np.sqrt(mean_squared_error(y_true, preds))
    r2 = r2_score(y_true, preds)

    print("\n1. REGRESSION METRICS:")
    print(f"   - Mean Absolute Error (MAE):      {mae:.4f}")
    print(f"   - Root Mean Squared Error (RMSE): {rmse:.4f}")
    print(f"   - Coefficient of Determination (R²): {r2:.4f}")

    # 2. Classification / Discrete Band Metrics
    preds_bands = np.round(preds * 2) / 2.0
    preds_bands = np.clip(preds_bands, 1.0, 9.0)

    str_y_true = [f"Band {b:.1f}" for b in y_true]
    str_preds = [f"Band {b:.1f}" for b in preds_bands]

    labels = sorted(list(set(str_y_true).union(set(str_preds))))

    print("\n2. CLASSIFICATION METRICS (Discrete Band Mapping):")
    exact_acc = np.mean(preds_bands == y_true)
    tolerance_acc = np.mean(np.abs(preds_bands - y_true) <= 0.5)
    print(f"   - Exact Band Accuracy:                 {exact_acc * 100:.2f}%")
    print(f"   - Clinical Tolerance (+/- 0.5 Band):   {tolerance_acc * 100:.2f}%")

    print("\n3. CLASSIFICATION REPORT:")
    report = classification_report(str_y_true, str_preds, zero_division=0, labels=labels)
    print(report)

    print("\n4. CONFUSION MATRIX SUMMARY:")
    cm = confusion_matrix(str_y_true, str_preds, labels=labels)
    cm_df = pd.DataFrame(cm, index=labels, columns=labels)
    print(cm_df)

    # 5. Model Limitations (Section 24)
    print("\n" + "=" * 75)
    print("5. DOCUMENTED MODEL LIMITATIONS & ASSUMPTIONS (Section 24)")
    print("=" * 75)
    print("""
- Practice Simulation: Predicted bands are AI practice estimates and not official British Council/IDP scores.
- Synthetic Correlation: The training distribution models expected correlations across English sub-skills; students with extreme anomalies (e.g., Band 9.0 Reading and Band 3.0 Speaking) may see larger regression variances.
- Real Exam Stress Factors: Objective exam anxiety, acoustic variance in examination halls, and handwritten handwriting factors are unobserved in purely numerical feature space.
- Continuous Recalibration: Re-training should occur as new genuine student attempts accumulate.
    """)

if __name__ == "__main__":
    evaluate()
