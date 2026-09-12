"""
IELTS Speaking Evaluation Engine (speaking/speech_analysis/analyzer.py).
Evaluates student speech transcripts and audio metrics across the 4 official IELTS criteria:
1. Fluency and Coherence
2. Lexical Resource
3. Grammatical Range and Accuracy
4. Pronunciation
"""
import re
from typing import Dict, Any, List

class SpeakingAnalyzer:
    def __init__(self):
        self.filler_words = {"um", "uh", "er", "ah", "like", "you know", "sort of", "kind of"}
        self.academic_collocations = {
            "profound impact", "substantial growth", "crucial factor", "viable alternative",
            "sustainable development", "significant influence", "marked increase", "vital role",
            "play a role", "in my opinion", "on the other hand", "furthermore", "consequently"
        }

    def analyze_session(self, turns: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyzes full 3-part speaking test session containing multiple question-answer turns.
        Each turn has: { "part": 1/2/3, "question": str, "response_text": str, "duration_sec": float }
        """
        all_text = " ".join([t.get("response_text", "") for t in turns]).strip()
        total_duration = sum([t.get("duration_sec", 15.0) for t in turns])

        words = re.findall(r"\b[A-Za-z']+\b", all_text.lower())
        total_words = len(words)
        unique_words = len(set(words))

        # 1. Fluency & Coherence Analysis
        # Natural IELTS speaking rate is typically 110 - 150 words per minute
        wpm = (total_words / max(10.0, total_duration)) * 60.0
        filler_count = sum(1 for w in words if w in self.filler_words)
        for f in ["you know", "sort of", "kind of"]:
            filler_count += all_text.lower().count(f)

        hesitation_ratio = filler_count / max(1, total_words)

        if wpm >= 115 and hesitation_ratio < 0.04:
            fluency_score = 7.5
        elif wpm >= 95 and hesitation_ratio < 0.08:
            fluency_score = 6.5
        elif wpm >= 75:
            fluency_score = 5.5
        else:
            fluency_score = 4.5

        # 2. Lexical Resource Analysis
        # Type-Token Ratio (TTR)
        ttr = unique_words / max(1, total_words)
        collocations_found = [c for c in self.academic_collocations if c in all_text.lower()]

        if ttr >= 0.55 and len(collocations_found) >= 2:
            lexical_score = 7.5
        elif ttr >= 0.42 or len(collocations_found) >= 1:
            lexical_score = 6.5
        else:
            lexical_score = 5.5

        # 3. Grammatical Range & Accuracy
        sentences = [s.strip() for s in re.split(r"[.!?]+", all_text) if s.strip()]
        avg_sent_len = total_words / max(1, len(sentences))
        complex_connectors = ["although", "whereas", "because", "even though", "since", "while", "if", "unless"]
        complex_count = sum(1 for c in complex_connectors if c in all_text.lower())

        if complex_count >= 3 and avg_sent_len >= 12:
            grammar_score = 7.0
        elif complex_count >= 1 and avg_sent_len >= 8:
            grammar_score = 6.0
        else:
            grammar_score = 5.0

        # 4. Pronunciation Indicators (Acoustic / Intelligibility heuristics)
        # Higher confidence in transcript detection corresponds to higher acoustic clarity
        pronunciation_score = 6.5
        if hesitation_ratio < 0.05 and wpm >= 100:
            pronunciation_score = 7.0
        elif hesitation_ratio > 0.12 or wpm < 70:
            pronunciation_score = 5.5

        # Calculate overall band (average of 4 criteria rounded to 0.5)
        raw_band = (fluency_score + lexical_score + grammar_score + pronunciation_score) / 4.0
        estimated_band = round(raw_band * 2) / 2.0

        strengths = []
        weaknesses = []

        if fluency_score >= 6.5:
            strengths.append(f"Maintained steady conversational pacing at approximately {int(wpm)} words per minute.")
        else:
            weaknesses.append(f"Speech pace was hesitant ({int(wpm)} WPM); work on reducing filler pauses ('um', 'like').")

        if lexical_score >= 6.5:
            strengths.append(f"Good vocabulary variation (Type-Token Ratio: {ttr:.2f}) with topic-specific phrasing.")
        else:
            weaknesses.append("Frequent repetition of elementary vocabulary; integrate higher-level synonyms and collocations.")

        if grammar_score >= 6.5:
            strengths.append("Successfully integrated complex subordinate clauses without breaking communication flow.")
        else:
            weaknesses.append("Predominance of simple coordinate sentences. Practice incorporating conditional and concession clauses.")

        return {
            "fluency": fluency_score,
            "lexical_resource": lexical_score,
            "grammar": grammar_score,
            "pronunciation": pronunciation_score,
            "estimated_band": estimated_band,
            "metrics": {
                "total_words": total_words,
                "total_duration_seconds": round(total_duration, 1),
                "words_per_minute": round(wpm, 1),
                "hesitation_count": filler_count,
                "type_token_ratio": round(ttr, 3),
                "collocations_detected": collocations_found
            },
            "strengths": strengths,
            "weaknesses": weaknesses,
            "disclaimer": "AI-estimated practice score. This is not an official IELTS result."
        }

if __name__ == "__main__":
    analyzer = SpeakingAnalyzer()
    sample_turns = [
        {
            "part": 1,
            "question": "Where is your hometown located?",
            "response_text": "I was born and raised in a coastal municipality. What I really appreciate is the peaceful ambiance and clean air, although recently there has been substantial growth in tourism.",
            "duration_sec": 14.0
        },
        {
            "part": 2,
            "question": "Describe a memorable journey you took.",
            "response_text": "Two years ago, I embarked on a journey across the mountain ranges. It was a viable alternative to crowded seaside resorts. We hiked for three days, which had a profound impact on my physical endurance.",
            "duration_sec": 30.0
        }
    ]
    res = analyzer.analyze_session(sample_turns)
    print("Speaking Analysis Output:")
    print(f"  Fluency: {res['fluency']}")
    print(f"  Lexical Resource: {res['lexical_resource']}")
    print(f"  Grammar: {res['grammar']}")
    print(f"  Pronunciation: {res['pronunciation']}")
    print(f"  Estimated Band: {res['estimated_band']}")
    print(f"  Strengths: {res['strengths']}")
