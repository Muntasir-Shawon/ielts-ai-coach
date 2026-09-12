import React, { useState, useEffect } from "react";
import { BookOpen, CheckCircle2, XCircle, Clock, RotateCcw, ArrowRight } from "lucide-react";
import { api } from "../api";

export const ReadingPage: React.FC = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(1200);

  useEffect(() => {
    loadTests();
  }, []);

  useEffect(() => {
    if (!result && secondsLeft > 0) {
      const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [result, secondsLeft]);

  const loadTests = async () => {
    try {
      const data = await api.getReadingTests();
      setTests(data);
      if (data.length > 0) {
        setSelectedTest(data[0]);
      }
    } catch (err) {
      console.error("Error loading reading tests:", err);
    }
  };

  const handleSelectAnswer = (qId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedTest) return;
    try {
      setSubmitting(true);
      const res = await api.submitReadingTest({
        test_id: selectedTest.id,
        answers: answers,
        time_taken_seconds: 1200 - secondsLeft,
      });
      setResult(res);
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setSecondsLeft(1200);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!selectedTest) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        Loading Reading Practice Tests...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Test Selector and Timer Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{selectedTest.title}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-400 uppercase font-medium">Topic: {selectedTest.topic}</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-semibold uppercase">
                {selectedTest.difficulty}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl text-sm font-semibold text-slate-200">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{formatTime(secondsLeft)}</span>
          </div>

          <button
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-white rounded-xl border border-slate-800 hover:bg-slate-800 transition"
            title="Reset test"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Result Card if Submitted */}
      {result && (
        <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Diagnostic Result</span>
              <h3 className="text-2xl font-bold text-white mt-1">Reading Test Score</h3>
              <p className="text-sm text-slate-400 mt-1">
                You answered {result.correct_count} of {result.total_questions} questions correctly ({result.accuracy_percent}% accuracy).
              </p>
            </div>
            <div className="text-center bg-slate-950/80 border border-slate-800 px-6 py-4 rounded-2xl shrink-0">
              <p className="text-xs text-slate-400 uppercase font-semibold">Estimated Band</p>
              <p className="text-4xl font-black text-blue-400 mt-0.5">{result.estimated_band.toFixed(1)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Split Screen: Passage & Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Reading Passage (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[720px] overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-3">
            Reading Passage
          </h3>
          <div className="text-slate-300 text-sm leading-relaxed space-y-4 whitespace-pre-line font-serif">
            {selectedTest.passage}
          </div>
        </div>

        {/* Right: Questions & Input (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[720px] overflow-y-auto flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Questions ({selectedTest.questions?.length || 0})
            </h3>

            {selectedTest.questions?.map((q: any, idx: number) => {
              const qId = q.question_id;
              const currentAns = answers[qId] || "";
              const feedback = result?.questions_feedback?.find((f: any) => f.question_id === qId);

              return (
                <div key={qId} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-200">
                      <span className="text-blue-400 mr-1.5">{idx + 1}.</span>
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

                  {/* Options */}
                  <div className="space-y-2 pt-1">
                    {q.options?.map((opt: string) => {
                      const optCode = opt.startsWith("A.") || opt.startsWith("B.") || opt.startsWith("C.") || opt.startsWith("D.")
                        ? opt.substring(0, 1)
                        : opt;
                      const isSelected = currentAns === optCode || currentAns === opt;

                      return (
                        <button
                          key={opt}
                          disabled={!!result}
                          onClick={() => handleSelectAnswer(qId, optCode)}
                          className={`w-full text-left text-xs p-2.5 rounded-lg border transition ${
                            isSelected
                              ? "bg-blue-600/20 border-blue-500 text-blue-200 font-semibold"
                              : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {feedback && (
                    <div className="mt-3 p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1">
                      <div className="text-slate-400">
                        Correct Answer: <strong className="text-emerald-400">{feedback.correct_answer}</strong>
                      </div>
                      <p className="text-slate-300 leading-relaxed italic">{feedback.explanation}</p>
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
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2"
            >
              <span>{submitting ? "Evaluating..." : "Submit Reading Answers"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition"
            >
              Practice Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
