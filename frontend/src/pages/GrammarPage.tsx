import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Sparkles, BookCheck, HelpCircle } from "lucide-react";
import { api } from "../api";

export const GrammarPage: React.FC = () => {
  const [drills, setDrills] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [feedbackMap, setFeedbackMap] = useState<{ [key: number]: any }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGrammarDrills();
  }, []);

  const loadGrammarDrills = async () => {
    try {
      setLoading(true);
      const data = await api.getGrammar();
      setDrills(data);
    } catch (err) {
      console.error("Error loading grammar drills:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (drillId: number, opt: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [drillId]: opt }));
  };

  const handleCheckAnswer = async (drillId: number) => {
    const selected = selectedAnswers[drillId];
    if (!selected) return;

    try {
      const res = await api.checkGrammar({ drill_id: drillId, selected_option: selected });
      setFeedbackMap((prev) => ({ ...prev, [drillId]: res }));
    } catch (err) {
      console.error("Grammar check error:", err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <BookCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">IELTS Grammar Accuracy Drills</h2>
            <p className="text-xs text-slate-400">
              Address the 10 most common grammatical mistakes penalized in IELTS Writing & Speaking
            </p>
          </div>
        </div>

        <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-semibold">
          GRA Band 7+ Focus
        </span>
      </div>

      {/* Grammar Drills List */}
      <div className="space-y-5">
        {drills.map((drill, idx) => {
          const selected = selectedAnswers[drill.id];
          const feedback = feedbackMap[drill.id];

          return (
            <div key={drill.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider bg-slate-950 text-emerald-400 px-3 py-1 rounded-lg border border-slate-800">
                  Category: {drill.category}
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-400">
                  Difficulty: {drill.difficulty}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">{drill.instruction}</p>
                <h3 className="text-base font-bold text-white leading-relaxed">{drill.question}</h3>
              </div>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {drill.options?.map((opt: string) => {
                  const optCode = opt.startsWith("A.") || opt.startsWith("B.") || opt.startsWith("C.") || opt.startsWith("D.")
                    ? opt.substring(0, 1)
                    : opt;
                  const isSelected = selected === optCode || selected === opt;

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(drill.id, optCode)}
                      className={`w-full text-left text-xs p-3 rounded-xl border transition ${
                        isSelected
                          ? "bg-emerald-600/20 border-emerald-500 text-emerald-200 font-semibold"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Action / Feedback */}
              <div className="pt-2 flex items-center justify-between">
                {!feedback ? (
                  <button
                    onClick={() => handleCheckAnswer(drill.id)}
                    disabled={!selected}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition"
                  >
                    Check Answer
                  </button>
                ) : (
                  <div className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      {feedback.is_correct ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                          <XCircle className="w-4 h-4" /> Incorrect (Selected: {feedback.selected_option} | Correct: {feedback.correct_option})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      <strong className="text-slate-200">Grammar Rule:</strong> {feedback.rule_explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
