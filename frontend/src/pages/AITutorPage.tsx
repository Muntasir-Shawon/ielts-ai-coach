import React, { useState } from "react";
import { Sparkles, Send, BookOpen, Quote, Bot, User as UserIcon } from "lucide-react";
import { api } from "../api";

export const AITutorPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your **IELTS AI Tutor**. I'm here to explain band descriptors, unpack writing & speaking mistakes, give high-band vocabulary, and clarify authentic test questions.\n\nAsk me anything or select one of the suggested topics below!",
      citations: []
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "Why is my IELTS writing score only 6?",
    "How do I structure a Task 2 discussion essay?",
    "Give me 5 high-band academic alternatives for 'important'",
    "What is the difference between Band 6.5 and Band 7.5 in Speaking?",
    "How to tackle True/False/Not Given questions in Reading?"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { role: "user", content: query, citations: [] };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.chatTutor({ message: query });
      const botMsg = {
        role: "assistant",
        content: res.reply,
        citations: res.citations || []
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an issue connecting to the AI Tutor service. Please try again.",
          citations: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-12 flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI IELTS Tutor (RAG-Augmented)</h2>
            <p className="text-xs text-slate-400">
              Grounded in official IELTS scoring rubrics and verified dataset materials
            </p>
          </div>
        </div>

        <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-full font-bold uppercase">
          RAG Active
        </span>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 no-scrollbar">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl whitespace-nowrap transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-y-auto space-y-4">
        {messages.map((m, idx) => {
          const isBot = m.role === "assistant";
          return (
            <div
              key={idx}
              className={`flex gap-3 max-w-3xl ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isBot ? "bg-rose-600/20 text-rose-400 border border-rose-500/30" : "bg-blue-600 text-white"
                }`}
              >
                {isBot ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
              </div>

              <div className="space-y-2">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isBot
                      ? "bg-slate-950 border border-slate-800 text-slate-200"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">{m.content}</div>
                </div>

                {/* Citations from RAG */}
                {m.citations && m.citations.length > 0 && (
                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                      <Quote className="w-3 h-3" /> Retrieved IELTS Grounding Sources
                    </span>
                    <div className="space-y-1">
                      {m.citations.map((c: any, i: number) => (
                        <div key={i} className="text-[11px] text-slate-400">
                          [{c.id}] <span className="text-slate-300 font-medium">"{c.snippet}..."</span> (Relevance: {c.score})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-xl mr-auto items-center text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-2xl">
              Retrieving IELTS database context & reasoning...
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center gap-3 shrink-0">
        <input
          type="text"
          placeholder="Ask any question regarding IELTS Writing, Speaking, Reading, or Grammar..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none px-2"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={loading || !input.trim()}
          className="p-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-xl shadow-lg shadow-rose-600/30 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
