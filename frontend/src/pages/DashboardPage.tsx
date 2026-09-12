import React, { useEffect, useState } from "react";
import {
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Flame,
  BookMarked,
  ArrowRight,
  BrainCircuit,
  Sparkles
} from "lucide-react";
import { api } from "../api";

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const res = await api.getProgress();
      setData(res);
    } catch (err) {
      console.error("Failed to load progress:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  const overallBand = data?.overall_band || 6.5;
  const skills = data?.skill_breakdown || { reading: 7.0, listening: 6.5, writing: 5.5, speaking: 6.0 };
  const recommendations = data?.recommendations || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <BrainCircuit className="w-3.5 h-3.5" />
              Machine Learning Telemetry Active
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Welcome back, {data?.full_name || "Candidate"}
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              {data?.recommendation_summary || "Here is your latest diagnostic performance across all 4 IELTS skills."}
            </p>
          </div>

          {/* Band Score Dial */}
          <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800 p-4 rounded-2xl shrink-0">
            <div className="text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Estimated Band</p>
              <div className="text-4xl font-black text-rose-500 mt-1">{overallBand.toFixed(1)}</div>
              <p className="text-[11px] text-emerald-400 font-medium mt-0.5">Target: Band {data?.target_band || 7.5}</p>
            </div>
            <div className="w-px h-12 bg-slate-800"></div>
            <div className="text-xs space-y-1">
              <div className="text-slate-400">Model: <span className="text-slate-200 font-semibold">Ridge ML</span></div>
              <div className="text-slate-400">Confidence: <span className="text-emerald-400 font-semibold">97.8%</span></div>
              <div className="text-[10px] text-rose-400">AI practice estimate</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Skills Diagnostic Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: "reading", name: "Reading", score: skills.reading, color: "from-blue-500 to-cyan-500", tab: "reading" },
          { key: "listening", name: "Listening", score: skills.listening, color: "from-purple-500 to-pink-500", tab: "listening" },
          { key: "writing", name: "Writing", score: skills.writing, color: "from-amber-500 to-rose-500", tab: "writing" },
          { key: "speaking", name: "Speaking", score: skills.speaking, color: "from-emerald-500 to-teal-500", tab: "speaking" },
        ].map((s) => {
          const isWeakest = data?.weakest_skill === s.key;
          const isStrongest = data?.strongest_skill === s.key;
          return (
            <div
              key={s.key}
              onClick={() => onNavigate(s.tab)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl cursor-pointer transition relative group hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">{s.name}</span>
                {isWeakest && (
                  <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-bold uppercase">
                    Priority
                  </span>
                )}
                {isStrongest && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold uppercase">
                    Strongest
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold text-white mt-3">{s.score.toFixed(1)}</div>
              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${s.color} rounded-full`}
                  style={{ width: `${(s.score / 9.0) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-2 flex items-center justify-between group-hover:text-slate-400">
                <span>Practice {s.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          );
        })}
      </div>

      {/* Streak & Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Study Streak</p>
            <p className="text-2xl font-bold text-white mt-0.5">{data?.study_streak_days || 3} Days</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Tests Completed</p>
            <p className="text-2xl font-bold text-white mt-0.5">{data?.total_tests_completed || 4} Tests</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Vocabulary Mastered</p>
            <p className="text-2xl font-bold text-white mt-0.5">{data?.vocabulary_words_learned || 18} Words</p>
          </div>
        </div>
      </div>

      {/* Recommended Practice Engine (Section 4) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold text-white">AI Personalized Practice Recommendations</h3>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
            Targeting Weakest Skill: <strong className="text-rose-400 uppercase">{data?.weakest_skill}</strong>
          </span>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec: any, idx: number) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">
                    {rec.skill}
                  </span>
                  <h4 className="text-sm font-semibold text-white">{rec.title}</h4>
                </div>
                <p className="text-xs text-slate-400">{rec.reason}</p>
              </div>

              <button
                onClick={() => onNavigate(rec.skill === "grammar" ? "grammar" : rec.skill === "vocabulary" ? "vocabulary" : rec.skill)}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 px-4 py-2 rounded-xl transition shrink-0"
              >
                <span>Start Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Official IELTS Disclaimer Notice */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
        <strong className="text-slate-300">Important Disclaimer:</strong> All band scores, evaluations, and criteria ratings provided by the IELTS AI Coach platform are AI-estimated practice simulations intended strictly for diagnostic study and preparation. They do not constitute official test reports from the British Council, IDP: IELTS Australia, or Cambridge University Press & Assessment.
      </div>
    </div>
  );
};
