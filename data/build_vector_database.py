"""
Script to build the Vector Database from cleaned IELTS structured records and vocabulary.
Outputs saved index to llm/rag/vector_index.pkl
"""
import os
import sys
import json

# Ensure project root is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
sys.path.insert(0, PROJECT_ROOT)

from llm.rag.vector_store import IELTSVectorStore

def build_vector_db():
    structured_path = os.path.join(CURRENT_DIR, "processed", "ielts_structured_records.json")
    vocab_path = os.path.join(CURRENT_DIR, "processed", "clean_ielts_vocabulary.json")
    grammar_path = os.path.join(CURRENT_DIR, "processed", "clean_ielts_grammar_drills.json")

    docs = []
    if os.path.exists(structured_path):
        with open(structured_path, "r", encoding="utf-8") as f:
            docs.extend(json.load(f))

    if os.path.exists(vocab_path):
        with open(vocab_path, "r", encoding="utf-8") as f:
            vocab_data = json.load(f)
            for v in vocab_data:
                docs.append({
                    "id": v.get("id"),
                    "skill": "vocabulary",
                    "question_type": "flashcard",
                    "question": f"Vocabulary: {v.get('word')} ({v.get('part_of_speech')})",
                    "passage_context": f"Definition: {v.get('definition')}. Example: {v.get('example_sentence')}",
                    "options": v.get("synonyms", []),
                    "answer": v.get("word"),
                    "explanation": f"Collocations: {', '.join(v.get('collocations', []))}. Band level: {v.get('band_level')}",
                    "topic": v.get("topic", "general"),
                    "difficulty": "medium"
                })

    if os.path.exists(grammar_path):
        with open(grammar_path, "r", encoding="utf-8") as f:
            grm_data = json.load(f)
            for g in grm_data:
                docs.append({
                    "id": g.get("drill_id"),
                    "skill": "grammar",
                    "question_type": "error_drill",
                    "question": g.get("question"),
                    "passage_context": f"Category: {g.get('category')}. Instruction: {g.get('instruction')}",
                    "options": g.get("options", []),
                    "answer": g.get("correct_option"),
                    "explanation": g.get("rule_explanation"),
                    "topic": g.get("category", "grammar"),
                    "difficulty": g.get("difficulty", "medium")
                })

    print(f"Building vector database from {len(docs)} knowledge records...")
    vector_store = IELTSVectorStore()
    vector_store.add_documents(docs)
    print("Vector database built and indexed successfully at llm/rag/vector_index.pkl!")

    # Verify a test query
    sample_query = "What are the causes of environmental problems and who should solve them?"
    results = vector_store.search(sample_query, top_k=2)
    print(f"\nVerification query: '{sample_query}'")
    for r in results:
        print(f" - [Score: {r['score']}] {r['document']['question'][:80]}... (Skill: {r['document']['skill']})")

if __name__ == "__main__":
    build_vector_db()
