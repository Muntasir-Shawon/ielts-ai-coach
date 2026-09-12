"""
Speaking Voice AI and Analyzer Unit Tests (tests/test_speaking.py).
"""
import os
import sys
import pytest

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
sys.path.insert(0, PROJECT_ROOT)

from speaking.speech_analysis.analyzer import SpeakingAnalyzer

def test_speaking_analyzer():
    analyzer = SpeakingAnalyzer()
    sample_turns = [
        {
            "part": 1,
            "question": "Where is your hometown?",
            "response_text": "I grew up in an energetic coastal town. It offers outstanding natural scenery, although infrastructure has faced substantial growth recently.",
            "duration_sec": 12.0
        },
        {
            "part": 2,
            "question": "Describe a memorable journey.",
            "response_text": "Last summer, I embarked on a hiking trip across the northern peaks. It was a viable alternative to commercial resorts and had a profound impact on my perspective.",
            "duration_sec": 25.0
        }
    ]

    analysis = analyzer.analyze_session(sample_turns)

    assert "fluency" in analysis
    assert "lexical_resource" in analysis
    assert "grammar" in analysis
    assert "pronunciation" in analysis
    assert "estimated_band" in analysis
    assert 1.0 <= analysis["estimated_band"] <= 9.0
    assert analysis["estimated_band"] % 0.5 == 0
    assert analysis["metrics"]["words_per_minute"] > 0
    assert "disclaimer" in analysis
