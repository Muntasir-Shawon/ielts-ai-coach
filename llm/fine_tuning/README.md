# IELTS AI System Architecture: RAG vs. Fine-Tuning vs. ML Model vs. LLM

To ensure scientific and engineering rigor, this project maintains strict architectural separation between these four distinct AI paradigms:

---

| System Component | Paradigm | Core Role | Technology in this Project | Never Confuse With |
| :--- | :--- | :--- | :--- | :--- |
| **RAG (Retrieval-Augmented Generation)** | Dynamic Knowledge Retrieval | Retrieves authentic IELTS questions, criteria, and vocabulary from vector index at query time to eliminate hallucination. | `llm/rag/` (FAISS / Scikit-learn TF-IDF Vector Store + Cosine Index) | **NOT model training.** RAG does not change model weights; it simply provides grounded context in the prompt. |
| **Fine-Tuning (LoRA/PEFT)** | Style, Tone, and Task Adaptation | Teaches an open-source base LLM (e.g. Qwen2.5, Llama, Mistral) to adopt the exact voice and JSON schema of an IELTS examiner. | `llm/fine_tuning/` (HuggingFace PEFT / LoRA on Kaggle essay instruction pairs) | **NOT fact ingestion.** Fine-tuning adapts behavior and stylistic compliance, not memorization of dynamic facts. |
| **Machine Learning Model** | Numerical Scoring & Classification | Takes quantitative student telemetry (accuracy, time, past bands) and outputs estimated continuous band scores. | `ml/` (`RandomForest`, `GradientBoosting`, `Ridge`, Scikit-Learn) | **NOT text generation.** The ML model predicts numbers and identifies weak areas using tabular data. |
| **LLM (Large Language Model)** | Language Understanding & Reasoning | Analyzes student grammar, conducts two-way conversational speaking interviews, and explains mistakes. | `llm/llm_client.py` (Gemini API / OpenAI / Ollama / Heuristic NLP Engine) | **NOT a deterministic database.** Requires grounding via RAG and rubrics. |

---

## Reproducing the Fine-Tuning Pipeline

1. **Prepare Dataset**:
   ```bash
   python llm/fine_tuning/prepare_dataset.py
   ```
2. **Verify Configuration (Dry Run)**:
   ```bash
   python llm/fine_tuning/train_lora.py --dry_run
   ```
3. **Execute Full GPU Tuning (Optional on CUDA)**:
   ```bash
   python llm/fine_tuning/train_lora.py --dry_run=False --base_model=Qwen/Qwen2.5-0.5B-Instruct
   ```
