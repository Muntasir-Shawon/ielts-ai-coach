import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Square
} from "lucide-react";
import { api } from "../api";

export const SpeakingPage: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [currentPart, setCurrentPart] = useState(1);
  const [examinerQuestion, setExaminerQuestion] = useState("");
  const [instruction, setInstruction] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [prepTimeLeft, setPrepTimeLeft] = useState<number | null>(null);
  const [speakDuration, setSpeakDuration] = useState(0);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const recognitionRef = useRef<any>(null);
  const speakTimerRef = useRef<any>(null);

  // Initialize Web Speech API for zero-latency speech recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let currentText = "";
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + " ";
        }
        setTranscript(currentText.trim());
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition notice:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Part 2 Preparation timer countdown
  useEffect(() => {
    if (prepTimeLeft !== null && prepTimeLeft > 0) {
      const timer = setInterval(() => setPrepTimeLeft((t) => (t !== null && t > 0 ? t - 1 : 0)), 1000);
      return () => clearInterval(timer);
    }
  }, [prepTimeLeft]);

  // Speaking duration timer while recording
  useEffect(() => {
    if (isRecording) {
      speakTimerRef.current = setInterval(() => setSpeakDuration((d) => d + 1), 1000);
    } else {
      clearInterval(speakTimerRef.current);
    }
    return () => clearInterval(speakTimerRef.current);
  }, [isRecording]);

  // Text-to-Speech playback for examiner
  const speakExaminerQuestion = (text: string) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = "en-GB"; // British examiner tone
    window.speechSynthesis.speak(utterance);
  };

  const handleStartExam = async () => {
    try {
      setLoading(true);
      setEvaluation(null);
      setTranscript("");
      setSpeakDuration(0);

      const res = await api.startSpeaking({ topic: "Technology and Environment" });
      setSession(res);
      setCurrentPart(res.current_part);
      setExaminerQuestion(res.examiner_question);
      setInstruction(res.instruction);

      speakExaminerQuestion(res.examiner_question);
    } catch (err) {
      console.error("Start speaking exam error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript("");
      setSpeakDuration(0);
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.warn("Speech recognition fallback:", err);
        setIsRecording(true);
      }
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || !transcript.trim()) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    try {
      setLoading(true);
      const res = await api.answerSpeaking({
        session_id: session.session_id,
        transcript: transcript,
        duration_seconds: Math.max(8, speakDuration),
        part: currentPart,
      });

      if (res.is_finished) {
        setEvaluation(res.evaluation);
        setSession(null);
      } else {
        setCurrentPart(res.current_part);
        setExaminerQuestion(res.examiner_question);
        setInstruction(res.instruction);
        setTranscript("");
        setSpeakDuration(0);

        if (res.current_part === 2) {
          setPrepTimeLeft(60); // 60 seconds preparation timer
        } else {
          setPrepTimeLeft(null);
        }

        speakExaminerQuestion(res.examiner_question);
      }
    } catch (err) {
      console.error("Speaking turn error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishEarly = async () => {
    if (!session) return;
    try {
      setLoading(true);
      const res = await api.finishSpeaking({ session_id: session.session_id });
      setEvaluation(res.evaluation);
      setSession(null);
    } catch (err) {
      console.error("Finish error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Voice Speaking Examiner</h2>
            <p className="text-xs text-slate-400">
              Realistic 3-Part IELTS Interview with Web Speech API & Acoustic Analytics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition ${
              voiceEnabled
                ? "bg-slate-950 border-emerald-500/30 text-emerald-400"
                : "bg-slate-950 border-slate-800 text-slate-500"
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{voiceEnabled ? "Examiner Voice On" : "Examiner Muted"}</span>
          </button>
        </div>
      </div>

      {/* Main Examination Arena */}
      {!session && !evaluation ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
            <Mic className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Start Full IELTS Speaking Simulation</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              Follows the official 3-part exam structure: Part 1 interview, Part 2 cue card (with 1-minute prep timer), and Part 3 abstract discussion.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-left bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
            <div>
              <span className="font-bold text-emerald-400">Part 1</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Everyday Interview (4-5 questions)</p>
            </div>
            <div>
              <span className="font-bold text-emerald-400">Part 2</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Cue Card & Long Turn (1-2 mins)</p>
            </div>
            <div>
              <span className="font-bold text-emerald-400">Part 3</span>
              <p className="text-[11px] text-slate-400 mt-0.5">In-depth 2-Way Discussion</p>
            </div>
          </div>

          <button
            onClick={handleStartExam}
            disabled={loading}
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition text-sm flex items-center justify-center gap-2 mx-auto"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{loading ? "Connecting Examiner..." : "Begin Speaking Test"}</span>
          </button>
        </div>
      ) : session ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Examiner Box (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between h-[520px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  Part {currentPart} Examination
                </span>
                <button
                  onClick={() => speakExaminerQuestion(examinerQuestion)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Repeat Audio
                </button>
              </div>

              {/* Cue Card Timer for Part 2 */}
              {prepTimeLeft !== null && prepTimeLeft > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center justify-between text-xs text-amber-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Preparation Countdown</span>
                  </div>
                  <span className="font-mono font-bold text-base text-amber-400">{prepTimeLeft}s</span>
                </div>
              )}

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 font-serif text-slate-100 text-sm md:text-base leading-relaxed whitespace-pre-line shadow-inner">
                {examinerQuestion}
              </div>

              <p className="text-xs text-slate-400 italic">💡 {instruction}</p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Dr. Harrison (Examiner)</span>
              <button
                onClick={handleFinishEarly}
                className="text-xs text-rose-400 hover:underline"
              >
                Conclude Test Early
              </button>
            </div>
          </div>

          {/* Candidate Voice Response Box (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between h-[520px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Candidate Microphone & Transcript
                </span>
                <span className="text-xs font-mono text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  Duration: {speakDuration}s
                </span>
              </div>

              {/* Transcript Area */}
              <textarea
                rows={8}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Click the microphone below and start speaking naturally. Your words will transcribe here in real-time..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-4 text-sm text-slate-100 outline-none resize-none leading-relaxed font-sans"
              />
            </div>

            {/* Mic Controls */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
              <button
                onClick={toggleRecording}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition ${
                  isRecording
                    ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecording ? "Stop Recording" : "Record Answer"}</span>
              </button>

              <button
                onClick={handleSubmitAnswer}
                disabled={loading || !transcript.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/20 transition"
              >
                {loading ? "Processing..." : "Next Question →"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Speaking Evaluation Diagnostic Report */}
      {evaluation && (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Official IELTS Criteria Assessment
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Estimated Speaking Band: {evaluation.estimated_band}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{evaluation.disclaimer}</p>
            </div>

            {/* 4 Criteria Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "Fluency & Coherence", val: evaluation.fluency },
                { label: "Lexical Resource", val: evaluation.lexical_resource },
                { label: "Grammar Range", val: evaluation.grammar },
                { label: "Pronunciation", val: evaluation.pronunciation },
              ].map((c) => (
                <div key={c.label} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">{c.label}</p>
                  <p className="text-lg font-bold text-emerald-400 mt-0.5">{c.val.toFixed(1)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Speech Telemetry Metrics */}
          {evaluation.metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase">Speaking Rate</span>
                <p className="text-base font-bold text-white mt-0.5">{evaluation.metrics.words_per_minute} WPM</p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase">Hesitation Count</span>
                <p className="text-base font-bold text-white mt-0.5">{evaluation.metrics.hesitation_count} Fillers</p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase">Lexical Variety (TTR)</span>
                <p className="text-base font-bold text-white mt-0.5">{evaluation.metrics.type_token_ratio}</p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase">Total Words Spoken</span>
                <p className="text-base font-bold text-white mt-0.5">{evaluation.metrics.total_words} Words</p>
              </div>
            </div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Examiner Strengths Observed
              </h4>
              <ul className="space-y-1 text-xs text-slate-300">
                {evaluation.strengths?.map((s: string, idx: number) => (
                  <li key={idx}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-bold uppercase text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Priority Areas to Refine
              </h4>
              <ul className="space-y-1 text-xs text-slate-300">
                {evaluation.weaknesses?.map((w: string, idx: number) => (
                  <li key={idx}>• {w}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={handleStartExam}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition"
            >
              Take Another Speaking Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
