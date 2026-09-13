import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, BookOpen, Quote, Bot, User as UserIcon, Radio } from "lucide-react";
import { api } from "../api";

export const AITutorPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! I am your real-time **IELTS AI Tutor**. I'm here to explain band descriptors, unpack writing & speaking mistakes, give high-band vocabulary, and clarify authentic test questions.\n\nAsk me anything or select one of the suggested topics below!",
      citations: [],
      isStreaming: false
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const suggestedQuestions = [
    "Why is my IELTS writing score only 6?",
    "How do I structure a Task 2 discussion essay?",
    "Give me 5 high-band academic alternatives for 'important'",
    "What is the difference between Band 6.5 and Band 7.5 in Speaking?",
    "How to tackle True/False/Not Given questions in Reading?"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { id: Date.now(), role: "user", content: query, citations: [], isStreaming: false };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.chatTutor({ message: query });
      const fullReply = res.reply || "I am here to help you prepare for IELTS.";
      const citations = res.citations || [];

      // Create streaming placeholder
      const botMsgId = Date.now() + 1;
      const botMsg = {
        id: botMsgId,
        role: "assistant",
        content: "",
        citations: citations,
        isStreaming: true
      };

      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);

      // Real-time word-by-word streaming effect
      const words = fullReply.split(" ");
      let currentText = "";
      for (let i = 0; i < words.length; i++) {
        currentText += (i > 0 ? " " : "") + words[i];
        const update = currentText;
        const isLast = i === words.length - 1;
        await new Promise((r) => setTimeout(r, 16));
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? { ...m, content: update, isStreaming: !isLast }
              : m
          )
        );
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "assistant",
          content: "I apologize, but I encountered an issue connecting to the AI Tutor service. Please try again.",
          citations: [],
          isStreaming: false
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
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">AI IELTS Tutor (RAG-Augmented)</h2>
              <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" /> Real-Time Stream
              </span>
            </div>
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
            className="text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isBot = m.role === "assistant";
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isBot ? "bg-rose-600/20 text-rose-400 border border-rose-500/30" : "bg-blue-600 text-white"
                }`}
              >
                {isBot ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
              </div>

              <div className="space-y-2 max-w-2xl">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isBot
                      ? "bg-slate-950 border border-slate-800 text-slate-200"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">
                    {m.content}
                    {m.isStreaming && (
                      <span className="inline-block w-1.5 h-3.5 bg-rose-500 animate-pulse ml-1 align-middle"></span>
                    )}
                  </div>
                </div>

                {/* Citations from RAG */}
                {m.citations && m.citations.length > 0 && !m.isStreaming && (
                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1.5 animate-fadeIn">
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
            <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <span>AI Tutor is querying IELTS vector index...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about band scores, grammar rules, vocabulary collocations, or essay ideas..."
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-rose-500 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white px-5 py-3 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/20"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
