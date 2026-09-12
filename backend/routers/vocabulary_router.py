"""
Vocabulary Training Router (backend/routers/vocabulary_router.py).
Provides Academic Word List (AWL) vocabulary, collocations, definitions,
interactive flashcards, and spaced repetition tracking.
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db
from database.models import Vocabulary, User, StudyProgress
from backend.auth import get_current_user

router = APIRouter(prefix="/api/vocabulary", tags=["Vocabulary"])

@router.get("")
def list_vocabulary(
    topic: Optional[str] = None,
    band_level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Vocabulary)
    if topic:
        query = query.filter(Vocabulary.topic.ilike(f"%{topic}%"))
    if band_level:
        query = query.filter(Vocabulary.band_level == band_level)

    words = query.all()
    return [
        {
            "id": w.id,
            "word": w.word,
            "part_of_speech": w.part_of_speech,
            "band_level": w.band_level,
            "topic": w.topic,
            "definition": w.definition,
            "example_sentence": w.example_sentence,
            "collocations": w.collocations,
            "synonyms": w.synonyms,
            "antonyms": w.antonyms
        }
        for w in words
    ]

@router.post("/{word_id}/master")
def mark_word_mastered(
    word_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    word = db.query(Vocabulary).filter(Vocabulary.id == word_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")

    progress = db.query(StudyProgress).filter(StudyProgress.user_id == current_user.id).first()
    if progress:
        progress.vocabulary_words_learned += 1
        db.commit()

    return {
        "success": True,
        "message": f"'{word.word}' marked as mastered in spaced repetition schedule.",
        "total_words_learned": progress.vocabulary_words_learned if progress else 1
    }
