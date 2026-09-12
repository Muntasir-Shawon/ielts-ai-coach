"""
Previous Questions & Practice Items Router (backend/routers/questions_router.py).
Allows filtering by Skill, Topic, Question Type, Difficulty, and Year with licensing disclaimer.
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database.session import get_db
from database.models import Question

router = APIRouter(prefix="/api/questions", tags=["Questions"])

@router.get("")
def get_questions(
    skill: Optional[str] = Query(None, description="Filter by skill: reading, listening, writing, speaking"),
    topic: Optional[str] = Query(None, description="Filter by topic"),
    question_type: Optional[str] = Query(None, description="Filter by question type"),
    difficulty: Optional[str] = Query(None, description="easy, medium, hard"),
    year: Optional[int] = Query(None),
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(Question)
    if skill:
        query = query.filter(Question.skill == skill.lower())
    if topic:
        query = query.filter(Question.topic.ilike(f"%{topic}%"))
    if question_type:
        query = query.filter(Question.question_type == question_type)
    if difficulty:
        query = query.filter(Question.difficulty == difficulty.lower())
    if year:
        query = query.filter(Question.year == year)

    total = query.count()
    items = query.offset(offset).limit(limit).all()

    return {
        "total": total,
        "items": [
            {
                "id": q.id,
                "skill": q.skill,
                "question_type": q.question_type,
                "topic": q.topic,
                "difficulty": q.difficulty,
                "passage_context": q.passage_context,
                "question_text": q.question_text,
                "options": q.options,
                "correct_answer": q.correct_answer,
                "explanation": q.explanation,
                "year": q.year,
                "provenance": q.provenance
            }
            for q in items
        ],
        "disclaimer": "These practice materials are pedagogical simulations designed for IELTS preparation and are not officially endorsed by Cambridge Assessment English or IDP Education."
    }

@router.get("/{question_id}")
def get_question_by_id(question_id: int, db: Session = Depends(get_db)):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        return {"error": "Question not found"}
    return {
        "id": q.id,
        "skill": q.skill,
        "question_type": q.question_type,
        "topic": q.topic,
        "difficulty": q.difficulty,
        "passage_context": q.passage_context,
        "question_text": q.question_text,
        "options": q.options,
        "correct_answer": q.correct_answer,
        "explanation": q.explanation,
        "year": q.year
    }
