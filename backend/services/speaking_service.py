"""
Speaking Examination Service (backend/services/speaking_service.py).
Conducts full 3-part voice speaking exam simulations, tracks turn-by-turn dialogue,
and computes final multi-criteria diagnostic evaluations.
"""
import os
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from database.models import SpeakingSession, SpeakingTranscript, User, StudentScore, StudyProgress
from speaking.speech_analysis.analyzer import SpeakingAnalyzer
from speaking.speech_to_text.stt_handler import SpeechToTextHandler
from speaking.text_to_speech.tts_handler import TextToSpeechHandler
from llm.llm_client import LLMClient

class SpeakingService:
    def __init__(self):
        self.analyzer = SpeakingAnalyzer()
        self.stt = SpeechToTextHandler()
        self.tts = TextToSpeechHandler()
        self.llm = LLMClient()

    def start_session(self, db: Session, user: User, topic: str = "Technology & Environment") -> Dict[str, Any]:
        session = SpeakingSession(
            user_id=user.id,
            topic=topic,
            current_part=1,
            status="in_progress"
        )
        db.add(session)
        db.commit()
        db.refresh(session)

        # Initial examiner opening
        initial_question = "Good morning. My name is Dr. Harrison and I will be your IELTS speaking examiner today. To begin with, could you tell me a little about where you live and what you like most about your neighborhood?"

        first_transcript = SpeakingTranscript(
            session_id=session.id,
            part=1,
            examiner_question=initial_question,
            candidate_transcript="",
            duration_sec=0.0
        )
        db.add(first_transcript)
        db.commit()

        tts_info = self.tts.synthesize(initial_question)

        return {
            "session_id": session.id,
            "current_part": 1,
            "examiner_question": initial_question,
            "tts": tts_info,
            "instruction": "Part 1: Answer naturally in 2 to 4 sentences."
        }

    def process_turn(
        self,
        db: Session,
        session_id: int,
        student_transcript: str,
        duration_sec: float = 15.0,
        part: int = 1
    ) -> Dict[str, Any]:
        session = db.query(SpeakingSession).filter(SpeakingSession.id == session_id).first()
        if not session:
            raise ValueError("Session not found")

        # Update the pending transcript turn
        last_turn = db.query(SpeakingTranscript).filter(
            SpeakingTranscript.session_id == session_id
        ).order_by(SpeakingTranscript.id.desc()).first()

        if last_turn:
            last_turn.candidate_transcript = student_transcript.strip()
            last_turn.duration_sec = duration_sec
            last_turn.part = part
            words = len(student_transcript.split())
            last_turn.words_per_minute = round((words / max(1.0, duration_sec)) * 60.0, 1)

        session.total_duration_sec += duration_sec

        # Determine next question and test progression
        turn_count = db.query(SpeakingTranscript).filter(SpeakingTranscript.session_id == session_id).count()

        if turn_count < 4:
            # Continue Part 1
            next_part = 1
            part_1_pool = [
                "How often do you use digital devices for your studies or daily work?",
                "Do you prefer living in a quiet rural area or a vibrant metropolitan city, and why?",
                "Has the way people communicate changed much in your country over the past decade?"
            ]
            next_q = part_1_pool[(turn_count - 1) % len(part_1_pool)]
            instruction = "Part 1: Answer concisely and naturally."
        elif turn_count == 4:
            # Transition to Part 2 Long Turn
            next_part = 2
            session.current_part = 2
            next_q = (
                "Thank you. Now, let's move on to Part 2 of the test. I am going to give you a cue card. "
                "You will have one minute to prepare your notes, and then you should speak for one to two minutes.\n\n"
                "Cue Card: Describe a technological innovation that has significantly impacted society.\n"
                "- What the technology is\n"
                "- When it became widely adopted\n"
                "- How people use it in their daily lives\n"
                "- And explain whether its overall influence has been positive or negative."
            )
            instruction = "Part 2: You have 1 minute to plan, then speak continuously for up to 2 minutes."
        elif turn_count == 5:
            # Transition to Part 3 Two-Way Discussion
            next_part = 3
            session.current_part = 3
            next_q = "Thank you. Now, let's discuss some broader questions related to technology. Do you believe that increasing automation in the workplace will lead to widespread unemployment, or will it create higher-value jobs?"
            instruction = "Part 3: Provide in-depth analytical arguments and justify your views."
        elif turn_count == 6:
            next_part = 3
            next_q = "Some sociologists argue that digital interaction is eroding genuine human empathy. To what extent do you agree with this concern?"
            instruction = "Part 3: Give structured opinions with examples."
        else:
            # Conclude examination
            return self.finish_session(db, session_id)

        next_transcript = SpeakingTranscript(
            session_id=session.id,
            part=next_part,
            examiner_question=next_q,
            candidate_transcript="",
            duration_sec=0.0
        )
        db.add(next_transcript)
        db.commit()

        tts_info = self.tts.synthesize(next_q)

        return {
            "session_id": session.id,
            "current_part": next_part,
            "examiner_question": next_q,
            "tts": tts_info,
            "instruction": instruction,
            "turns_completed": turn_count,
            "is_finished": False
        }

    def finish_session(self, db: Session, session_id: int) -> Dict[str, Any]:
        session = db.query(SpeakingSession).filter(SpeakingSession.id == session_id).first()
        if not session:
            raise ValueError("Session not found")

        transcripts = db.query(SpeakingTranscript).filter(
            SpeakingTranscript.session_id == session_id,
            SpeakingTranscript.candidate_transcript != ""
        ).all()

        turn_dicts = [
            {
                "part": t.part,
                "question": t.examiner_question,
                "response_text": t.candidate_transcript,
                "duration_sec": t.duration_sec
            }
            for t in transcripts
        ]

        analysis = self.analyzer.analyze_session(turn_dicts)

        session.status = "completed"
        session.fluency_score = analysis["fluency"]
        session.lexical_score = analysis["lexical_resource"]
        session.grammar_score = analysis["grammar"]
        session.pronunciation_score = analysis["pronunciation"]
        session.estimated_band = analysis["estimated_band"]
        session.strengths = analysis["strengths"]
        session.weaknesses = analysis["weaknesses"]

        # Update student score
        latest_score = db.query(StudentScore).filter(StudentScore.user_id == session.user_id).order_by(StudentScore.recorded_at.desc()).first()
        if latest_score:
            latest_score.speaking_band = analysis["estimated_band"]
            latest_score.overall_band = round(((latest_score.reading_band + latest_score.listening_band + latest_score.writing_band + analysis["estimated_band"]) / 4.0) * 2) / 2.0

        progress = db.query(StudyProgress).filter(StudyProgress.user_id == session.user_id).first()
        if progress:
            progress.total_tests_completed += 1

        db.commit()

        return {
            "session_id": session.id,
            "is_finished": True,
            "evaluation": analysis,
            "transcripts": [
                {
                    "part": t.part,
                    "examiner_question": t.examiner_question,
                    "candidate_transcript": t.candidate_transcript,
                    "wpm": t.words_per_minute
                }
                for t in transcripts
            ]
        }
