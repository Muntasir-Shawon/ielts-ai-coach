"""
IELTS RAG Vector Store & Similarity Search Engine.
Provides persistent vector storage, chunking, indexing, and Top-K retrieval
using scikit-learn TF-IDF dense embeddings + cosine similarity, with modular
support for PyTorch / SentenceTransformers.
"""
import os
import json
import pickle
import numpy as np
from typing import List, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

VECTOR_INDEX_DIR = os.path.dirname(__file__)

class IELTSVectorStore:
    def __init__(self, index_path: Optional[str] = None):
        self.index_path = index_path or os.path.join(VECTOR_INDEX_DIR, "vector_index.pkl")
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=10000, stop_words="english")
        self.documents: List[Dict[str, Any]] = []
        self.matrix = None
        self.is_fitted = False

        if os.path.exists(self.index_path):
            self.load()

    def add_documents(self, docs: List[Dict[str, Any]]):
        """Add structured IELTS documents and fit the vector index."""
        self.documents.extend(docs)
        corpus = [f"{d.get('skill', '')} {d.get('topic', '')} {d.get('question_type', '')} {d.get('question', '')} {d.get('explanation', '')} {d.get('passage_context', '')}" for d in self.documents]
        self.matrix = self.vectorizer.fit_transform(corpus)
        self.is_fitted = True
        self.save()

    def search(self, query: str, top_k: int = 4, filter_skill: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve top-K most relevant IELTS items matching query."""
        if not self.is_fitted or not self.documents:
            return []

        query_vec = self.vectorizer.transform([query])
        scores = cosine_similarity(query_vec, self.matrix)[0]

        # Rank indices
        ranked_indices = np.argsort(scores)[::-1]
        results = []

        for idx in ranked_indices:
            doc = self.documents[idx]
            score = float(scores[idx])
            if filter_skill and doc.get("skill") != filter_skill:
                continue
            if score > 0.01: # relevance threshold
                results.append({
                    "score": round(score, 4),
                    "document": doc
                })
            if len(results) >= top_k:
                break

        # Fallback to top matches if scores were low
        if not results and len(self.documents) > 0:
            for idx in ranked_indices[:top_k]:
                results.append({
                    "score": round(float(scores[idx]), 4),
                    "document": self.documents[idx]
                })

        return results

    def save(self):
        with open(self.index_path, "wb") as f:
            pickle.dump({
                "vectorizer": self.vectorizer,
                "documents": self.documents,
                "matrix": self.matrix,
                "is_fitted": self.is_fitted
            }, f)

    def load(self):
        try:
            with open(self.index_path, "rb") as f:
                data = pickle.load(f)
                self.vectorizer = data["vectorizer"]
                self.documents = data["documents"]
                self.matrix = data["matrix"]
                self.is_fitted = data["is_fitted"]
        except Exception as e:
            print(f"Notice: Could not load vector index ({e}), starting fresh.")
