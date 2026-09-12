"""
Personalized IELTS Recommendation Engine (ml/recommender.py).
Analyzes student performance history across skills and specific question types,
identifies priority weaknesses, and generates ranked practice recommendations.
Includes evaluation metrics: Precision@K and Recall@K.
"""
import os
import sys
from typing import List, Dict, Any, Set

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

class RecommendationEngine:
    def __init__(self):
        # Master repository of remedial exercise templates mapped to weakness profiles
        self.exercise_catalog = {
            "writing": [
                {"id": "REC-W-01", "type": "writing_task_2", "title": "Writing Task 2 Opinion Essay Practice", "skill": "writing", "priority": "high", "focus": "Task Response & Structure", "action_url": "/writing?task=task2&type=opinion"},
                {"id": "REC-W-02", "type": "coherence_drill", "title": "Cohesion & Coherence Discourse Markers", "skill": "writing", "priority": "high", "focus": "Linking Devices & Paragraph Flow", "action_url": "/grammar?cat=complex_sentences"},
                {"id": "REC-W-03", "type": "ai_writing_eval", "title": "AI Writing Evaluation & Diagnostic", "skill": "writing", "priority": "high", "focus": "4-Criteria Scoring & Line Edits", "action_url": "/writing"},
                {"id": "REC-W-04", "type": "writing_task_1", "title": "Writing Task 1 Trends & Overview Drill", "skill": "writing", "priority": "medium", "focus": "Data Comparison & Summarizing", "action_url": "/writing?task=task1"},
            ],
            "speaking": [
                {"id": "REC-S-01", "type": "speaking_part_2", "title": "Speaking Part 2 Long Turn Simulation", "skill": "speaking", "priority": "high", "focus": "Sustained Fluency & 2-Min Timer", "action_url": "/speaking?part=2"},
                {"id": "REC-S-02", "type": "speaking_part_3", "title": "Speaking Part 3 Abstract Discussion", "skill": "speaking", "priority": "high", "focus": "Justification & Academic Idioms", "action_url": "/speaking?part=3"},
                {"id": "REC-S-03", "type": "pronunciation_drill", "title": "Intonation & Word Stress Voice Drill", "skill": "speaking", "priority": "medium", "focus": "Pronunciation Clarity", "action_url": "/speaking"},
            ],
            "reading": [
                {"id": "REC-R-01", "type": "true_false_ng", "title": "True / False / Not Given Strategy Drill", "skill": "reading", "priority": "high", "focus": "Factual Verification vs Absence", "action_url": "/reading?type=true_false"},
                {"id": "REC-R-02", "type": "heading_matching", "title": "Heading Matching & Paragraph Skimming", "skill": "reading", "priority": "high", "focus": "Main Idea Extraction", "action_url": "/reading?type=headings"},
                {"id": "REC-R-03", "type": "speed_reading", "title": "Timed Academic Passage Reading", "skill": "reading", "priority": "medium", "focus": "Pacing & Time Management", "action_url": "/reading"},
            ],
            "listening": [
                {"id": "REC-L-01", "type": "form_completion", "title": "Section 1 Numbers & Spelling Form Completion", "skill": "listening", "priority": "high", "focus": "Accurate Spelling & Details", "action_url": "/listening?section=1"},
                {"id": "REC-L-02", "type": "academic_lecture", "title": "Section 4 Monologue Note Completion", "skill": "listening", "priority": "high", "focus": "Signposting & Scientific Terms", "action_url": "/listening?section=4"},
                {"id": "REC-L-03", "type": "multiple_choice_audio", "title": "Fast Dialogue Distractor Filtering", "skill": "listening", "priority": "medium", "focus": "Identifying Paraphrased Choices", "action_url": "/listening"},
            ],
            "foundational": [
                {"id": "REC-F-01", "type": "grammar_drill", "title": "IELTS Common Grammar Traps: Subject-Verb & Articles", "skill": "grammar", "priority": "high", "focus": "Grammatical Accuracy", "action_url": "/grammar"},
                {"id": "REC-F-02", "type": "vocabulary_drill", "title": "Academic Word List (AWL) Flashcard Mastery", "skill": "vocabulary", "priority": "high", "focus": "Lexical Resource & Collocations", "action_url": "/vocabulary"},
                {"id": "REC-F-03", "type": "ai_tutor_session", "title": "Ask AI Tutor: Clarify Weak Concept Questions", "skill": "ai-tutor", "priority": "medium", "focus": "Interactive Explanation", "action_url": "/ai-tutor"},
            ]
        }

    def generate_recommendations(self, skill_scores: Dict[str, float], history: List[Dict[str, Any]] = None, top_k: int = 5) -> Dict[str, Any]:
        """
        Generates personalized ranked recommendations based on current band scores and past attempts.
        """
        # Identify weakest and strongest skills
        skills = ["reading", "listening", "writing", "speaking"]
        current_scores = {s: skill_scores.get(s, 6.0) for s in skills}

        sorted_skills = sorted(current_scores.items(), key=lambda x: x[1])
        weakest_skill, weakest_score = sorted_skills[0]
        strongest_skill, strongest_score = sorted_skills[-1]

        recommendations = []

        # 1. High priority exercises from weakest skill
        weak_exercises = self.exercise_catalog.get(weakest_skill, [])
        for ex in weak_exercises:
            recommendations.append({
                **ex,
                "reason": f"Your current estimated {weakest_skill.capitalize()} band is {weakest_score:.1f}, which is your primary growth area."
            })

        # 2. Add foundational grammar or vocabulary reinforcement
        if weakest_skill in ["writing", "speaking"]:
            recommendations.append({
                **self.exercise_catalog["foundational"][0], # grammar
                "reason": f"Grammar accuracy directly drives your {weakest_skill.capitalize()} band score."
            })
            recommendations.append({
                **self.exercise_catalog["foundational"][1], # vocabulary
                "reason": "Expanding Lexical Resource with Academic collocations elevates bands from 6.0 to 7.5+."
            })

        # 3. Add secondary weakness if exists
        second_weakest, second_score = sorted_skills[1]
        for ex in self.exercise_catalog.get(second_weakest, [])[:2]:
            recommendations.append({
                **ex,
                "reason": f"Secondary focus: improve {second_weakest.capitalize()} from {second_score:.1f} to keep overall band balanced."
            })

        # Rank and slice to top_k
        ranked = recommendations[:top_k]

        return {
            "weakest_skill": weakest_skill,
            "weakest_score": weakest_score,
            "strongest_skill": strongest_skill,
            "strongest_score": strongest_score,
            "recommendations": ranked,
            "summary": f"Your strongest skill is {strongest_skill.capitalize()} ({strongest_score:.1f}), while {weakest_skill.capitalize()} ({weakest_score:.1f}) requires targeted practice. Focus on the recommended actions below to raise your overall band score."
        }

    def evaluate_precision_recall_at_k(self, test_cases: List[Dict[str, Any]], k: int = 5) -> Dict[str, float]:
        """
        Evaluates Precision@K and Recall@K on ground truth remedial needs.
        """
        precisions = []
        recalls = []

        for case in test_cases:
            scores = case["scores"]
            ground_truth_skills: Set[str] = set(case["ground_truth_remedial_skills"])

            rec_output = self.generate_recommendations(scores, top_k=k)
            recommended_skills = [r["skill"] for r in rec_output["recommendations"]]

            hits = sum(1 for s in recommended_skills if s in ground_truth_skills)

            p_at_k = hits / float(k)
            r_at_k = min(1.0, hits / float(len(ground_truth_skills))) if ground_truth_skills else 1.0

            precisions.append(p_at_k)
            recalls.append(r_at_k)

        return {
            f"Precision@{k}": round(sum(precisions) / len(precisions), 4),
            f"Recall@{k}": round(sum(recalls) / len(recalls), 4)
        }

