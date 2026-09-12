"""
SQLAlchemy Database Models for IELTS AI Coach (Section 19 Compliance).
Defines all 16 relational tables for users, tests, questions, submissions,
speaking sessions, transcripts, recommendations, and analytics.
"""
import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    target_band = Column(Float, default=7.5)
    exam_type = Column(String(50), default="academic") # academic | general
    role = Column(String(50), default="student") # student | admin
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    submissions = relationship("WritingSubmission", back_populates="user")
    speaking_sessions = relationship("SpeakingSession", back_populates="user")
    test_attempts = relationship("TestAttempt", back_populates="user")
    progress = relationship("StudyProgress", back_populates="user", uselist=False)

class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    source = Column(String(255), default="Kaggle")
    record_count = Column(Integer, default=0)
    version = Column(String(50), default="1.0")
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    skill = Column(String(50), index=True, nullable=False) # reading, listening, writing, speaking
    question_type = Column(String(100), index=True, nullable=False) # multiple_choice, true_false, etc.
    topic = Column(String(100), index=True, nullable=False)
    difficulty = Column(String(50), default="medium") # easy, medium, hard
    passage_context = Column(Text, nullable=True)
    question_text = Column(Text, nullable=False)
    options = Column(JSON, default=list)
    correct_answer = Column(Text, nullable=True)
    explanation = Column(Text, nullable=True)
    year = Column(Integer, default=2024)
    provenance = Column(String(255), default="IELTS Practice Question Bank")

class ReadingTest(Base):
    __tablename__ = "reading_tests"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    passage = Column(Text, nullable=False)
    topic = Column(String(100), nullable=False)
    difficulty = Column(String(50), default="medium")
    questions = Column(JSON, default=list) # serialized question items
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ListeningTest(Base):
    __tablename__ = "listening_tests"
    id = Column(Integer, primary_key=True, index=True)
    section = Column(Integer, default=1)
    title = Column(String(255), nullable=False)
    audio_url = Column(String(500), nullable=True)
    transcript_cue = Column(Text, nullable=True)
    topic = Column(String(100), nullable=False)
    questions = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class WritingSubmission(Base):
    __tablename__ = "writing_submissions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    task = Column(String(50), default="Task 2")
    prompt = Column(Text, nullable=False)
    essay_text = Column(Text, nullable=False)
    word_count = Column(Integer, default=0)
    estimated_band = Column(Float, default=6.0)
    task_response_score = Column(Float, default=6.0)
    coherence_score = Column(Float, default=6.0)
    lexical_score = Column(Float, default=6.0)
    grammar_score = Column(Float, default=6.0)
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    grammar_corrections = Column(JSON, default=list)
    vocabulary_improvements = Column(JSON, default=list)
    structure_feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="submissions")

class SpeakingSession(Base):
    __tablename__ = "speaking_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic = Column(String(255), default="General & Technology")
    current_part = Column(Integer, default=1)
    total_duration_sec = Column(Float, default=0.0)
    fluency_score = Column(Float, default=6.0)
    lexical_score = Column(Float, default=6.0)
    grammar_score = Column(Float, default=6.0)
    pronunciation_score = Column(Float, default=6.0)
    estimated_band = Column(Float, default=6.0)
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    status = Column(String(50), default="in_progress") # in_progress, completed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="speaking_sessions")
    transcripts = relationship("SpeakingTranscript", back_populates="session")

class SpeakingTranscript(Base):
    __tablename__ = "speaking_transcripts"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("speaking_sessions.id"), nullable=False)
    part = Column(Integer, default=1)
    examiner_question = Column(Text, nullable=False)
    candidate_transcript = Column(Text, nullable=True)
    audio_path = Column(String(500), nullable=True)
    duration_sec = Column(Float, default=0.0)
    words_per_minute = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("SpeakingSession", back_populates="transcripts")

class TestAttempt(Base):
    __tablename__ = "test_attempts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill = Column(String(50), nullable=False) # reading, listening, writing, speaking, mock_full
    test_identifier = Column(String(100), nullable=True)
    score = Column(Float, default=0.0)
    total_questions = Column(Integer, default=0)
    correct_count = Column(Integer, default=0)
    estimated_band = Column(Float, default=6.0)
    time_taken_seconds = Column(Integer, default=0)
    answers = Column(JSON, default=dict)
    weak_question_types = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="test_attempts")

class StudentScore(Base):
    __tablename__ = "student_scores"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reading_band = Column(Float, default=6.0)
    listening_band = Column(Float, default=6.0)
    writing_band = Column(Float, default=6.0)
    speaking_band = Column(Float, default=6.0)
    overall_band = Column(Float, default=6.0)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)

class Vocabulary(Base):
    __tablename__ = "vocabulary"
    id = Column(Integer, primary_key=True, index=True)
    word = Column(String(100), unique=True, index=True, nullable=False)
    part_of_speech = Column(String(50), default="adjective")
    band_level = Column(String(50), default="Band 7-8")
    topic = Column(String(100), default="general")
    definition = Column(Text, nullable=False)
    example_sentence = Column(Text, nullable=False)
    collocations = Column(JSON, default=list)
    synonyms = Column(JSON, default=list)
    antonyms = Column(JSON, default=list)

class GrammarQuestion(Base):
    __tablename__ = "grammar_questions"
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), index=True, nullable=False)
    difficulty = Column(String(50), default="medium")
    instruction = Column(Text, nullable=False)
    question = Column(Text, nullable=False)
    options = Column(JSON, default=list)
    correct_option = Column(String(10), nullable=False)
    rule_explanation = Column(Text, nullable=False)

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    focus_area = Column(String(255), nullable=False)
    reason = Column(Text, nullable=False)
    action_url = Column(String(255), nullable=False)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class StudyProgress(Base):
    __tablename__ = "study_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    study_streak_days = Column(Integer, default=1)
    total_tests_completed = Column(Integer, default=0)
    vocabulary_words_learned = Column(Integer, default=0)
    weakest_skill = Column(String(50), default="writing")
    strongest_skill = Column(String(50), default="reading")
    last_active = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="progress")

class AIFeedback(Base):
    __tablename__ = "ai_feedback"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    feature = Column(String(100), nullable=False) # writing_eval, speaking_eval, tutor_chat
    prompt_text = Column(Text, nullable=True)
    ai_response = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SystemLog(Base):
    __tablename__ = "system_logs"
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(100), nullable=False)
    details = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
