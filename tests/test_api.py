"""
FastAPI End-to-End API Tests (tests/test_api.py).
Tests authentication, Reading, Listening, Writing, Speaking, AI Tutor, and Dashboard endpoints.
"""
import os
import sys
import pytest
from fastapi.testclient import TestClient

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
sys.path.insert(0, PROJECT_ROOT)

from backend.main import app

client = TestClient(app)

def test_root_and_health():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["app"] == "IELTS AI Coach API"

    h = client.get("/health")
    assert h.status_code == 200
    assert h.json()["status"] == "healthy"

def test_auth_login():
    # Login as demo student
    res = client.post("/api/auth/login", json={
        "email": "student@ielts.com",
        "password": "password123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "student@ielts.com"

def test_reading_flow():
    # 1. Fetch reading tests
    res = client.get("/api/tests/reading")
    assert res.status_code == 200
    tests = res.json()
    assert len(tests) > 0
    first_id = tests[0]["id"]

    # 2. Login to get token
    login_res = client.post("/api/auth/login", json={
        "email": "student@ielts.com",
        "password": "password123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Submit reading test
    sub_res = client.post(
        "/api/tests/reading/submit",
        headers=headers,
        json={
            "test_id": first_id,
            "answers": {"R1-Q1": "FALSE", "R1-Q2": "B"},
            "time_taken_seconds": 600
        }
    )
    assert sub_res.status_code == 200
    sub_data = sub_res.json()
    assert "estimated_band" in sub_data
    assert "accuracy_percent" in sub_data

def test_writing_evaluation():
    login_res = client.post("/api/auth/login", json={
        "email": "student@ielts.com",
        "password": "password123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    sample_essay = (
        "In recent decades, artificial intelligence has made astounding progress in various sectors, "
        "leading some to argue that traditional educators will eventually become obsolete. "
        "While automated algorithms can deliver customized practice and rapid evaluations, "
        "I firmly disagree that AI can completely supplant human educators due to pedagogical empathy and critical guidance."
    )

    eval_res = client.post(
        "/api/writing/evaluate",
        headers=headers,
        json={
            "task": "Task 2",
            "prompt": "Will artificial intelligence replace teachers?",
            "essay_text": sample_essay
        }
    )
    assert eval_res.status_code == 200
    data = eval_res.json()
    assert "evaluation" in data
    assert "estimated_band" in data["evaluation"]
    assert "criteria_scores" in data["evaluation"]

def test_speaking_session_flow():
    login_res = client.post("/api/auth/login", json={
        "email": "student@ielts.com",
        "password": "password123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Start speaking session
    start_res = client.post(
        "/api/speaking/start",
        headers=headers,
        json={"topic": "Technology and Society"}
    )
    assert start_res.status_code == 200
    session_id = start_res.json()["session_id"]
    assert "examiner_question" in start_res.json()

    # 2. Answer turn
    answer_res = client.post(
        "/api/speaking/answer",
        headers=headers,
        json={
            "session_id": session_id,
            "transcript": "I live in a peaceful neighborhood which has undergone substantial growth in public amenities.",
            "duration_seconds": 15.0,
            "part": 1
        }
    )
    assert answer_res.status_code == 200

    # 3. Finish session
    finish_res = client.post(
        "/api/speaking/finish",
        headers=headers,
        json={"session_id": session_id}
    )
    assert finish_res.status_code == 200
    finish_data = finish_res.json()
    assert finish_data["is_finished"] is True
    assert "evaluation" in finish_data
    assert "estimated_band" in finish_data["evaluation"]

def test_ai_tutor_chat():
    login_res = client.post("/api/auth/login", json={
        "email": "student@ielts.com",
        "password": "password123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    chat_res = client.post(
        "/api/ai/chat",
        headers=headers,
        json={"message": "How do I move from Band 6 to Band 7 in IELTS Writing?"}
    )
    assert chat_res.status_code == 200
    data = chat_res.json()
    assert "reply" in data
    assert "citations" in data

def test_progress_dashboard():
    login_res = client.post("/api/auth/login", json={
        "email": "student@ielts.com",
        "password": "password123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    prog_res = client.get("/api/progress", headers=headers)
    assert prog_res.status_code == 200
    prog_data = prog_res.json()
    assert "overall_band" in prog_data
    assert "skill_breakdown" in prog_data
    assert "recommendations" in prog_data