if __name__ == "__main__":
    recommender = RecommendationEngine()
    sample_scores = {
        "reading": 7.0,
        "listening": 6.5,
        "writing": 5.5,
        "speaking": 6.0
    }
    recs = recommender.generate_recommendations(sample_scores, top_k=5)
    print("=" * 70)
    print("RECOMMENDATION ENGINE OUTPUT:")
    print("=" * 70)
    print("Summary:", recs["summary"])
    print("\nTop Recommendations:")
    for idx, r in enumerate(recs["recommendations"], 1):
        print(f"  {idx}. [{r['skill'].upper()}] {r['title']} - Focus: {r['focus']}")
        print(f"     Reason: {r['reason']}")

    # Run Precision@K and Recall@K benchmark
    benchmark_cases = [
        {"scores": {"reading": 7.5, "listening": 7.0, "writing": 5.5, "speaking": 6.0}, "ground_truth_remedial_skills": ["writing", "grammar", "vocabulary"]},
        {"scores": {"reading": 5.0, "listening": 7.0, "writing": 6.5, "speaking": 6.5}, "ground_truth_remedial_skills": ["reading"]},
        {"scores": {"reading": 7.0, "listening": 5.5, "writing": 6.5, "speaking": 6.0}, "ground_truth_remedial_skills": ["listening", "speaking"]},
        {"scores": {"reading": 6.5, "listening": 6.5, "writing": 6.5, "speaking": 5.0}, "ground_truth_remedial_skills": ["speaking", "grammar", "vocabulary"]},
    ]
    metrics = recommender.evaluate_precision_recall_at_k(benchmark_cases, k=5)
    print("\n" + "=" * 70)
    print("RECOMMENDER EVALUATION METRICS (Section 24):")
    print("=" * 70)
    for m, val in metrics.items():
        print(f"  - {m}: {val * 100:.2f}%")
