import React, { useState, useEffect } from "react";
import { Headphones, Play, Pause, Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { api } from "../api";

export const ListeningPage: React.FC = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSec, setSelectedSec] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadListeningTests();
  }, []);

  const loadListeningTests = async () => {
    try {
      const data = await api.getListeningTests();
      setSections(data);
      if (data.length > 0) {
        setSelectedSec(data[0]);
      }
    } catch (err) {
      console.error("Error loading listening tests:", err);
    }
  };

  const handleSelectAnswer = (qId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedSec) return;
    try {
      setSubmitting(true);
      const res = await api.submitListeningTest({
        test_id: selectedSec.id,
        answers: answers,
        time_taken_seconds: 600,
      });
      setResult(res);
    } catch (err) {
      console.error("Listening submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setIsPlaying(false);
  };

  if (!selectedSec) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        Loading Listening Modules...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{selectedSec.title}</h2>
            <p className="text-xs text-slate-400">
              Section {selectedSec.section} • Topic: {selectedSec.topic}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                setSelectedSec(sec);
                handleReset();
              }}
              className={`text-xs px-3 py-1.5 rounded-xl border transition ${
                selectedSec.id === sec.id
                  ? "bg-purple-600 border-purple-500 text-white font-bold"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Section {sec.section}
            </button>
          ))}
        </div>
      </div>

      {/* Audio Player Card */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/20 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition shrink-0"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
            <div>
              <h3 className="text-base font-bold text-white">{selectedSec.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isPlaying ? "Audio playing • Listen carefully for cues" : "Click to play recording audio stream"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 border border-slate-800 px-4 py-2 rounded-xl">
            <Volume2 className="w-4 h-4 text-purple-400" />
            <span>High Fidelity IELTS Exam Acoustics</span>
          </div>
        </div>

        {/* Audio Script Cue Card */}
        <div className="mt-4 p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300">
          <strong className="text-purple-400">Audio Transcript Cue:</strong> {selectedSec.transcript_cue}
        </div>
      </div>

      {/* Score Summary if Submitted */}
      {result && (
        <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Listening Result</span>
            <h3 className="text-2xl font-bold text-white mt-1">Section Diagnostic</h3>
            <p className="text-sm text-slate-400 mt-1">
              {result.correct_count} of {result.total_questions} correct ({result.accuracy_percent}% accuracy).
            </p>
          </div>
          <div className="text-center bg-slate-950/80 border border-slate-800 px-6 py-4 rounded-2xl shrink-0">
            <p className="text-xs text-slate-400 uppercase font-semibold">Estimated Band</p>
            <p className="text-4xl font-black text-purple-400 mt-0.5">{result.estimated_band.toFixed(1)}</p>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
          Section Questions ({selectedSec.questions?.length || 0})
        </h3>

        <div className="space-y-4">
          {selectedSec.questions?.map((q: any, idx: number) => {
            const qId = q.question_id;
            const currentAns = answers[qId] || "";
            const feedback = result?.questions_feedback?.find((f: any) => f.question_id === qId);

            return (
              <div key={qId} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-200">
                    <span className="text-purple-400 mr-2">{idx + 1}.</span>
                    {q.question}
                  </p>
                  {feedback && (
                    feedback.is_correct ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )
                  )}
                </div>

                {q.options && q.options.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt: string) => {
                      const optCode = opt.startsWith("A.") || opt.startsWith("B.") || opt.startsWith("C.") || opt.startsWith("D.")
                        ? opt.substring(0, 1)
                        : opt;
                      const isSelected = currentAns === optCode || currentAns.toLowerCase() === opt.toLowerCase();

                      return (
                        <button
                          key={opt}
                          disabled={!!result}
                          onClick={() => handleSelectAnswer(qId, optCode)}
                          className={`text-left text-xs p-2.5 rounded-lg border transition ${
                            isSelected
                              ? "bg-purple-600/20 border-purple-500 text-purple-200 font-semibold"
                              : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="pt-1">
                    <input
                      type="text"
                      disabled={!!result}
                      placeholder="Type your answer here..."
                      value={currentAns}
                      onChange={(e) => handleSelectAnswer(qId, e.target.value)}
                      className="w-full sm:w-80 bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                )}

                {feedback && (
                  <div className="mt-2 p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1">
                    <span className="text-slate-400">
                      Correct: <strong className="text-emerald-400">{feedback.correct_answer}</strong>
                    </span>
                    <p className="text-slate-300 italic">{feedback.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!result ? (
          <button
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length === 0}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 transition flex items-center justify-center gap-2 mt-4"
          >
            <span>{submitting ? "Checking Answers..." : "Submit Listening Answers"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition mt-4"
          >
            Practice Section Again
          </button>
        )}
      </div>
    </div>
  );
};
