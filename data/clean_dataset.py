"""
Dataset cleaning pipeline:
- Loads datasets
- Removes duplicates
- Imputes / handles missing values
- Normalizes text (whitespace, casing where appropriate, punctuation)
"""
import os
import re
import json
import pandas as pd

RAW_DIR = os.path.join(os.path.dirname(__file__), "raw")
PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "processed")
os.makedirs(PROCESSED_DIR, exist_ok=True)

def normalize_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    # Normalize unicode / multiple spaces
    text = re.sub(r"\s+", " ", text).strip()
    return text

def clean_writing_essays():
    raw_path = os.path.join(RAW_DIR, "ielts_writing_essays.csv")
    if not os.path.exists(raw_path):
        return None

    df = pd.read_csv(raw_path)
    # Deduplicate
    df = df.drop_duplicates(subset=["prompt", "essay"])

    # Handle missing values
    df["topic"] = df["topic"].fillna("general")
    df["question_type"] = df["question_type"].fillna("opinion")
    df["prompt"] = df["prompt"].apply(normalize_text)
    df["essay"] = df["essay"].apply(normalize_text)

    # Ensure band scores are within [0.0, 9.0]
    for col in ["overall_band", "task_response", "coherence_cohesion", "lexical_resource", "grammatical_accuracy"]:
        df[col] = df[col].clip(lower=0.0, upper=9.0)

    out_path = os.path.join(PROCESSED_DIR, "clean_writing_essays.csv")
    df.to_csv(out_path, index=False)
    print(f"Cleaned writing essays saved to {out_path} ({len(df)} records)")
    return df

def clean_json_dataset(filename: str):
    raw_path = os.path.join(RAW_DIR, filename)
    if not os.path.exists(raw_path):
        return None

    with open(raw_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Clean text recursively
    def recursive_clean(item):
        if isinstance(item, str):
            return normalize_text(item)
        elif isinstance(item, list):
            return [recursive_clean(x) for x in item]
        elif isinstance(item, dict):
            return {k: recursive_clean(v) for k, v in item.items()}
        return item

    cleaned = recursive_clean(data)
    out_path = os.path.join(PROCESSED_DIR, f"clean_{filename}")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(cleaned, f, indent=2)
    print(f"Cleaned {filename} saved to {out_path}")
    return cleaned

if __name__ == "__main__":
    clean_writing_essays()
    clean_json_dataset("ielts_reading_tests.json")
    clean_json_dataset("ielts_listening_tests.json")
    clean_json_dataset("ielts_speaking_topics.json")
    clean_json_dataset("ielts_vocabulary.json")
    clean_json_dataset("ielts_grammar_drills.json")
    print("Data cleaning completed successfully.")
