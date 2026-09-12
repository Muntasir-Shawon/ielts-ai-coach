"""
Preprocesses cleaned IELTS datasets into standardized structured records.
Outputs: data/processed/ielts_structured_records.json
"""
import os
import json
import pandas as pd

PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "processed")

def create_structured_records():
    records = []

    # 1. Process Reading Questions
    reading_path = os.path.join(PROCESSED_DIR, "clean_ielts_reading_tests.json")
    if os.path.exists(reading_path):
        with open(reading_path, "r", encoding="utf-8") as f:
            reading_data = json.load(f)
        for test in reading_data:
            topic = test.get("topic", "general")
            diff = test.get("difficulty", "medium")
            passage = test.get("passage", "")
            for q in test.get("questions", []):
                records.append({
                    "id": q.get("question_id"),
                    "skill": "reading",
                    "question_type": q.get("question_type"),
                    "question": q.get("question"),
                    "passage_context": passage,
                    "options": q.get("options", []),
                    "answer": q.get("answer"),
                    "explanation": q.get("explanation"),
                    "topic": topic,
                    "difficulty": diff
                })

    # 2. Process Listening Questions
    listening_path = os.path.join(PROCESSED_DIR, "clean_ielts_listening_tests.json")
    if os.path.exists(listening_path):
        with open(listening_path, "r", encoding="utf-8") as f:
            listening_data = json.load(f)
        for section in listening_data:
            topic = section.get("topic", "general")
            cue = section.get("transcript_cue", "")
            for q in section.get("questions", []):
                records.append({
                    "id": q.get("question_id"),
                    "skill": "listening",
                    "question_type": q.get("question_type"),
                    "question": q.get("question"),
                    "passage_context": cue,
                    "options": q.get("options", []),
                    "answer": q.get("answer"),
                    "explanation": q.get("explanation"),
                    "topic": topic,
                    "difficulty": "medium"
                })

    # 3. Process Writing Prompts
    writing_path = os.path.join(PROCESSED_DIR, "clean_writing_essays.csv")
    if os.path.exists(writing_path):
        wdf = pd.read_csv(writing_path)
        for _, row in wdf.head(20).iterrows():
            records.append({
                "id": str(row["id"]),
                "skill": "writing",
                "question_type": str(row["question_type"]),
                "question": str(row["prompt"]),
                "passage_context": str(row["task"]),
                "options": [],
                "answer": f"Model Band {row['overall_band']}: {str(row['essay'])[:200]}...",
                "explanation": f"TR: {row['task_response']}, CC: {row['coherence_cohesion']}, LR: {row['lexical_resource']}, GA: {row['grammatical_accuracy']}",
                "topic": str(row["topic"]),
                "difficulty": "hard" if row["overall_band"] >= 7.5 else "medium"
            })

    # 4. Process Speaking Prompts
    speaking_path = os.path.join(PROCESSED_DIR, "clean_ielts_speaking_topics.json")
    if os.path.exists(speaking_path):
        with open(speaking_path, "r", encoding="utf-8") as f:
            spk_data = json.load(f)
        for item in spk_data:
            topic = item.get("topic", "general")
            # Part 1
            for idx, p1_q in enumerate(item.get("part_1", {}).get("questions", [])):
                records.append({
                    "id": f"{item.get('topic_id')}-P1-{idx+1}",
                    "skill": "speaking",
                    "question_type": "part_1_interview",
                    "question": p1_q,
                    "passage_context": "Part 1 Introduction & Interview",
                    "options": [],
                    "answer": "Candidate should answer fluently in 2-4 sentences without hesitations.",
                    "explanation": "Examiner assesses fluency, range of everyday vocabulary, and natural sentence rhythm.",
                    "topic": topic,
                    "difficulty": "easy"
                })
            # Part 2
            p2 = item.get("part_2", {})
            records.append({
                "id": f"{item.get('topic_id')}-P2",
                "skill": "speaking",
                "question_type": "part_2_cue_card",
                "question": p2.get("cue_card", ""),
                "passage_context": "Guidelines: " + " | ".join(p2.get("guidelines", [])),
                "options": [],
                "answer": "Continuous speech for 1-2 minutes covering all bullet points.",
                "explanation": "Examiner evaluates sustained discourse, coherent storytelling, and lexical diversity.",
                "topic": topic,
                "difficulty": "medium"
            })
            # Part 3
            for idx, p3_q in enumerate(item.get("part_3", {}).get("questions", [])):
                records.append({
                    "id": f"{item.get('topic_id')}-P3-{idx+1}",
                    "skill": "speaking",
                    "question_type": "part_3_discussion",
                    "question": p3_q,
                    "passage_context": "Part 3 Analytical Discussion",
                    "options": [],
                    "answer": "In-depth analytical answer exploring societal implications.",
                    "explanation": "Examiner tests ability to hypothesize, justify positions, and deploy complex grammatical structures.",
                    "topic": topic,
                    "difficulty": "hard"
                })

    out_path = os.path.join(PROCESSED_DIR, "ielts_structured_records.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)

    print(f"Created {len(records)} unified structured records in {out_path}")
    return records

if __name__ == "__main__":
    create_structured_records()
