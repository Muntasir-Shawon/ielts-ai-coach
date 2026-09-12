"""
Dataset Profiling Script (Section 33 Compliance).
Profiles raw IELTS datasets: rows, columns, data types, missing values, duplicates,
example records, class distribution, and text length statistics.
"""
import os
import json
import pandas as pd
import numpy as np

RAW_DIR = os.path.join(os.path.dirname(__file__), "raw")

def profile_writing_dataset():
    csv_path = os.path.join(RAW_DIR, "ielts_writing_essays.csv")
    print("=" * 80)
    print("PROFILING DATASET: ielts_writing_essays.csv")
    print("=" * 80)

    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} does not exist.")
        return

    df = pd.read_csv(csv_path)

    # 1. Number of rows and columns
    rows, cols = df.shape
    print(f"1. Dimensions: {rows} rows, {cols} columns")

    # 2. Column names and Data Types
    print("\n2. Columns and Data Types:")
    for col, dtype in df.dtypes.items():
        print(f"   - {col}: {dtype}")

    # 3. Missing values
    print("\n3. Missing Values per Column:")
    missing = df.isnull().sum()
    for col, count in missing.items():
        print(f"   - {col}: {count} ({count / rows * 100:.2f}%)")

    # 4. Duplicate rows
    duplicates = df.duplicated().sum()
    print(f"\n4. Duplicate Rows: {duplicates}")

    # 5. Example records
    print("\n5. Example Record (Row 0):")
    sample = df.iloc[0].to_dict()
    for k, v in sample.items():
        if isinstance(v, str) and len(v) > 100:
            print(f"   - {k}: {v[:97]}...")
        else:
            print(f"   - {k}: {v}")

    # 6. Class distribution (overall_band, task, question_type)
    print("\n6. Class Distribution:")
    print("   [Overall Band Distribution]:")
    band_dist = df["overall_band"].value_counts().sort_index()
    for band, count in band_dist.items():
        print(f"     Band {band}: {count} ({count / rows * 100:.1f}%)")

    print("\n   [Task Distribution]:")
    for task, count in df["task"].value_counts().items():
        print(f"     {task}: {count}")

    print("\n   [Question Type Distribution]:")
    for qtype, count in df["question_type"].value_counts().items():
        print(f"     {qtype}: {count}")

    # 7. Text length statistics
    print("\n7. Text Length Statistics (Characters & Words):")
    essay_char_lens = df["essay"].astype(str).apply(len)
    essay_word_lens = df["essay"].astype(str).apply(lambda x: len(x.split()))
    prompt_char_lens = df["prompt"].astype(str).apply(len)

    print(f"   - Essay Word Count: Min={essay_word_lens.min()}, Max={essay_word_lens.max()}, Mean={essay_word_lens.mean():.1f}, Median={essay_word_lens.median():.1f}")
    print(f"   - Essay Char Count: Min={essay_char_lens.min()}, Max={essay_char_lens.max()}, Mean={essay_char_lens.mean():.1f}")
    print(f"   - Prompt Char Count: Min={prompt_char_lens.min()}, Max={prompt_char_lens.max()}, Mean={prompt_char_lens.mean():.1f}")

def profile_json_datasets():
    print("\n" + "=" * 80)
    print("PROFILING JSON DATASETS: Reading, Listening, Speaking, Vocabulary, Grammar")
    print("=" * 80)

    for fname in ["ielts_reading_tests.json", "ielts_listening_tests.json", "ielts_speaking_topics.json", "ielts_vocabulary.json", "ielts_grammar_drills.json"]:
        fpath = os.path.join(RAW_DIR, fname)
        if os.path.exists(fpath):
            with open(fpath, "r", encoding="utf-8") as f:
                data = json.load(f)
            print(f"\nDataset: {fname}")
            print(f"   - Total top-level records: {len(data)}")
            if isinstance(data, list) and len(data) > 0:
                print(f"   - Keys in first record: {list(data[0].keys())}")

if __name__ == "__main__":
    profile_writing_dataset()
    profile_json_datasets()
