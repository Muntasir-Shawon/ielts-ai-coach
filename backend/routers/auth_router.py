"""
Authentication Endpoints (backend/routers/auth_router.py).
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from database.session import get_db
from database.models import User, StudyProgress, StudentScore
from backend.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    target_band: float = 7.5
    exam_type: str = "academic"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=req.email,
        hashed_password=hash_password(req.password),
        full_name=req.full_name,
        target_band=req.target_band,
        exam_type=req.exam_type,
        role="student"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create initial progress & score baseline
    progress = StudyProgress(user_id=user.id, study_streak_days=1, total_tests_completed=0, vocabulary_words_learned=0)
    scores = StudentScore(user_id=user.id, reading_band=6.0, listening_band=6.0, writing_band=6.0, speaking_band=6.0, overall_band=6.0)
    db.add(progress)
    db.add(scores)
    db.commit()

    token = create_access_token({"sub": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "target_band": user.target_band,
            "exam_type": user.exam_type,
            "role": user.role
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token({"sub": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "target_band": user.target_band,
            "exam_type": user.exam_type,
            "role": user.role
        }
    }

@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "target_band": user.target_band,
        "exam_type": user.exam_type,
        "role": user.role,
        "created_at": user.created_at
    }
