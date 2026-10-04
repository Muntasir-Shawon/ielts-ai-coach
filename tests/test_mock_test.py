"""
Unit and Integration Tests for IELTS Mock Test Simulator (tests/test_mock_test.py).
Tests official IELTS band calculation rounding, session lifecycle,
authoritative timer recovery, and auto-save persistence.
"""
import os
import sys
import pytest
from fastapi.testclient import TestClient

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.main import app
from backend.services.mock_test_engine import MockTestEngine

client = TestClient(app)

def test_ielts_band_rounding_rules():
    """
    Verifies official IELTS rounding specification:
    - ends in .25 -> round UP to .5 (e.g. 6.25 -> 6.5)
    - ends in .75 -> round UP to whole band (e.g. 6.75 -> 7.0)
    - ends in .125 -> round DOWN to whole band (e.g. 6.125 -> 6.0)
    - ends in .375 -> round UP to .5 (e.g. 6.375 -> 6.5)
    - ends in .625 -> round DOWN to .5 (e.g. 6.625 -> 6.5)
    - ends in .875 -> round UP to whole band (e.g. 6.875 -> 7.0)
    """
    engine = MockTestEngine()

    # Exact cases
    assert engine.calculate_overall_band(6.0, 6.0, 6.0, 6.0) == 6.0
    assert engine.calculate_overall_band(6.5, 6.5, 6.5, 6.5) == 6.5

    # Average 6.25 -> 6.5 (6.0 + 6.0 + 6.5 + 6.5 = 25.0 / 4 = 6.25)
    assert engine.calculate_overall_band(6.0, 6.0, 6.5, 6.5) == 6.5

    # Average 6.75 -> 7.0 (6.5 + 6.5 + 7.0 + 7.0 = 27.0 / 4 = 6.75)
    assert engine.calculate_overall_band(6.5, 6.5, 7.0, 7.0) == 7.0

    # Average 6.125 -> 6.0 (6.0 + 6.0 + 6.0 + 6.5 = 24.5 / 4 = 6.125)
    assert engine.calculate_overall_band(6.0, 6.0, 6.0, 6.5) == 6.0

    # Average 6.375 -> 6.5 (6.0 + 6.5 + 6.5 + 6.5 = 25.5 / 4 = 6.375)
    assert engine.calculate_overall_band(6.0, 6.5, 6.5, 6.5) == 6.5

    # Average 6.625 -> 6.5 (6.5 + 6.5 + 6.5 + 7.0 = 26.5 / 4 = 6.625)
    assert engine.calculate_overall_band(6.5, 6.5, 6.5, 7.0) == 6.5

    # Average 6.875 -> 7.0 (6.5 + 7.0 + 7.0 + 7.0 = 27.5 / 4 = 6.875)
    assert engine.calculate_overall_band(6.5, 7.0, 7.0, 7.0) == 7.0

def test_mock_package_generation():
    """
    Verifies that Academic and General Training mock packages contain all 4 skills.
    """
    from backend.services.mock_data_service import MockDataService
    service = MockDataService()

    acad_pkg = service.get_mock_package("academic", "full")
    assert "listening" in acad_pkg["sections"]
    assert "reading" in acad_pkg["sections"]
    assert "writing" in acad_pkg["sections"]
    assert "speaking" in acad_pkg["sections"]
    assert len(acad_pkg["sections"]["reading"]["passages"]) == 3

    gt_pkg = service.get_mock_package("general_training", "full")
    assert "listening" in gt_pkg["sections"]
    assert "reading" in gt_pkg["sections"]
    assert "writing" in gt_pkg["sections"]
    assert "speaking" in gt_pkg["sections"]
    assert len(gt_pkg["sections"]["reading"]["passages"]) == 3

def test_multi_set_mock_package_diversity():
    """
    Verifies that Set 1, Set 2, and Set 3 provide distinct questions and topics,
    preventing any question repetition across tests.
    """
    from backend.services.mock_data_service import MockDataService
    service = MockDataService()

    pkg1 = service.get_mock_package("academic", "full", set_id=1)
    pkg2 = service.get_mock_package("academic", "full", set_id=2)
    pkg3 = service.get_mock_package("academic", "full", set_id=3)

    # Verify distinct listening parts
    p1_title = pkg1["sections"]["listening"]["parts"][0]["title"]
    p2_title = pkg2["sections"]["listening"]["parts"][0]["title"]
    p3_title = pkg3["sections"]["listening"]["parts"][0]["title"]
    assert p1_title != p2_title
    assert p2_title != p3_title

    # Verify distinct reading passage 1 titles
    r1_title = pkg1["sections"]["reading"]["passages"][0]["title"]
    r2_title = pkg2["sections"]["reading"]["passages"][0]["title"]
    r3_title = pkg3["sections"]["reading"]["passages"][0]["title"]
    assert r1_title != r2_title
    assert r2_title != r3_title

    # Verify distinct writing prompts
    w1_prompt = pkg1["sections"]["writing"]["tasks"][0]["title"]
    w2_prompt = pkg2["sections"]["writing"]["tasks"][0]["title"]
    w3_prompt = pkg3["sections"]["writing"]["tasks"][0]["title"]
    assert w1_prompt != w2_prompt or pkg1["sections"]["writing"]["tasks"][1]["prompt"] != pkg2["sections"]["writing"]["tasks"][1]["prompt"]

def test_mock_session_api_flow():
    """
    Tests complete API lifecycle: start -> autosave -> recover -> submit section -> history.
    """
    # 1. Login
    login_res = client.post("/api/auth/login", json={
        "email": "student@ielts.com",
        "password": "password123"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Start full academic mock test in exam mode
    start_res = client.post("/api/mock-tests/start", json={
        "test_type": "academic",
        "mode": "exam",
        "module": "full"
    }, headers=headers)
    assert start_res.status_code == 200
    session_data = start_res.json()
    session_id = session_data["session_id"]
    assert session_data["status"] == "in_progress"
    assert session_data["current_section"] == "listening"
    assert session_data["remaining_seconds"] > 0
    assert "test_data" in session_data

    # 3. Autosave answers
    save_res = client.post(f"/api/mock-tests/{session_id}/autosave", json={
        "current_section": "listening",
        "current_question_index": 2,
        "answers": {"L-P1-Q1": "Henderson", "L-P1-Q2": "900123"}
    }, headers=headers)
    assert save_res.status_code == 200
    assert save_res.json()["status"] == "saved"

    # 4. Recover session (simulate browser refresh)
    rec_res = client.get(f"/api/mock-tests/{session_id}", headers=headers)
    assert rec_res.status_code == 200
    recovered = rec_res.json()
    assert recovered["session_id"] == session_id
    assert recovered["current_section"] == "listening"
    assert recovered["answers"]["listening"]["L-P1-Q1"] == "Henderson"
    assert recovered["remaining_seconds"] > 0

    # 5. Submit listening section -> should transition to reading
    sub_res = client.post(f"/api/mock-tests/{session_id}/submit-section", json={
        "section_name": "listening",
        "answers": {"L-P1-Q1": "Henderson", "L-P1-Q2": "900123", "L-P1-Q3": "B"}
    }, headers=headers)
    assert sub_res.status_code == 200
    transition_data = sub_res.json()
    assert transition_data["transition"] is True
    assert transition_data["next_section"] == "reading"

    # 6. Verify history listing
    hist_res = client.get("/api/mock-tests/history", headers=headers)
    assert hist_res.status_code == 200
    history = hist_res.json()
    assert len(history) > 0
    assert any(h["session_id"] == session_id for h in history)
