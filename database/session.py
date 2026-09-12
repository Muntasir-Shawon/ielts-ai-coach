"""
Database Engine and Session Configuration.
Supports PostgreSQL (via DATABASE_URL) with seamless fallback to SQLite.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.models import Base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ielts_coach.db")

# Fix for Heroku/Render postgres:// uri
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
