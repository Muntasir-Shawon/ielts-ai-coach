"""
RAG Vector Store and Retriever Unit Tests (tests/test_rag.py).
"""
import os
import sys
import pytest

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
sys.path.insert(0, PROJECT_ROOT)

from llm.rag.vector_store import IELTSVectorStore
from llm.rag.retriever import IELTSRetriever

def test_vector_store_retrieval():
    vs = IELTSVectorStore()
    results = vs.search("environmental problems and pollution solutions", top_k=2)

    assert len(results) > 0
    assert "score" in results[0]
    assert "document" in results[0]

def test_rag_retriever():
    retriever = IELTSRetriever()
    res = retriever.retrieve_context("How to structure IELTS Task 2 discussion essay?", top_k=2)

    assert "formatted_context" in res
    assert "citations" in res
    assert res["num_retrieved"] > 0
