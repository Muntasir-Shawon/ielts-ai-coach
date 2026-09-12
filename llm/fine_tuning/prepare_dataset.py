"""
Instruction Fine-Tuning Dataset Preparation (llm/fine_tuning/prepare_dataset.py).
Transforms cleaned IELTS Kaggle dataset into Alpaca/ShareGPT instruction format for LoRA/PEFT training.
"""
import os
import sys
import json
import pandas as pd

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(CURRENT_DIR))
RAW_CSV = os.path.join(PROJECT_ROOT, "data", "processed", "clean_writing_essays.csv")
OUT_JSON = os.path.join(CURRENT_DIR, "ielts_instruction_dataset.json")

def prepare_instruction_dataset():
    if not os.path.exists(RAW_CSV):
        print(f"File {RAW_CSV} not found.")
        return

    df = pd.read_csv(RAW_CSV)
    instructions = []

    for _, row in df.iterrows():
        instruction = f"You are an IELTS Writing Examiner. Evaluate this {row.get('task', 'Task 2')} essay for the prompt: '{row.get('prompt')}'"
        input_text = str(row.get("essay"))
        output_text = (
            f"Overall Band Score: {row.get('overall_band')}\n"
            f"- Task Response / Achievement: {row.get('task_response')}\n"
            f"- Coherence and Cohesion: {row.get('coherence_cohesion')}\n"
            f"- Lexical Resource: {row.get('lexical_resource')}\n"
            f"- Grammatical Range and Accuracy: {row.get('grammatical_accuracy')}\n\n"
            f"Examiner Summary: The candidate demonstrates {row.get('topic')} competence with appropriate structure."
        )

        instructions.append({
            "instruction": instruction,
            "input": input_text,
            "output": output_text
        })

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(instructions, f, indent=2)

    print(f"Successfully generated {len(instructions)} instruction-tuning pairs in {OUT_JSON}")

if __name__ == "__main__":
    prepare_instruction_dataset()
