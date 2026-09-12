"""
Database Initialization and Seeding Script (database/init_db.py).
Creates all 16 tables and populates baseline users, tests, vocabulary, grammar drills,
and structured question banks.
"""
import os
import sys
import json

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
sys.path.insert(0, PROJECT_ROOT)

from database.models import (
    Base, User, Question, ReadingTest, ListeningTest,
    Vocabulary, GrammarQuestion, StudyProgress, StudentScore, Recommendation, Dataset
)
from database.session import engine, SessionLocal
from backend.auth import hash_password

def seed_database():
    print("=" * 70)
    print("INITIALIZING DATABASE TABLES AND SEED DATA")
    print("=" * 70)

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Seed Users (Demo Student & Admin)
    student_email = "student@ielts.com"
    existing_student = db.query(User).filter(User.email == student_email).first()
    if not existing_student:
        student = User(
            email=student_email,
            hashed_password=hash_password("password123"),
            full_name="Muntasir Candidate",
            target_band=7.5,
            exam_type="academic",
            role="student"
        )
        db.add(student)
        db.commit()
        db.refresh(student)

        # Initial study progress & score baseline
        progress = StudyProgress(
            user_id=student.id,
            study_streak_days=3,
            total_tests_completed=4,
            vocabulary_words_learned=18,
            weakest_skill="writing",
            strongest_skill="reading"
        )
        db.add(progress)

        score = StudentScore(
            user_id=student.id,
            reading_band=7.0,
            listening_band=6.5,
            writing_band=5.5,
            speaking_band=6.0,
            overall_band=6.5
        )
        db.add(score)

        rec = Recommendation(
            user_id=student.id,
            skill="writing",
            title="Writing Task 2 Opinion Essay Practice",
            focus_area="Task Response & Structure",
            reason="Your current estimated Writing band is 5.5, which is your primary growth area.",
            action_url="/writing?task=task2"
        )
        db.add(rec)
        db.commit()
        print("Created demo student account: student@ielts.com / password123")

    admin_email = "admin@ielts.com"
    existing_admin = db.query(User).filter(User.email == admin_email).first()
    if not existing_admin:
        admin = User(
            email=admin_email,
            hashed_password=hash_password("admin123"),
            full_name="System Administrator",
            target_band=9.0,
            exam_type="academic",
            role="admin"
        )
        db.add(admin)
        db.commit()
        print("Created demo admin account: admin@ielts.com / admin123")

    # 2. Seed Reading Tests
    reading_json = os.path.join(PROJECT_ROOT, "data", "processed", "clean_ielts_reading_tests.json")
    if os.path.exists(reading_json):
        with open(reading_json, "r", encoding="utf-8") as f:
            tests = json.load(f)
            for t in tests:
                if not db.query(ReadingTest).filter(ReadingTest.title == t.get("title")).first():
                    db.add(ReadingTest(
                        title=t.get("title"),
                        passage=t.get("passage"),
                        topic=t.get("topic", "general"),
                        difficulty=t.get("difficulty", "medium"),
                        questions=t.get("questions", [])
                    ))
            db.commit()
            print("Seeded Reading Tests.")

    # 3. Seed Listening Tests
    listening_json = os.path.join(PROJECT_ROOT, "data", "processed", "clean_ielts_listening_tests.json")
    if os.path.exists(listening_json):
        with open(listening_json, "r", encoding="utf-8") as f:
            ltests = json.load(f)
            for lt in ltests:
                if not db.query(ListeningTest).filter(ListeningTest.title == lt.get("audio_title")).first():
                    db.add(ListeningTest(
                        section=lt.get("section", 1),
                        title=lt.get("audio_title"),
                        audio_url=lt.get("audio_url"),
                        transcript_cue=lt.get("transcript_cue"),
                        topic=lt.get("topic", "general"),
                        questions=lt.get("questions", [])
                    ))
            db.commit()
            print("Seeded Listening Tests.")

    # 4. Seed Vocabulary
    vocab_json = os.path.join(PROJECT_ROOT, "data", "processed", "clean_ielts_vocabulary.json")
    if os.path.exists(vocab_json):
        with open(vocab_json, "r", encoding="utf-8") as f:
            vocab_list = json.load(f)
            for v in vocab_list:
                if not db.query(Vocabulary).filter(Vocabulary.word == v.get("word")).first():
                    db.add(Vocabulary(
                        word=v.get("word"),
                        part_of_speech=v.get("part_of_speech"),
                        band_level=v.get("band_level"),
                        topic=v.get("topic"),
                        definition=v.get("definition"),
                        example_sentence=v.get("example_sentence"),
                        collocations=v.get("collocations", []),
                        synonyms=v.get("synonyms", []),
                        antonyms=v.get("antonyms", [])
                    ))
            db.commit()
            print("Seeded Vocabulary.")

    # 5. Seed Grammar Drills
    grammar_json = os.path.join(PROJECT_ROOT, "data", "processed", "clean_ielts_grammar_drills.json")
    if os.path.exists(grammar_json):
        with open(grammar_json, "r", encoding="utf-8") as f:
            gdrills = json.load(f)
            for g in gdrills:
                if not db.query(GrammarQuestion).filter(GrammarQuestion.question == g.get("question")).first():
                    db.add(GrammarQuestion(
                        category=g.get("category"),
                        difficulty=g.get("difficulty", "medium"),
                        instruction=g.get("instruction"),
                        question=g.get("question"),
                        options=g.get("options", []),
                        correct_option=g.get("correct_option"),
                        rule_explanation=g.get("rule_explanation")
                    ))
            db.commit()
            print("Seeded Grammar Drills.")

    # 6. Seed Structured Questions Bank
    structured_json = os.path.join(PROJECT_ROOT, "data", "processed", "ielts_structured_records.json")
    if os.path.exists(structured_json):
        with open(structured_json, "r", encoding="utf-8") as f:
            records = json.load(f)
            for r in records:
                if not db.query(Question).filter(Question.question_text == r.get("question")).first():
                    db.add(Question(
                        skill=r.get("skill"),
                        question_type=r.get("question_type"),
                        topic=r.get("topic", "general"),
                        difficulty=r.get("difficulty", "medium"),
                        passage_context=r.get("passage_context"),
                        question_text=r.get("question"),
                        options=r.get("options", []),
                        correct_answer=str(r.get("answer")),
                        explanation=str(r.get("explanation")),
                        year=2024
                    ))
            db.commit()
            print("Seeded Structured Question Bank.")

    # 7. Dataset registry entry
    if not db.query(Dataset).first():
        db.add(Dataset(name="IELTS Kaggle Official Test Bank", source="Kaggle IELTS Corpus", record_count=180, version="2.0"))
        db.commit()

    db.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_database()
