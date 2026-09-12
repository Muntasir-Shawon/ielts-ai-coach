"""
IELTS Reading & Listening Test Scoring Service (backend/services/test_service.py).
Evaluates student responses against question keys, converts raw scores to IELTS bands,
identifies weak question types, and registers test attempts.
"""
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from database.models import ReadingTest, ListeningTest, TestAttempt, User, StudentScore, StudyProgress

class TestService:
    @staticmethod
    def raw_score_to_ielts_band(correct_count: int, total_questions: int) -> float:
        """Standard IELTS Academic band conversion scale."""
        if total_questions == 0:
            return 5.0
        ratio = correct_count / total_questions
        if ratio >= 0.95:
            return 9.0
        elif ratio >= 0.88:
            return 8.5
        elif ratio >= 0.82:
            return 8.0
        elif ratio >= 0.75:
            return 7.5
        elif ratio >= 0.68:
            return 7.0
        elif ratio >= 0.58:
            return 6.5
        elif ratio >= 0.48:
            return 6.0
        elif ratio >= 0.38:
            return 5.5
        elif ratio >= 0.28:
            return 5.0
        return 4.5

    def evaluate_reading_attempt(
        self,
        db: Session,
        user: User,
        test_id: int,
        student_answers: Dict[str, str],
        time_taken_seconds: int = 1200
    ) -> Dict[str, Any]:
        test = db.query(ReadingTest).filter(ReadingTest.id == test_id).first()
        if not test:
            raise ValueError("Reading test not found")

        questions = test.questions or []
        correct_count = 0
        feedback_items = []
        weak_types = set()

        for q in questions:
            qid = q.get("question_id")
            qtype = q.get("question_type", "multiple_choice")
            correct_ans = str(q.get("answer", "")).strip().upper()
            user_ans = str(student_answers.get(qid, "")).strip().upper()

            is_correct = (user_ans == correct_ans)
            if is_correct:
                correct_count += 1
            else:
                weak_types.add(qtype)

            feedback_items.append({
                "question_id": qid,
                "question": q.get("question"),
                "student_answer": user_ans,
                "correct_answer": correct_ans,
                "is_correct": is_correct,
                "explanation": q.get("explanation", "")
            })

        total_q = len(questions)
        band = self.raw_score_to_ielts_band(correct_count, total_q)
        accuracy = round((correct_count / max(1, total_q)) * 100, 1)

        attempt = TestAttempt(
            user_id=user.id,
            skill="reading",
            test_identifier=f"READING-{test.id}",
            score=accuracy,
            total_questions=total_q,
            correct_count=correct_count,
            estimated_band=band,
            time_taken_seconds=time_taken_seconds,
            answers=student_answers,
            weak_question_types=list(weak_types)
        )
        db.add(attempt)

        # Update scores
        latest_score = db.query(StudentScore).filter(StudentScore.user_id == user.id).order_by(StudentScore.recorded_at.desc()).first()
        if latest_score:
            latest_score.reading_band = band
            latest_score.overall_band = round(((band + latest_score.listening_band + latest_score.writing_band + latest_score.speaking_band) / 4.0) * 2) / 2.0

        progress = db.query(StudyProgress).filter(StudyProgress.user_id == user.id).first()
        if progress:
            progress.total_tests_completed += 1

        db.commit()

        return {
            "test_id": test.id,
            "title": test.title,
            "correct_count": correct_count,
            "total_questions": total_q,
            "accuracy_percent": accuracy,
            "estimated_band": band,
            "weak_question_types": list(weak_types),
            "questions_feedback": feedback_items
        }

    def evaluate_listening_attempt(
        self,
        db: Session,
        user: User,
        test_id: int,
        student_answers: Dict[str, str],
        time_taken_seconds: int = 900
    ) -> Dict[str, Any]:
        test = db.query(ListeningTest).filter(ListeningTest.id == test_id).first()
        if not test:
            raise ValueError("Listening test not found")

        questions = test.questions or []
        correct_count = 0
        feedback_items = []
        weak_types = set()

        for q in questions:
            qid = q.get("question_id")
            qtype = q.get("question_type", "multiple_choice")
            correct_ans = str(q.get("answer", "")).strip().lower()
            user_ans = str(student_answers.get(qid, "")).strip().lower()

            is_correct = (user_ans == correct_ans)
            if is_correct:
                correct_count += 1
            else:
                weak_types.add(qtype)

            feedback_items.append({
                "question_id": qid,
                "question": q.get("question"),
                "student_answer": user_ans,
                "correct_answer": correct_ans,
                "is_correct": is_correct,
                "explanation": q.get("explanation", "")
            })

        total_q = len(questions)
        band = self.raw_score_to_ielts_band(correct_count, total_q)
        accuracy = round((correct_count / max(1, total_q)) * 100, 1)

        attempt = TestAttempt(
            user_id=user.id,
            skill="listening",
            test_identifier=f"LISTENING-{test.id}",
            score=accuracy,
            total_questions=total_q,
            correct_count=correct_count,
            estimated_band=band,
            time_taken_seconds=time_taken_seconds,
            answers=student_answers,
            weak_question_types=list(weak_types)
        )
        db.add(attempt)

        latest_score = db.query(StudentScore).filter(StudentScore.user_id == user.id).order_by(StudentScore.recorded_at.desc()).first()
        if latest_score:
            latest_score.listening_band = band
            latest_score.overall_band = round(((latest_score.reading_band + band + latest_score.writing_band + latest_score.speaking_band) / 4.0) * 2) / 2.0

        progress = db.query(StudyProgress).filter(StudyProgress.user_id == user.id).first()
        if progress:
            progress.total_tests_completed += 1

        db.commit()

        return {
            "test_id": test.id,
            "title": test.title,
            "correct_count": correct_count,
            "total_questions": total_q,
            "accuracy_percent": accuracy,
            "estimated_band": band,
            "weak_question_types": list(weak_types),
            "questions_feedback": feedback_items
        }
