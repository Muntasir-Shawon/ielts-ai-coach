import React, { useState, useEffect } from "react";
import { Database, Filter, Search, BookOpen, AlertTriangle } from "lucide-react";
import { api } from "../api";

export const PracticeBankPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [skill, setSkill] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [skill, topic, difficulty]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (skill) params.append("skill", skill);
      if (topic) params.append("topic", topic);
      if (difficulty) params.append("difficulty", difficulty);

      const qs = params.toString() ? `?${params.toString()}` : "";
      const res = await api.getQuestions(qs);
      setQuestions(res.items || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Error loading questions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Previous Questions & Practice Items</h2>
            <p className="text-xs text-slate-400">
              Explore authentic IELTS question formats with filtering by skill, topic, and difficulty
            </p>
          </div>
        </div>

        <span className="text-xs bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl text-slate-300">
          Showing {questions.length} of {total} Questions
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center gap-3">
        {/* Skill Filter */}
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
        >
          <option value="">All Skills</option>
          <option value="reading">Reading</option>
          <option value="listening">Listening</option>
          <option value="writing">Writing</option>
          <option value="speaking">Speaking</option>
        </select>

        {/* Difficulty Filter */}
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Topic Input */}
        <input
          type="text"
          placeholder="Filter by topic (e.g., environment, technology)..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none flex-1 min-w-[200px]"
        />

        {(skill || topic || difficulty) && (
          <button
            onClick={() => {
              setSkill("");
              setTopic("");
              setDifficulty("");
            }}
            className="text-xs text-rose-400 hover:underline px-2"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Warning / Provenance Notice (Section 15) */}
      <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl text-xs text-slate-400 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-300">Notice on Test Provenance:</strong> The items in this question bank are educational simulations curated from open Kaggle datasets and practice corpora. They are not official past papers endorsed by Cambridge or IDP.
        </span>
      </div>

      {/* Questions Cards */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded border border-indigo-500/30">
                  {q.skill}
                </span>
                <span className="text-[10px] uppercase font-semibold bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                  {q.question_type.replace("_", " ")}
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-500">
                  Difficulty: {q.difficulty}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 capitalize">Topic: {q.topic}</span>
            </div>

            {q.passage_context && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 font-serif line-clamp-3">
                {q.passage_context}
              </div>
            )}

            <h3 className="text-sm font-bold text-white leading-relaxed">{q.question_text}</h3>

            {q.options && q.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt: string, i: number) => (
                  <div key={i} className="text-xs bg-slate-950/70 border border-slate-800/80 px-3 py-2 rounded-lg text-slate-300">
                    {opt}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-400">
                Official Key: <strong className="text-emerald-400">{q.correct_answer}</strong>
              </span>
              <span className="text-slate-500 italic text-[11px]">{q.explanation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
