"""
IELTS RAG Retriever Module (llm/rag/retriever.py).
Combines vector search over IELTS dataset items with prompt formatting
and grounded context generation.
"""
import os
import sys
from typing import List, Dict, Any, Optional

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(CURRENT_DIR))
sys.path.insert(0, PROJECT_ROOT)

from llm.rag.vector_store import IELTSVectorStore

class IELTSRetriever:
    def __init__(self, vector_store: Optional[IELTSVectorStore] = None):
        self.vector_store = vector_store or IELTSVectorStore()

    def retrieve_context(self, query: str, top_k: int = 3, filter_skill: Optional[str] = None) -> Dict[str, Any]:
        """
        Retrieves relevant IELTS dataset chunks and structures them for LLM injection.
        """
        matches = self.vector_store.search(query, top_k=top_k, filter_skill=filter_skill)

        context_blocks = []
        citations = []

        for idx, item in enumerate(matches, 1):
            doc = item["document"]
            score = item["score"]
            ref_id = doc.get("id", f"REF-{idx}")
            skill = doc.get("skill", "general")
            topic = doc.get("topic", "general")
            q_text = doc.get("question", "")
            explanation = doc.get("explanation", "")
            passage = doc.get("passage_context", "")

            block = f"[Source {idx} | ID: {ref_id} | Skill: {skill} | Topic: {topic} | Score: {score}]\n"
            if passage:
                block += f"Passage Context: {passage[:300]}...\n"
            block += f"Question/Content: {q_text}\n"
            if explanation:
                block += f"Official Answer/Criteria Explanation: {explanation}\n"

            context_blocks.append(block)
            citations.append({
                "id": ref_id,
                "skill": skill,
                "topic": topic,
                "score": score,
                "snippet": q_text[:120]
            })

        formatted_context = "\n---\n".join(context_blocks) if context_blocks else "No direct matching IELTS dataset records found."

        return {
            "formatted_context": formatted_context,
            "citations": citations,
            "num_retrieved": len(matches)
        }

if __name__ == "__main__":
    retriever = IELTSRetriever()
    res = retriever.retrieve_context("How do I improve coherence in Task 2 essays?", top_k=2)
    print("Formatted Context:")
    print(res["formatted_context"])
    print("\nCitations:", res["citations"])
