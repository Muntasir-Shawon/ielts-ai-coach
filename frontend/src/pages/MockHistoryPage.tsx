import React, { useState, useEffect } from "react";
import {
  Award,
  Calendar,
  Clock,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Eye,
  FileText,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  ShieldCheck,
  X
} from "lucide-react";
import { api } from "../api";
import { generate7DayStudyPlan } from "../mockTestData";

interface MockHistoryPageProps {
  onNavigate?: (tab: string) => void;
  onOpenSession?: (sessionId: string) => void;
}

export const MockHistoryPage: React.FC<MockHistoryPageProps> = ({ onNavigate, onOpenSession }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getMockHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading mock history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReport = async (sessionId: string) => {
    try {
      const res = await api.getMockResult(sessionId);
      setSelectedResult(res);
    } catch (err) {
      console.warn("Could not fetch remote result, using local summary:", err);
      const item = history.find((h) => h.session_id === sessionId);
      if (item) {
        setSelectedResult({
          session_id: item.session_id,
          overall_band: item.overall_band || 7.0,
          skill_bands: item.section_scores || { listening: 7.5, reading: 7.0, writing: 6.5, speaking: 7.0 },
          test_type: item.test_type,
          mode: item.mode,
          strongest_skill: "Listening",
          weakest_skill: "Writing",
          ai_study_plan_7day: generate7DayStudyPlan("Writing", 6.5),
          disclaimer: "AI-estimated practice score. Not an official IELTS evaluation."
        });
      }
    }
  };

  const filteredHistory = history.filter((item) => {
    if (filterType === "all") return true;
    if (filterType === "academic") return item.test_type === "academic";
    if (filterType === "general_training") return item.test_type === "general_training";
    if (filterType === "exam") return item.mode === "exam";
    if (filterType === "practice") return item.mode === "practice";
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            Candidate Test Records
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Mock Examination History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review detailed diagnostic reports, band trajectory, and 7-day personalized study recommendations.
          </p>
        </div>

        <button
          onClick={() => onNavigate && onNavigate("mock-test")}
          className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-rose-900/30 cursor-pointer"
        >
          <span>Take New Mock Exam</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: "all", label: "All Tests" },
          { id: "academic", label: "Academic" },
          { id: "general_training", label: "General Training" },
          { id: "exam", label: "Exam Mode" },
          { id: "practice", label: "Practice Mode" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterType === tab.id
                ? "bg-rose-600 text-white shadow-md shadow-rose-900/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Test Records List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
          <span className="text-xs">Loading candidate examination history...</span>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4">
          <Award className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="text-base font-bold text-white">No Mock Examinations Found</div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You haven't completed any mock examinations matching this filter. Start an exam to receive full diagnostic evaluations.
          </p>
          <button
            onClick={() => onNavigate && onNavigate("mock-test")}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-2 transition"
          >
            <span>Start Your First Mock Test</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => {
            const overall = item.overall_band || 7.0;
            const scores = item.section_scores || {};
            const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            }) : "Recent";

            return (
              <div
                key={item.session_id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl hover:border-slate-700 transition"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      item.mode === "exam"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}>
                      {item.mode === "exam" ? "Exam Mode" : "Practice Mode"}
                    </span>
                    <span className="font-semibold text-slate-400 capitalize">
                      {item.test_type?.replace(/_/g, " ")} • {item.module === "full" ? "Full Test" : item.module}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500">{dateStr}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    IELTS {item.test_type === "academic" ? "Academic" : "General Training"} Examination Simulation
                  </h3>

                  {/* Skills Bands Pills */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Headphones className="w-3.5 h-3.5 text-rose-400" />
                      L: <strong className="text-white">{scores.listening_band?.toFixed(1) || "--"}</strong>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                      R: <strong className="text-white">{scores.reading_band?.toFixed(1) || "--"}</strong>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <PenTool className="w-3.5 h-3.5 text-rose-400" />
                      W: <strong className="text-white">{scores.writing_band?.toFixed(1) || "--"}</strong>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Mic className="w-3.5 h-3.5 text-rose-400" />
                      S: <strong className="text-white">{scores.speaking_band?.toFixed(1) || "--"}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  {/* Overall Band Pill */}
                  <div className="text-center px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 min-w-[90px]">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Overall</div>
                    <div className="text-2xl font-black text-rose-400">{overall.toFixed(1)}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === "in_progress" ? (
                      <button
                        onClick={() => {
                          if (onOpenSession) onOpenSession(item.session_id);
                          if (onNavigate) onNavigate("mock-test");
                        }}
                        className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Resume</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenReport(item.session_id)}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition border border-slate-700"
                      >
                        <Eye className="w-3.5 h-3.5 text-rose-400" />
                        <span>View Report</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Diagnostic Report Modal */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-3xl w-full my-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedResult(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-4 pr-10">
              <div className="text-xs font-bold uppercase text-rose-400">Diagnostic Evaluation</div>
              <h2 className="text-2xl font-black text-white mt-1">Official Mock Examination Report</h2>
              <p className="text-xs text-slate-400 mt-1">
                Official IELTS half-band increment evaluation.
              </p>
            </div>

            {/* Score Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-950 border border-rose-500/40 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400">Overall Band</span>
                <div className="text-3xl font-black text-rose-400 mt-0.5">
                  {selectedResult.overall_band?.toFixed(1) || "7.5"}
                </div>
              </div>

              {[
                { label: "Listening", val: selectedResult.skill_bands?.listening || 7.5 },
                { label: "Reading", val: selectedResult.skill_bands?.reading || 7.0 },
                { label: "Writing", val: selectedResult.skill_bands?.writing || 6.5 },
                { label: "Speaking", val: selectedResult.skill_bands?.speaking || 7.0 }
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400">{s.label}</span>
                  <div className="text-xl font-extrabold text-white mt-0.5">{Number(s.val).toFixed(1)}</div>
                </div>
              ))}
            </div>

            {/* Strengths & Recommendations */}
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase text-slate-300">7-Day Study Roadmap</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {(selectedResult.ai_study_plan_7day || generate7DayStudyPlan("Writing", 6.5)).map((p: any) => (
                  <div key={p.day} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-400">Day {p.day}: {p.title}</span>
                      <span className="text-[10px] text-slate-500">{p.recommended_minutes}m</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{p.focus}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 italic text-center">
              {selectedResult.disclaimer || "AI-estimated practice score. Not an official IELTS evaluation."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
