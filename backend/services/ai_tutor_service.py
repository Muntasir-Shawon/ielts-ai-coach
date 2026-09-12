"""
AI Tutor and Question Generation Service (backend/services/ai_tutor_service.py).
Integrates Vector RAG Retrieval and LLM Generation for conversational coaching
and authentic IELTS question synthesis.
"""
import os
import json
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from database.models import AIFeedback, User
from llm.rag.retriever import IELTSRetriever
from llm.llm_client import LLMClient

PROMPTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "llm", "prompts")

class AITutorService:
    def __init__(self):
        self.retriever = IELTSRetriever()
        self.llm = LLMClient()

        tutor_prompt_path = os.path.join(PROMPTS_DIR, "ai_tutor.txt")
        if os.path.exists(tutor_prompt_path):
            with open(tutor_prompt_path, "r", encoding="utf-8") as f:
                self.tutor_system_prompt = f.read()
        else:
            self.tutor_system_prompt = "You are the IELTS AI Coach tutor."

        qgen_prompt_path = os.path.join(PROMPTS_DIR, "question_generator.txt")
        if os.path.exists(qgen_prompt_path):
            with open(qgen_prompt_path, "r", encoding="utf-8") as f:
                self.qgen_system_prompt = f.read()
        else:
            self.qgen_system_prompt = "You are an IELTS exam content developer."

    def ask_tutor(self, db: Session, user: User, question: str, skill: Optional[str] = None) -> Dict[str, Any]:
        # 1. RAG Retrieval step
        rag_result = self.retriever.retrieve_context(question, top_k=3, filter_skill=skill)

        # 2. LLM generation with retrieved context
        ai_reply = self.llm.generate(
            system_prompt=self.tutor_system_prompt,
            user_prompt=question,
            context=rag_result["formatted_context"]
        )

        # 3. Log interaction
        feedback = AIFeedback(
            user_id=user.id,
            feature="tutor_chat",
            prompt_text=question,
            ai_response=ai_reply
        )
        db.add(feedback)
        db.commit()

        return {
            "reply": ai_reply,
            "citations": rag_result["citations"],
            "grounded_sources_count": rag_result["num_retrieved"]
        }

    def generate_practice_question(self, skill: str, topic: str, difficulty: str, question_type: str) -> Dict[str, Any]:
        # Retrieve exemplars from dataset
        query = f"{skill} {topic} {question_type} {difficulty}"
        rag_result = self.retriever.retrieve_context(query, top_k=2, filter_skill=skill)

        user_prompt = f"Generate 1 new IELTS practice question for:\nSkill: {skill}\nTopic: {topic}\nDifficulty: {difficulty}\nQuestion Type: {question_type}"
        raw_res = self.llm.generate(
            system_prompt=self.qgen_system_prompt,
            user_prompt=user_prompt,
            context=rag_result["formatted_context"]
        )

        try:
            clean = raw_res.strip()
            if "```json" in clean:
                clean = clean.split("```json")[1].split("```")[0].strip()
            elif "```" in clean:
                clean = clean.split("```")[1].split("```")[0].strip()
            q_data = json.loads(clean)
        except Exception:
            q_data = {
                "skill": skill,
                "topic": topic,
                "difficulty": difficulty,
                "question_type": question_type,
                "question": f"Discuss the implications of {topic} on contemporary educational outcomes.",
                "options": ["A. Substantial benefit", "B. Marginal increase", "C. Minimal consequence", "D. Neutral impact"],
                "answer": "A",
                "explanation": "Evidence indicates notable advantages when implemented systematically."
            }

        return q_data
