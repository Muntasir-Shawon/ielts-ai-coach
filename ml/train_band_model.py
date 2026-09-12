"""
IELTS Student Band Score ML Training Pipeline.
Trains Random Forest, Gradient Boosting, and Ridge models on multi-skill student performance data.
Evaluates regression metrics (MAE, RMSE, R²) and band accuracy (tolerance +/- 0.5).
Saves the champion model to ml/saved_models/band_predictor.pkl.
"""
import os
import pickle
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler

SAVED_MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
os.makedirs(SAVED_MODELS_DIR, exist_ok=True)

def generate_student_performance_dataset(num_samples: int = 2500, random_state: int = 42):
    """
    Simulates realistic student assessment histories adhering to official IELTS scoring standards.
    """
    np.random.seed(random_state)

    # Latent student English competence factor (3.5 to 8.5)
    latent_ability = np.random.normal(loc=6.2, scale=1.1, size=num_samples)
    latent_ability = np.clip(latent_ability, 3.5, 9.0)

    # Individual skill variations with natural correlations
    reading_acc = np.clip(latent_ability / 9.0 + np.random.normal(0, 0.08, num_samples), 0.2, 1.0)
    listening_acc = np.clip(latent_ability / 9.0 + np.random.normal(0, 0.08, num_samples), 0.2, 1.0)

    writing_score = np.clip(latent_ability + np.random.normal(-0.2, 0.45, num_samples), 3.0, 9.0)
    speaking_score = np.clip(latent_ability + np.random.normal(-0.1, 0.45, num_samples), 3.0, 9.0)

    vocab_score = np.clip(latent_ability / 9.0 + np.random.normal(0, 0.07, num_samples), 0.2, 1.0)
    grammar_score = np.clip(latent_ability / 9.0 + np.random.normal(0, 0.07, num_samples), 0.2, 1.0)

    # Higher ability tends to correspond with moderate, steady response times
    avg_response_time = np.clip(75 - (latent_ability * 4.5) + np.random.normal(0, 10, num_samples), 15, 120)

    question_difficulty = np.random.choice([1, 2, 3], size=num_samples, p=[0.3, 0.5, 0.2])

    historical_avg_band = np.clip(latent_ability + np.random.normal(0, 0.35, num_samples), 3.0, 9.0)

    # Convert accuracies to approximate raw IELTS band (0-9 scale)
    reading_band = np.clip(reading_acc * 9.0, 0, 9)
    listening_band = np.clip(listening_acc * 9.0, 0, 9)

    # Official IELTS overall band is average of 4 skills rounded to nearest 0.5
    raw_overall = (reading_band + listening_band + writing_score + speaking_score) / 4.0
    # Add subtle real-world noise & official 0.5 rounding rule
    overall_band = np.round(raw_overall * 2) / 2.0
    overall_band = np.clip(overall_band, 1.0, 9.0)

    df = pd.DataFrame({
        "reading_accuracy": reading_acc,
        "listening_accuracy": listening_acc,
        "writing_score": writing_score,
        "speaking_score": speaking_score,
        "vocabulary_score": vocab_score,
        "grammar_score": grammar_score,
        "avg_response_time_sec": avg_response_time,
        "question_difficulty_level": question_difficulty,
        "historical_avg_band": historical_avg_band,
        "overall_band": overall_band
    })

    return df

def train_and_select_model():
    print("=" * 70)
    print("IELTS STUDENT BAND SCORE ML MODEL TRAINING PIPELINE")
    print("=" * 70)

    df = generate_student_performance_dataset()
    features = [
        "reading_accuracy",
        "listening_accuracy",
        "writing_score",
        "speaking_score",
        "vocabulary_score",
        "grammar_score",
        "avg_response_time_sec",
        "question_difficulty_level",
        "historical_avg_band"
    ]
    target = "overall_band"

    X = df[features]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    models = {
        "Random Forest Regressor": RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42),
        "Gradient Boosting Regressor": GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=4, random_state=42),
        "Ridge Baseline": Ridge(alpha=1.0)
    }

    best_model_name = None
    best_model = None
    best_mae = float("inf")
    results = {}

    for name, model in models.items():
        if "Ridge" in name:
            model.fit(X_train_scaled, y_train)
            preds = model.predict(X_test_scaled)
        else:
            model.fit(X_train, y_train)
            preds = model.predict(X_test)

        # Round predictions to nearest 0.5 band for IELTS standard evaluation
        preds_rounded = np.round(preds * 2) / 2.0

        mae = mean_absolute_error(y_test, preds)
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        r2 = r2_score(y_test, preds)
        # Tolerance accuracy within 0.5 band score (standard IELTS examiner tolerance)
        exact_acc = np.mean(preds_rounded == y_test)
        tol_acc = np.mean(np.abs(preds_rounded - y_test) <= 0.5)

        results[name] = {
            "MAE": mae,
            "RMSE": rmse,
            "R2": r2,
            "Exact Accuracy": exact_acc,
            "Tolerance Accuracy (+/- 0.5 Band)": tol_acc
        }

        print(f"\nModel: {name}")
        print(f"  - MAE:                           {mae:.4f}")
        print(f"  - RMSE:                          {rmse:.4f}")
        print(f"  - R² Score:                      {r2:.4f}")
        print(f"  - Exact Band Match:              {exact_acc * 100:.2f}%")
        print(f"  - Within +/- 0.5 Band Tolerance: {tol_acc * 100:.2f}%")

        if mae < best_mae:
            best_mae = mae
            best_model_name = name
            best_model = model

    print("\n" + "=" * 70)
    print(f"Champion Model Selected: {best_model_name} (MAE: {best_mae:.4f})")
    print("=" * 70)

    # Feature Importance analysis
    if hasattr(best_model, "feature_importances_"):
        importances = best_model.feature_importances_
        print("\nFeature Importances:")
        for feat, imp in sorted(zip(features, importances), key=lambda x: x[1], reverse=True):
            print(f"  - {feat:30s}: {imp * 100:.2f}%")

    # Save artifact
    artifact_path = os.path.join(SAVED_MODELS_DIR, "band_predictor.pkl")
    with open(artifact_path, "wb") as f:
        pickle.dump({
            "model_name": best_model_name,
            "model": best_model,
            "scaler": scaler,
            "features": features,
            "metrics": results[best_model_name]
        }, f)

    print(f"\nChampion model artifacts successfully saved to: {artifact_path}")
    return best_model_name, results

if __name__ == "__main__":
    train_and_select_model()
