import React, { useState } from "react";
import { PenTool, CheckCircle2, AlertCircle, Sparkles, BookOpen, ArrowRight, RotateCcw } from "lucide-react";
import { api } from "../api";

export const WritingPage: React.FC = () => {
  const [task, setTask] = useState<"Task 1" | "Task 2">("Task 2");
  const [prompt, setPrompt] = useState(
    "Some people believe that artificial intelligence will replace human teachers in the future. To what extent do you agree or disagree?"
  );
  const [essay, setEssay] = useState("");
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;
  const minWords = task === "Task 1" ? 150 : 250;

  const samplePrompts = {
    "Task 2": [
      "Some people believe that artificial intelligence will replace human teachers in the future. To what extent do you agree or disagree?",
      "Some people think that environmental problems should be solved by international governments, while others think individuals should take responsibility. Discuss both views and give your opinion.",
      "More and more companies are allowing employees to work from home. Do the advantages outweigh the disadvantages?",
      "In many countries, young people leave school with a lack of basic money management skills. What are the causes and what solutions can you propose?"
    ],
    "Task 1": [
      "The line graph shows renewable energy consumption in four countries between 2000 and 2020. Summarize the information by selecting and reporting the main features.",
      "The diagram illustrates the process of manufacturing recycled paper from waste paper. Summarise the information by selecting and reporting the main features.",
      "The bar chart compares the percentage of adults who used public transport daily across six major European metropolises in 2022."
    ]
  };

  const handleEvaluate = async () => {
    if (!essay.trim()) return;
    try {
      setLoading(true);
      const res = await api.evaluateWriting({
        task: task,
        prompt: prompt,
        essay_text: essay,
      });
      setEvaluation(res.evaluation);
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleEssay = () => {
    setEssay(
      "In recent decades, artificial intelligence has made astounding progress in various sectors, leading some to argue that traditional educators will eventually become obsolete. While automated algorithms can deliver customized practice and rapid evaluations, I firmly disagree that AI can completely supplant human educators due to pedagogical empathy and critical guidance.\n\nTo begin with, human educators provide socio-emotional mentorship that algorithms fundamentally cannot replicate. When young students struggle with academic concepts or personal hurdles, teachers offer tailored encouragement and pastoral care. Furthermore, critical thinking and ethical inquiry require nuanced dialogue between human minds.\n\nOn the other hand, AI serves as an indispensable auxiliary tool. Automated tutoring software can assess grammatical precision, analyze pronunciation nuances, and pinpoint knowledge deficiencies instantaneously. When leveraged in tandem with human guidance, digital platforms maximize student engagement.\n\nIn conclusion, although artificial intelligence will undoubtedly transform modern pedagogy, human teachers will remain irreplaceable mentors."
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">IELTS Writing AI Evaluator</h2>
            <p className="text-xs text-slate-400">
              Assesses submissions on TR/TA, CC, LR, and GRA with model corrections
            </p>
          </div>
        </div>

        {/* Task Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setTask("Task 2");
              setPrompt(samplePrompts["Task 2"][0]);
              setEvaluation(null);
            }}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition ${
              task === "Task 2" ? "bg-amber-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Task 2 Essay (250w)
          </button>
          <button
            onClick={() => {
              setTask("Task 1");
              setPrompt(samplePrompts["Task 1"][0]);
              setEvaluation(null);
            }}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition ${
              task === "Task 1" ? "bg-amber-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Task 1 Report (150w)
          </button>
        </div>
      </div>

      {/* Prompt Selection / Input */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {task} Prompt
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={loadSampleEssay}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Sparkles className="w-3 h-3" /> Load Band 8 Sample Essay
            </button>
          </div>
        </div>

        <textarea
          rows={2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:border-amber-500 outline-none resize-none font-serif"
        />

        {/* Quick prompt suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400">Sample Prompts:</span>
          {samplePrompts[task].map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(p);
                setEvaluation(null);
              }}
              className="text-[11px] text-slate-400 hover:text-amber-400 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg transition truncate max-w-xs"
            >
              {p.substring(0, 45)}...
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Word Count */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Your Essay Submission
          </span>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                wordCount >= minWords
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-400"
              }`}
            >
              {wordCount} / {minWords} Words
            </span>
          </div>
        </div>

        <textarea
          rows={12}
          placeholder="Begin typing your IELTS response here. Write in continuous academic paragraphs..."
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-4 text-sm text-slate-100 outline-none leading-relaxed font-mono"
        />

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              setEssay("");
              setEvaluation(null);
            }}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear Text
          </button>

          <button
            onClick={handleEvaluate}
            disabled={loading || wordCount < 30}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-amber-600/30 transition flex items-center gap-2 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? "Analyzing Essay Criteria..." : "Evaluate with AI"}</span>
          </button>
        </div>
      </div>

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 space-y-6">
          {/* Header Band Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                AI Diagnostic Evaluation Report
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Estimated Overall Band: {evaluation.estimated_band}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{evaluation.disclaimer}</p>
            </div>

            {/* 4 Criteria Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(evaluation.criteria_scores || {}).map(([crit, val]: any) => (
                <div key={crit} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">
                    {crit.replace("_", " ")}
                  </p>
                  <p className="text-lg font-bold text-amber-400 mt-0.5">{val.toFixed(1)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Key Strengths
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {evaluation.strengths?.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-bold uppercase text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Areas for Improvement
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {evaluation.weaknesses?.map((w: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Grammar Corrections */}
          {evaluation.grammar_corrections && evaluation.grammar_corrections.length > 0 && (
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-bold uppercase text-amber-400">Grammar & Syntax Diagnostics</h4>
              <div className="space-y-2">
                {evaluation.grammar_corrections.map((gc: any, idx: number) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs space-y-1">
                    <div className="text-rose-400 line-through">"{gc.original}"</div>
                    <div className="text-emerald-400 font-semibold">"{gc.correction}"</div>
                    <div className="text-slate-400 text-[11px] italic">{gc.explanation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* High-Band Model Paragraph */}
          {evaluation.improved_example_paragraph && (
            <div className="bg-gradient-to-r from-amber-950/30 to-slate-950 border border-amber-500/20 p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-bold uppercase text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> High-Band Model Paragraph (Band 8.5+)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
                "{evaluation.improved_example_paragraph}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
