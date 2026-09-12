import React, { useState, useEffect } from "react";
import { Bookmark, CheckCircle2, RotateCw, Volume2, Sparkles, Filter } from "lucide-react";
import { api } from "../api";

export const VocabularyPage: React.FC = () => {
  const [words, setWords] = useState<any[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [filterTopic, setFilterTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [masteredIds, setMasteredIds] = useState<number[]>([]);

  useEffect(() => {
    loadVocabulary();
  }, [filterTopic]);

  const loadVocabulary = async () => {
    try {
      setLoading(true);
      const query = filterTopic ? `?topic=${filterTopic}` : "";
      const data = await api.getVocabulary(query);
      setWords(data);
    } catch (err) {
      console.error("Error loading vocabulary:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkMastered = async (wordId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.masterWord(wordId);
      setMasteredIds((prev) => [...prev, wordId]);
    } catch (err) {
      console.error("Error mastering word:", err);
    }
  };

  const speakWord = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(word);
      u.lang = "en-GB";
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Academic Vocabulary Trainer (AWL)</h2>
            <p className="text-xs text-slate-400">
              Master Band 7.5–9.0 collocations, definitions, and spaced repetition recall
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {["", "technology", "environment", "society", "academic"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterTopic(t)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition capitalize ${
                filterTopic === t
                  ? "bg-sky-600 border-sky-500 text-white font-bold"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {t === "" ? "All Topics" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary Flashcards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {words.map((w) => {
          const isFlipped = activeCard === w.id;
          const isMastered = masteredIds.includes(w.id);

          return (
            <div
              key={w.id}
              onClick={() => setActiveCard(isFlipped ? null : w.id)}
              className={`min-h-[280px] bg-slate-900 border rounded-2xl p-5 cursor-pointer transition flex flex-col justify-between relative group ${
                isFlipped ? "border-sky-500/50 bg-slate-900/90 shadow-xl" : "border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Top info */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-950 text-sky-400 px-2.5 py-1 rounded-lg border border-slate-800">
                  {w.band_level}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => speakWord(w.word, e)}
                    className="p-1 text-slate-400 hover:text-white rounded"
                    title="Listen pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-500 italic">{w.part_of_speech}</span>
                </div>
              </div>

              {/* Card Center Content */}
              {!isFlipped ? (
                <div className="my-auto text-center space-y-2">
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">{w.word}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{w.definition}</p>
                  <p className="text-[11px] text-sky-400/80 pt-2 flex items-center justify-center gap-1">
                    <RotateCw className="w-3 h-3" /> Click card to flip details
                  </p>
                </div>
              ) : (
                <div className="my-auto space-y-3 text-left pt-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Definition:</span>
                    <p className="text-xs text-slate-200 mt-0.5">{w.definition}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Academic Collocations:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {w.collocations?.map((c: string, idx: number) => (
                        <span key={idx} className="text-[11px] bg-slate-950 text-sky-300 px-2 py-0.5 rounded border border-slate-800">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Example Sentence:</span>
                    <p className="text-xs text-slate-300 italic font-serif mt-0.5">"{w.example_sentence}"</p>
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 capitalize">{w.topic}</span>
                <button
                  onClick={(e) => handleMarkMastered(w.id, e)}
                  className={`text-xs px-3 py-1 rounded-lg border transition flex items-center gap-1 ${
                    isMastered
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400 font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isMastered ? "Mastered" : "Mark Mastered"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
