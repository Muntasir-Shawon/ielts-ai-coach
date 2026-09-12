/**
 * IELTS AI Coach — API Client
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("ielts_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  login: (data: any) => apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data: any) => apiRequest("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  getMe: () => apiRequest("/api/auth/me"),

  // Progress & Recommendations
  getProgress: () => apiRequest("/api/progress"),
  getRecommendations: () => apiRequest("/api/recommendations"),

  // Reading Tests
  getReadingTests: () => apiRequest("/api/tests/reading"),
  getReadingTest: (id: number) => apiRequest(`/api/tests/reading/${id}`),
  submitReadingTest: (data: any) => apiRequest("/api/tests/reading/submit", { method: "POST", body: JSON.stringify(data) }),

  // Listening Tests
  getListeningTests: () => apiRequest("/api/tests/listening"),
  submitListeningTest: (data: any) => apiRequest("/api/tests/listening/submit", { method: "POST", body: JSON.stringify(data) }),

  // Writing
  evaluateWriting: (data: any) => apiRequest("/api/writing/evaluate", { method: "POST", body: JSON.stringify(data) }),
  getWritingHistory: () => apiRequest("/api/writing/history"),

  // Speaking
  startSpeaking: (data: any) => apiRequest("/api/speaking/start", { method: "POST", body: JSON.stringify(data) }),
  answerSpeaking: (data: any) => apiRequest("/api/speaking/answer", { method: "POST", body: JSON.stringify(data) }),
  finishSpeaking: (data: any) => apiRequest("/api/speaking/finish", { method: "POST", body: JSON.stringify(data) }),
  getSpeakingHistory: () => apiRequest("/api/speaking/history"),

  // AI Tutor & QGen
  chatTutor: (data: any) => apiRequest("/api/ai/chat", { method: "POST", body: JSON.stringify(data) }),
  generateQuestion: (data: any) => apiRequest("/api/ai/generate-question", { method: "POST", body: JSON.stringify(data) }),

  // Vocabulary & Grammar
  getVocabulary: (params: string = "") => apiRequest(`/api/vocabulary${params}`),
  masterWord: (id: number) => apiRequest(`/api/vocabulary/${id}/master`, { method: "POST" }),
  getGrammar: (params: string = "") => apiRequest(`/api/grammar${params}`),
  checkGrammar: (data: any) => apiRequest("/api/grammar/check", { method: "POST", body: JSON.stringify(data) }),

  // Questions Bank
  getQuestions: (params: string = "") => apiRequest(`/api/questions${params}`),

  // Admin
  getAdminStats: () => apiRequest("/api/admin/stats"),
};
