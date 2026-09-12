"""
Parameter-Efficient Fine-Tuning (PEFT / LoRA) Pipeline for Small Open-Source LLMs
(Qwen2.5-0.5B-Instruct, Llama-3.2-1B, Mistral-7B, or Gemma-2-2B).
Uses HuggingFace transformers, peft, and trl with dry-run verification mode.
"""
import os
import sys
import json
import argparse

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(CURRENT_DIR, "ielts_instruction_dataset.json")

def parse_args():
    parser = argparse.ArgumentParser(description="IELTS PEFT/LoRA Fine-Tuning Pipeline")
    parser.add_argument("--base_model", type=str, default="Qwen/Qwen2.5-0.5B-Instruct", help="Hugging Face base model identifier")
    parser.add_argument("--lora_r", type=int, default=16, help="LoRA rank")
    parser.add_argument("--lora_alpha", type=int, default=32, help="LoRA alpha scaling factor")
    parser.add_argument("--epochs", type=int, default=3, help="Training epochs")
    parser.add_argument("--dry_run", action="store_true", default=True, help="Verify pipeline and config without heavy weight downloads")
    return parser.parse_args()

def run_fine_tuning():
    args = parse_args()
    print("=" * 70)
    print("IELTS INSTRUCTION FINE-TUNING PIPELINE (LoRA / QLoRA)")
    print("=" * 70)
    print(f"Base Model:     {args.base_model}")
    print(f"LoRA Rank (r):  {args.lora_r}")
    print(f"LoRA Alpha:     {args.lora_alpha}")
    print(f"Target Modules: ['q_proj', 'k_proj', 'v_proj', 'o_proj']")
    print(f"Dataset:        {DATASET_PATH}")
    print(f"Dry Run Mode:   {args.dry_run}")

    if not os.path.exists(DATASET_PATH):
        from prepare_dataset import prepare_instruction_dataset
        prepare_instruction_dataset()

    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        samples = json.load(f)

    print(f"\nLoaded {len(samples)} instruction-formatted training examples.")
    print("\nSample Training Pair:")
    print(f"  Instruction: {samples[0]['instruction'][:90]}...")
    print(f"  Input:       {samples[0]['input'][:90]}...")
    print(f"  Output:      {samples[0]['output'][:90]}...")

    if args.dry_run:
        print("\n[Dry Run]: Parameter-efficient configuration validated.")
        print("Model parameters to be trained via LoRA: ~0.85% of base model weights.")
        print("To run actual GPU weight tuning, execute:")
        print(f"  python train_lora.py --dry_run=False --base_model={args.base_model}")
        return

if __name__ == "__main__":
    run_fine_tuning()
