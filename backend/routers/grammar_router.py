"""
Grammar Diagnostic Drills Router (backend/routers/grammar_router.py).
Covers 10 core IELTS grammar categories: Articles, Subject-Verb Agreement,
Conditionals, Passive Voice, Relative Clauses, Complex Sentences, Tenses, Prepositions, etc.
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.session import get_db
from database.models import GrammarQuestion, User
from backend.auth import get_current_user

router = APIRouter(prefix="/api/grammar", tags=["Grammar"])

class CheckAnswerRequest(BaseModel):
    drill_id: int
    selected_option: str # A, B, C, D

@router.get("")
def list_grammar_drills(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(GrammarQuestion)
    if category:
        query = query.filter(GrammarQuestion.category.ilike(f"%{category}%"))
    if difficulty:
        query = query.filter(GrammarQuestion.difficulty == difficulty.lower())

    drills = query.all()
    return [
        {
            "id": d.id,
            "category": d.category,
            "difficulty": d.difficulty,
            "instruction": d.instruction,
            "question": d.question,
            "options": d.options,
            "rule_explanation": d.rule_explanation
        }
        for d in drills
    ]

@router.post("/check")
def check_grammar_answer(
    req: CheckAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    drill = db.query(GrammarQuestion).filter(GrammarQuestion.id == req.drill_id).first()
    if not drill:
        raise HTTPException(status_code=404, detail="Drill not found")

    selected = req.selected_option.strip().upper()
    correct = drill.correct_option.strip().upper()
    is_correct = (selected == correct or selected.startswith(correct))

    return {
        "drill_id": drill.id,
        "is_correct": is_correct,
        "selected_option": req.selected_option,
        "correct_option": drill.correct_option,
        "rule_explanation": drill.rule_explanation
    }
