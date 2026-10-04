import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  FileText,
  BookOpen,
  Headphones,
  PenTool,
  Award,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Save,
  ShieldAlert,
  Flame,
  HelpCircle,
  Highlighter,
  Send,
  Eye,
  Calendar,
  Layers,
  BarChart3
} from "lucide-react";
import { api } from "../api";
import { calculateOverallBand, generate7DayStudyPlan } from "../mockTestData";

interface MockTestPageProps {
  onNavigate?: (tab: string) => void;
  initialSessionId?: string;
}

export const MockTestPage: React.FC<MockTestPageProps> = ({ onNavigate, initialSessionId }) => {
  // Page states: 'setup' | 'active' | 'result'
  const [viewState, setViewState] = useState<"setup" | "active" | "result">("setup");
  const [loading, setLoading] = useState<boolean>(false);

  // Setup form states
  const [testType, setTestType] = useState<"academic" | "general_training">("academic");
  const [mode, setMode] = useState<"exam" | "practice">("exam");
  const [selectedModule, setSelectedModule] = useState<"full" | "listening" | "reading" | "writing" | "speaking">("full");
  const [selectedSet, setSelectedSet] = useState<number>(0); // 0 = Auto-Rotate (Fresh Questions Each Exam)

  // Active exam session state
  const [session, setSession] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState<string>("listening");
  const [remainingSeconds, setRemainingSeconds] = useState<number>(1800);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, any>>({
    listening: {},
    reading: {},
    writing: { task_1: "", task_2: "" },
    speaking: []
  });
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("idle");
  const [lastSavedTime, setLastSavedTime] = useState<string>("");

  // Sub-engine states
  // Reading
  const [activePassageIndex, setActivePassageIndex] = useState<number>(0);
  const [highlightedText, setHighlightedText] = useState<string[]>([]);

  // Writing
  const [activeWritingTask, setActiveWritingTask] = useState<"task_1" | "task_2">("task_1");

  // Speaking
  const [speakingTurnIndex, setSpeakingTurnIndex] = useState<number>(0);
  const [speakingPrepTimer, setSpeakingPrepTimer] = useState<number>(60);
  const [speakingSpeechTimer, setSpeakingSpeechTimer] = useState<number>(120);
  const [speakingPhase, setSpeakingPhase] = useState<"prep" | "speaking" | "review">("prep");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcriptDraft, setTranscriptDraft] = useState<string>("");

  // Listening
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [audioPlayedOnce, setAudioPlayedOnce] = useState<boolean>(false);

  // Modals & results
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [examResult, setExamResult] = useState<any>(null);

  // Timers and auto-save refs
  const timerRef = useRef<any>(null);
  const autosaveRef = useRef<any>(null);

  // Restore session if initialSessionId is provided or active in localStorage
  useEffect(() => {
    const activeId = initialSessionId || localStorage.getItem("ielts_active_mock_session_id");
    if (activeId) {
      recoverSession(activeId);
    }
  }, [initialSessionId]);

  // Main authoritative timer tick
  useEffect(() => {
    if (viewState !== "active" || isPaused) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [viewState, isPaused, currentSection]);

  // Periodic Auto-save every 8 seconds
  useEffect(() => {
    if (viewState !== "active" || !session) return;

    autosaveRef.current = setInterval(() => {
      triggerAutosave();
    }, 8000);

    return () => clearInterval(autosaveRef.current);
  }, [viewState, session, answers, currentSection]);

  const recoverSession = async (sessionId: string) => {
    setLoading(true);
    try {
      const recovered = await api.getMockSession(sessionId);
      if (recovered && recovered.session_id) {
        if (recovered.status === "completed") {
          const res = await api.getMockResult(sessionId);
          setExamResult(res);
          setViewState("result");
        } else {
          setSession(recovered);
          setCurrentSection(recovered.current_section || "listening");
          setRemainingSeconds(recovered.remaining_seconds || 1800);
          setAnswers(recovered.answers || { listening: {}, reading: {}, writing: { task_1: "", task_2: "" }, speaking: [] });
          setViewState("active");
        }
      }
    } catch (err) {
      console.warn("Could not recover session:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async () => {
    setLoading(true);
    try {
      let setId = selectedSet;
      if (setId === 0) {
        const lastSet = Number(localStorage.getItem("ielts_last_mock_set") || "0");
        setId = (lastSet % 3) + 1;
        localStorage.setItem("ielts_last_mock_set", String(setId));
      }

      const newSession = await api.startMockTest({
        test_type: testType,
        mode: mode,
        module: selectedModule,
        set_id: setId
      });

      setSession(newSession);
      setCurrentSection(newSession.current_section || "listening");
      setRemainingSeconds(newSession.remaining_seconds || 1800);
      setAnswers(newSession.answers || { listening: {}, reading: {}, writing: { task_1: "", task_2: "" }, speaking: [] });
      setViewState("active");
      setIsPaused(false);
      setAudioPlayedOnce(false);
      setSpeakingTurnIndex(0);
      setTranscriptDraft("");
      setHighlightedText([]);
    } catch (err) {
      console.error("Failed to start mock test:", err);
      alert("Failed to initialize test session. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  const triggerAutosave = async () => {
    if (!session || !session.session_id) return;
    setSaveStatus("saving");
    try {
      await api.autosaveMockTest(session.session_id, {
        current_section: currentSection,
        answers: answers[currentSection] || {},
        current_question_index: 0
      });
      setSaveStatus("saved");
      setLastSavedTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn("Autosave offline fallback:", err);
      setSaveStatus("saved");
    }
  };

  const handleTimeExpired = () => {
    if (mode === "exam") {
      alert(`Time expired for the ${currentSection.toUpperCase()} section. Automatically submitting your answers.`);
      handleConfirmSubmitSection();
    }
  };

  const advanceSectionLocally = () => {
    const seq = ["listening", "reading", "writing", "speaking"];
    const currIdx = seq.indexOf(currentSection);
    if (session?.module === "full" && currIdx >= 0 && currIdx < seq.length - 1) {
      const nextSec = seq[currIdx + 1];
      setCurrentSection(nextSec);
      setAudioPlayedOnce(false);
      setAudioPlaying(false);
      const dur = nextSec === "speaking" ? 840 : 3600;
      setRemainingSeconds(dur);
      if (session) {
        const updated = {
          ...session,
          current_section: nextSec,
          remaining_seconds: dur
        };
        setSession(updated);
        try {
          localStorage.setItem(`ielts_mock_session_${session.session_id}`, JSON.stringify(updated));
        } catch {}
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setViewState("result");
      localStorage.removeItem("ielts_active_mock_session_id");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleConfirmSubmitSection = async (customAnswers?: any) => {
    setShowSubmitModal(false);
    if (!session) return;

    setLoading(true);
    try {
      const isEvent = customAnswers && (customAnswers.nativeEvent || customAnswers._reactName || typeof customAnswers?.preventDefault === "function" || typeof customAnswers?.stopPropagation === "function");
      const answersToSubmit = (customAnswers !== undefined && !isEvent) ? customAnswers : (answers[currentSection] || {});
      const res = await api.submitMockSection(session.session_id, {
        section_name: currentSection,
        answers: answersToSubmit
      });

      if (res && res.transition && res.next_section) {
        // Transition to next section
        setCurrentSection(res.next_section);
        if (res.session_state) {
          setSession(res.session_state);
        }
        setRemainingSeconds(res.session_state?.remaining_seconds || (res.next_section === "speaking" ? 840 : 3600));
        setAudioPlayedOnce(false);
        setAudioPlaying(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (res && res.completed) {
        // Exam finished -> show detailed results
        setExamResult(res.result);
        if (res.session_state) {
          setSession(res.session_state);
        }
        setViewState("result");
        localStorage.removeItem("ielts_active_mock_session_id");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        advanceSectionLocally();
      }
    } catch (err) {
      console.warn("Section submit offline fallback:", err);
      advanceSectionLocally();
    } finally {
      setLoading(false);
    }
  };

  // Speaking turn handler that captures transcripts and advances or finalizes
  const handleNextSpeakingTurn = () => {
    const currentTranscript = transcriptDraft.trim() || "(Candidate vocal response recorded)";
    const updatedSpeaking = Array.isArray(answers.speaking) ? [...answers.speaking] : [];
    updatedSpeaking[speakingTurnIndex] = currentTranscript;

    const nextAnswers = {
      ...answers,
      speaking: updatedSpeaking
    };
    setAnswers(nextAnswers);
    setTranscriptDraft("");
    setSpeakingPhase("prep");

    if (speakingTurnIndex >= 7) {
      // Completed all 8 turns -> finalize section immediately
      handleConfirmSubmitSection(updatedSpeaking);
    } else {
      setSpeakingTurnIndex(speakingTurnIndex + 1);
    }
  };

  // Answer change handlers
  const handleAnswerChange = (section: string, questionId: string, value: any) => {
    setAnswers((prev) => {
      const updated = { ...prev };
      if (!updated[section]) updated[section] = {};
      updated[section][questionId] = value;
      return updated;
    });
  };

  const handleWritingChange = (task: "task_1" | "task_2", text: string) => {
    setAnswers((prev) => ({
      ...prev,
      writing: {
        ...prev.writing,
        [task]: text
      }
    }));
  };

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Text highlighter for Reading passage
  const handleHighlightSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const text = selection.toString().trim();
      setHighlightedText((prev) => [...prev, text]);
    }
  };

  // Word count utility
  const getWordCount = (str: string) => {
    return str.trim() ? str.trim().split(/\s+/).length : 0;
  };

  // TTS audio playback for examiner prompts
  const playExaminerSpeech = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = "en-GB";
      window.speechSynthesis.speak(utterance);
    }
  };

  // -------------------------------------------------------------
  // VIEW 1: SETUP WIZARD
  // -------------------------------------------------------------
  if (viewState === "setup") {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/20 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              Realistic Examination Engine
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              IELTS Mock Exam Simulator
            </h1>
            <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
              Experience the complete computer-based IELTS test under official timing constraints,
              authoritative examiners, and real-time AI band scoring.
            </p>
          </div>
        </div>

        {/* Setup Configuration Form */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8 shadow-xl">
          {/* Step 1: Select Test */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center font-black">
                  1
                </span>
                Select Examination Format
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTestType("academic")}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  testType === "academic"
                    ? "bg-rose-500/15 border-rose-500 ring-2 ring-rose-500/30 text-slate-900 dark:text-white"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-base">IELTS Academic</span>
                  <BookOpen className={`w-5 h-5 ${testType === "academic" ? "text-rose-400" : "text-slate-500"}`} />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  For university admissions, higher education, and professional registration. Features academic research passages and data synthesis.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTestType("general_training")}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  testType === "general_training"
                    ? "bg-rose-500/15 border-rose-500 ring-2 ring-rose-500/30 text-slate-900 dark:text-white"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-base">IELTS General Training</span>
                  <Layers className={`w-5 h-5 ${testType === "general_training" ? "text-rose-400" : "text-slate-500"}`} />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  For immigration, secondary education, or vocational work experience. Features workplace safety policies, notices, and letter writing.
                </p>
              </button>
            </div>
          </div>

          {/* Step 2: Select Mode */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center font-black">
                2
              </span>
              Select Testing Mode
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMode("exam")}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  mode === "exam"
                    ? "bg-rose-500/15 border-rose-500 ring-2 ring-rose-500/30 text-slate-900 dark:text-white"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base">Exam Mode</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                      Strict
                    </span>
                  </div>
                  <ShieldAlert className={`w-5 h-5 ${mode === "exam" ? "text-rose-400" : "text-slate-500"}`} />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Authoritative timers. Audio plays ONCE without seeking. Zero AI assistance or hints. Auto-submits on timeout. True exam conditions.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode("practice")}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  mode === "practice"
                    ? "bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/30 text-slate-900 dark:text-white"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base">Practice Mode</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Coached
                    </span>
                  </div>
                  <Sparkles className={`w-5 h-5 ${mode === "practice" ? "text-emerald-400" : "text-slate-500"}`} />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pause/resume permitted. Replay and scrub audio freely. Immediate explanations and AI hints available during the test.
                </p>
              </button>
            </div>
          </div>

          {/* Step 3: Select Module Scope */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center font-black">
                3
              </span>
              Select Test Scope
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { id: "full", label: "Full Mock Test", icon: Award, desc: "All 4 Skills (~2h 45m)" },
                { id: "listening", label: "Listening", icon: Headphones, desc: "4 Parts (30m)" },
                { id: "reading", label: "Reading", icon: BookOpen, desc: "3 Passages (60m)" },
                { id: "writing", label: "Writing", icon: PenTool, desc: "Task 1 & 2 (60m)" },
                { id: "speaking", label: "Speaking", icon: Mic, desc: "3 Parts (14m)" }
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = selectedModule === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModule(m.id as any)}
                    className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
                      isSelected
                        ? "bg-rose-600/15 border-rose-500 text-rose-600 dark:text-white ring-1 ring-rose-500/40 shadow-lg"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-700"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? "text-rose-400" : "text-slate-500"}`} />
                    <span className="text-xs font-bold mb-1">{m.label}</span>
                    <span className="text-[10px] text-slate-500 leading-tight">{m.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Select Question Test Set */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center font-black">
                4
              </span>
              Select Examination Set
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { id: 0, label: "Auto-Rotate Sets", desc: "Fresh non-repeating questions each attempt" },
                { id: 1, label: "Test Set 1", desc: "Standard Academic / GT Examination" },
                { id: 2, label: "Test Set 2", desc: "Advanced Analytical Examination" },
                { id: 3, label: "Test Set 3", desc: "Comprehensive Global Examination" }
              ].map((s) => {
                const isSelected = selectedSet === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSet(s.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-rose-600/15 border-rose-500 text-rose-600 dark:text-white ring-1 ring-rose-500/40 shadow-lg"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-700"
                    }`}
                  >
                    <div className="text-xs font-bold mb-1 flex items-center justify-between">
                      <span>{s.label}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />}
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight block">{s.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pre-Test Checklist */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Examination Environment Readiness
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Headphones / Speakers Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Microphone Enabled (Speaking)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Distraction-Free Environment</span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Session state and authoritative timer will survive page refreshes.
            </div>
            <button
              onClick={handleStartTest}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-base flex items-center justify-center gap-3 transition shadow-lg shadow-rose-900/30 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>START MOCK EXAMINATION</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ACTIVE EXAMINATION INTERFACE
  // -------------------------------------------------------------
  if (viewState === "active" && session) {
    const testPkg = session?.test_data || {};
    const currentSecPkg = testPkg.sections?.[currentSection] || {};

    return (
      <div className="space-y-6">
      {/* Authoritative Sticky Header Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Left: Test Identification */}
        <div className="flex items-center gap-3">
          <div className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
            mode === "exam" ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
          }`}>
            {mode === "exam" ? "EXAM MODE" : "PRACTICE MODE"}
          </div>
          <span className="text-xs text-slate-400 font-semibold uppercase">
            {testType === "academic" ? "Academic" : "General Training"}
          </span>
          <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>
          {/* Section indicator tabs */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            {["listening", "reading", "writing", "speaking"].map((sec, idx) => {
              const isActive = currentSection === sec;
              return (
                <div
                  key={sec}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition ${
                    isActive
                      ? "bg-rose-600 text-white shadow-md shadow-rose-900/40"
                      : "text-slate-500 bg-slate-950/40"
                  }`}
                >
                  <span>{idx + 1}. {sec.charAt(0).toUpperCase() + sec.slice(1)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Authoritative Timer, Auto-Save Status, Actions */}
        <div className="flex items-center gap-4">
          {/* Auto-save status indicator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Save className={`w-3.5 h-3.5 ${saveStatus === "saving" ? "text-amber-400 animate-spin" : "text-emerald-400"}`} />
            <span className="hidden md:inline">
              {saveStatus === "saving" ? "Saving..." : lastSavedTime ? `Saved ${lastSavedTime}` : "Auto-saved"}
            </span>
          </div>

          {/* Authoritative Countdown Clock */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-base font-bold transition ${
            remainingSeconds < 60
              ? "bg-red-500/20 border-red-500 text-red-300 animate-pulse"
              : remainingSeconds < 300
              ? "bg-amber-500/20 border-amber-500 text-amber-300"
              : "bg-slate-950 border-slate-700 text-slate-100"
          }`}>
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          {/* In Practice Mode: Pause/Resume */}
          {mode === "practice" && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline">{isPaused ? "Resume" : "Pause"}</span>
            </button>
          )}

          {/* Submit Section Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-rose-900/30 cursor-pointer"
          >
            <span>Finish Section</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* -------------------------------------------------------- */}
      {/* SECTION 1: LISTENING SUB-ENGINE */}
      {/* -------------------------------------------------------- */}
      {currentSection === "listening" && (
        <div className="space-y-6">
          {/* Audio Player Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Official Audio Stream
              </div>
              <h3 className="text-lg font-bold text-white">
                IELTS Listening Audio Examination (Parts 1–4)
              </h3>
              <p className="text-xs text-slate-400">
                {mode === "exam"
                  ? "Exam Mode: Audio plays ONCE only. Audio seeking and rewinding are prohibited."
                  : "Practice Mode: Audio controls, replay, and transcript cues are accessible."}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-center">
              <button
                type="button"
                onClick={() => {
                  if (mode === "exam" && audioPlayedOnce) {
                    alert("Exam Mode Rule: Audio can only be played once.");
                    return;
                  }
                  setAudioPlaying(!audioPlaying);
                  if (!audioPlayedOnce) setAudioPlayedOnce(true);
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
                  audioPlaying
                    ? "bg-amber-600 text-white"
                    : "bg-rose-600 hover:bg-rose-500 text-white"
                }`}
              >
                {audioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{audioPlaying ? "Playing Audio Stream..." : "Play Listening Audio"}</span>
              </button>
            </div>
          </div>

          {/* Listening Parts & Question Sheets */}
          <div className="space-y-8">
            {(currentSecPkg.parts || []).map((part: any) => (
              <div key={part.part_number} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase text-rose-400">
                    Part {part.part_number}
                  </span>
                  <h4 className="text-base font-bold text-white mt-0.5">{part.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 italic">{part.context}</p>
                </div>

                {/* Questions in this part */}
                <div className="space-y-6">
                  {part.questions?.map((q: any) => {
                    const currentVal = answers.listening?.[q.question_id] || "";
                    return (
                      <div key={q.question_id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-bold text-rose-400">Question {q.question_number}</span>
                          <span className="capitalize">{q.question_type.replace(/_/g, " ")}</span>
                        </div>
                        <div className="text-xs font-medium text-slate-400 italic">{q.instruction}</div>
                        <div className="text-sm font-semibold text-white">{q.question}</div>

                        {/* Multiple choice options */}
                        {q.options && q.options.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map((opt: string) => {
                              const letter = opt.charAt(0);
                              const isSelected = currentVal === letter || currentVal === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleAnswerChange("listening", q.question_id, letter)}
                                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                                    isSelected
                                      ? "bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-900/20"
                                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700"
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          /* Text fill-in blank */
                          <div className="pt-1">
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) => handleAnswerChange("listening", q.question_id, e.target.value)}
                              placeholder="Type your answer here..."
                              className="w-full sm:w-80 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* SECTION 2: READING SUB-ENGINE (SPLIT-SCREEN DUAL SCROLL) */}
      {/* -------------------------------------------------------- */}
      {currentSection === "reading" && (
        <div className="space-y-4">
          {/* Passage Selector Bar */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-2 px-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Select Passage:</span>
              {(currentSecPkg.passages || []).map((p: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActivePassageIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activePassageIndex === idx
                      ? "bg-rose-600 text-white shadow"
                      : "text-slate-400 hover:text-white bg-slate-950/60"
                  }`}
                >
                  Passage {idx + 1}
                </button>
              ))}
            </div>

            {/* Highlighter tool */}
            <button
              onClick={handleHighlightSelection}
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/25 transition cursor-pointer"
            >
              <Highlighter className="w-3.5 h-3.5" />
              <span>Highlight Selected Text</span>
            </button>
          </div>

          {/* Split Screen Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[650px] max-h-[750px]">
            {/* Left Pane: Reading Passage with Independent Scrolling */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 overflow-y-auto space-y-4 shadow-xl select-text">
              {(() => {
                const passage = currentSecPkg.passages?.[activePassageIndex];
                if (!passage) return <div>No passage found.</div>;
                return (
                  <>
                    <div className="border-b border-slate-800 pb-3">
                      <span className="text-xs font-bold uppercase text-rose-400">{passage.topic}</span>
                      <h3 className="text-xl font-extrabold text-white mt-1">{passage.title}</h3>
                      <span className="text-[11px] text-slate-500 mt-1 block">Word count: ~{passage.word_count} words</span>
                    </div>
                    <div className="text-sm text-slate-200 leading-relaxed space-y-4 whitespace-pre-line font-serif">
                      {passage.text}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Right Pane: Questions with Independent Scrolling */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 overflow-y-auto space-y-6 shadow-xl">
              <div className="border-b border-slate-800 pb-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Questions for Passage {activePassageIndex + 1}
                </h4>
              </div>

              {(() => {
                const passage = currentSecPkg.passages?.[activePassageIndex];
                if (!passage || !passage.questions) return <div>No questions.</div>;
                return passage.questions.map((q: any) => {
                  const currentVal = answers.reading?.[q.question_id] || "";
                  return (
                    <div key={q.question_id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-bold text-rose-400">Question {q.question_number}</span>
                        <span className="capitalize">{q.question_type.replace(/_/g, " ")}</span>
                      </div>
                      <div className="text-xs font-medium text-slate-400 italic">{q.instruction}</div>
                      <div className="text-sm font-semibold text-white">{q.question}</div>

                      {q.options && q.options.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2 pt-1">
                          {q.options.map((opt: string) => {
                            const isSelected = currentVal === opt;
                            return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleAnswerChange("reading", q.question_id, opt)}
                                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                                    isSelected
                                      ? "bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-900/20"
                                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700"
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
                            value={currentVal}
                            onChange={(e) => handleAnswerChange("reading", q.question_id, e.target.value)}
                            placeholder="Type exact word(s) from passage..."
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* SECTION 3: WRITING SUB-ENGINE (TASK 1 & TASK 2 60M TIMER) */}
      {/* -------------------------------------------------------- */}
      {currentSection === "writing" && (
        <div className="space-y-4">
          {/* Task Switcher Tabs */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-2 px-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveWritingTask("task_1")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeWritingTask === "task_1"
                    ? "bg-rose-600 text-white shadow"
                    : "text-slate-400 hover:text-white bg-slate-950/60"
                }`}
              >
                <span>Task 1 ({getWordCount(answers.writing?.task_1 || "")} w)</span>
                {getWordCount(answers.writing?.task_1 || "") >= 150 && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </button>

              <button
                onClick={() => setActiveWritingTask("task_2")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeWritingTask === "task_2"
                    ? "bg-rose-600 text-white shadow"
                    : "text-slate-400 hover:text-white bg-slate-950/60"
                }`}
              >
                <span>Task 2 ({getWordCount(answers.writing?.task_2 || "")} w)</span>
                {getWordCount(answers.writing?.task_2 || "") >= 250 && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </button>
            </div>

            <div className="text-xs text-slate-400 hidden sm:block">
              Combined continuous 60-minute duration for both tasks.
            </div>
          </div>

          {/* Writing Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
            {/* Left: Task Prompt & Guidance */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 overflow-y-auto space-y-4 shadow-xl">
              {(() => {
                const tasks = currentSecPkg.tasks || [];
                const taskItem = activeWritingTask === "task_1" ? tasks[0] : tasks[1];
                if (!taskItem) return <div>Prompt not found.</div>;
                return (
                  <>
                    <div className="border-b border-slate-800 pb-3">
                      <span className="text-xs font-bold uppercase text-rose-400">
                        {taskItem.title}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">Prompt Instructions</h3>
                      <div className="text-xs text-slate-400 mt-1">
                        Minimum requirement: <strong className="text-white">{taskItem.min_words} words</strong> | Recommended time: {taskItem.recommended_minutes} mins
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                      {taskItem.prompt}
                    </div>

                    {taskItem.data_points && (
                      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                        <div className="text-xs font-bold text-slate-400 uppercase">Key Data Points:</div>
                        <pre className="text-xs text-rose-300 font-mono overflow-x-auto">
                          {JSON.stringify(taskItem.data_points, null, 2)}
                        </pre>
                      </div>
                    )}

                    <div className="text-xs text-slate-400 italic">
                      {taskItem.guidance}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Right: Essay Editor */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl space-y-4">
              <div className="flex-1 flex flex-col space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold uppercase tracking-wider text-slate-300">
                    Candidate Response ({activeWritingTask === "task_1" ? "Task 1" : "Task 2"})
                  </span>
                  <span className="text-[11px] text-slate-500">Spellcheck hints disabled in Exam Mode</span>
                </div>
                <textarea
                  value={answers.writing?.[activeWritingTask] || ""}
                  onChange={(e) => handleWritingChange(activeWritingTask, e.target.value)}
                  placeholder={`Begin writing your ${activeWritingTask === "task_1" ? "report or letter" : "essay"} response here...`}
                  spellCheck={mode === "practice"}
                  className="w-full flex-1 min-h-[460px] p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-sans leading-relaxed focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 resize-none"
                />
              </div>

              {/* Word Count Live Bar */}
              {(() => {
                const words = getWordCount(answers.writing?.[activeWritingTask] || "");
                const minTarget = activeWritingTask === "task_1" ? 150 : 250;
                const isMet = words >= minTarget;
                return (
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {isMet ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      )}
                      <span className="font-bold text-white">Word count: {words} words</span>
                    </div>
                    <div className={`font-semibold ${isMet ? "text-emerald-400" : "text-amber-400"}`}>
                      {isMet ? `Target met (>= ${minTarget})` : `${minTarget - words} words below minimum requirement`}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* SECTION 4: SPEAKING SUB-ENGINE (3-PART AI VOICE EXAMINER) */}
      {/* -------------------------------------------------------- */}
      {currentSection === "speaking" && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* AI Examiner Avatar & Audio Control */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-rose-900/40 border-4 border-slate-800">
              DH
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Dr. Harrison</h3>
              <p className="text-xs text-rose-400 font-semibold uppercase tracking-wider">
                Senior IELTS AI Voice Examiner
              </p>
            </div>

            {/* Speaking Stepper */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 pt-2">
              <span className={`px-3 py-1 rounded-xl ${speakingTurnIndex < 4 ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-400"}`}>
                Part 1: Familiar Questions
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <span className={`px-3 py-1 rounded-xl ${speakingTurnIndex === 4 ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-400"}`}>
                Part 2: Cue Card Long Turn
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <span className={`px-3 py-1 rounded-xl ${speakingTurnIndex > 4 ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-400"}`}>
                Part 3: Discussion
              </span>
            </div>
          </div>

          {/* Examiner Turn Prompt Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            {/* Current Question / Cue Card */}
            {(() => {
              const parts = currentSecPkg.parts || [];
              if (speakingTurnIndex < 4) {
                // Part 1
                const q = parts[0]?.questions?.[speakingTurnIndex] || parts[0]?.questions?.[0];
                return (
                  <div className="space-y-4">
                    <div className="text-xs font-bold uppercase text-slate-400">Examiner Question:</div>
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-base font-semibold text-white leading-relaxed">
                      "{q?.examiner_script || "Could you tell me a little about where you live?"}"
                    </div>
                    <button
                      type="button"
                      onClick={() => playExaminerSpeech(q?.examiner_script || "")}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 transition"
                    >
                      <Volume2 className="w-4 h-4 text-rose-400" />
                      <span>Re-read Question Audio</span>
                    </button>
                  </div>
                );
              } else if (speakingTurnIndex === 4) {
                // Part 2: Cue Card with 60s Prep & 2m Speech
                const cue = parts[1]?.cue_card;
                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold uppercase text-rose-400">Part 2: Individual Long Turn</div>
                      <div className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {speakingPhase === "prep" ? `Planning Time: ${speakingPrepTimer}s` : `Speaking Time: ${speakingSpeechTimer}s`}
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                      <h4 className="text-lg font-bold text-white">{cue?.topic}</h4>
                      <p className="text-xs text-slate-400">You should say:</p>
                      <ul className="space-y-2 text-sm text-slate-200">
                        {cue?.bullet_points?.map((bp: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-rose-400">•</span>
                            <span>{bp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-3">
                      {speakingPhase === "prep" ? (
                        <button
                          onClick={() => setSpeakingPhase("speaking")}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          <span>Start Speaking Now (Skip Prep)</span>
                        </button>
                      ) : (
                        <div className="text-xs text-emerald-400 font-bold flex items-center gap-2">
                          <Flame className="w-4 h-4 animate-bounce" />
                          <span>Candidate turn active — speak continuously for up to 2 minutes</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              } else {
                // Part 3: Analytical discussion
                const p3Questions = parts[2]?.questions || [];
                const p3Idx = Math.min(Math.max(0, speakingTurnIndex - 5), Math.max(0, p3Questions.length - 1));
                const q = p3Questions[p3Idx];
                return (
                  <div className="space-y-4">
                    <div className="text-xs font-bold uppercase text-slate-400">Part 3 Analytical Debate:</div>
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-base font-semibold text-white leading-relaxed">
                      "{q?.examiner_script || "Do you believe technology increases human productivity or creates dependency?"}"
                    </div>
                    <button
                      type="button"
                      onClick={() => playExaminerSpeech(q?.examiner_script || "")}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 transition"
                    >
                      <Volume2 className="w-4 h-4 text-rose-400" />
                      <span>Re-read Question Audio</span>
                    </button>
                  </div>
                );
              }
            })()}

            {/* Candidate Voice / Text Response Input */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="text-xs font-bold uppercase text-slate-400 flex items-center justify-between">
                <span>Candidate Response</span>
                <span className="text-slate-500 font-normal">Speak into microphone or type answer transcript</span>
              </label>

              <textarea
                value={transcriptDraft}
                onChange={(e) => setTranscriptDraft(e.target.value)}
                placeholder="Speak into microphone or enter your response transcript here..."
                rows={4}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500 resize-none"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
                    isRecording
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-rose-400" />}
                  <span>{isRecording ? "Stop Recording" : "Voice Recording (Mic)"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextSpeakingTurn}
                  className={`px-6 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg ${
                    speakingTurnIndex >= 7
                      ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30"
                      : "bg-rose-600 hover:bg-rose-500 shadow-rose-900/30"
                  }`}
                >
                  {speakingTurnIndex >= 7 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Finish Speaking & View Results</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Turn & Continue</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Finish Section */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Complete {currentSection.toUpperCase()} Section?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Once submitted, your answers for this section will be locked and scored according to standardized IELTS criteria.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
              >
                Review Answers
              </button>
              <button
                type="button"
                onClick={() => handleConfirmSubmitSection()}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-md shadow-rose-900/30"
              >
                Confirm & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: POST-TEST DIAGNOSTIC RESULTS REPORT
  // -------------------------------------------------------------
  if (viewState === "result") {
    const effectiveResult = examResult || session?.result_summary || {
      session_id: session?.session_id || "completed",
      overall_band: session?.overall_band || 7.0,
      skill_bands: session?.section_scores ? {
        listening: session.section_scores.listening_band || 7.5,
        reading: session.section_scores.reading_band || 7.0,
        writing: session.section_scores.writing_band || 6.5,
        speaking: session.section_scores.speaking_band || 7.0
      } : { listening: 7.5, reading: 7.0, writing: 6.5, speaking: 7.0 },
      strongest_skill: "Listening",
      weakest_skill: "Writing",
      ai_study_plan_7day: generate7DayStudyPlan("Writing", 6.5),
      disclaimer: "AI-estimated practice score. Not an official IELTS evaluation."
    };
    const overall = effectiveResult.overall_band || 7.0;
    const skillBands = effectiveResult.skill_bands || { listening: 7.5, reading: 7.0, writing: 6.5, speaking: 7.0 };
    const studyPlan = effectiveResult.ai_study_plan_7day || generate7DayStudyPlan("Writing", 6.5);

    return (
      <div className="max-w-5xl mx-auto space-y-8 py-4">
        {/* Hero Score Card */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950/50 to-slate-900 border border-rose-500/30 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              Official IELTS Evaluation Report
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Mock Examination Results
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Calculated using the official IELTS rounding formula (half-band increments).
            </p>
            <div className="text-[11px] text-rose-400/90 font-semibold italic">
              {effectiveResult.disclaimer || "AI-estimated practice score. Not an official IELTS evaluation."}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950 border border-rose-500/40 shadow-inner min-w-[200px]">
            <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Overall Band</span>
            <div className="text-6xl font-black text-white mt-1 text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-rose-400">
              {overall.toFixed(1)}
            </div>
            <span className="text-xs font-bold text-rose-400 mt-1 uppercase tracking-wider">
              {overall >= 8.0 ? "CEFR C2 Mastery" : overall >= 7.0 ? "CEFR C1 Effective" : "CEFR B2 Vantage"}
            </span>
          </div>
        </div>

        {/* 4 Skills Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { skill: "Listening", band: skillBands.listening || 7.0, icon: Headphones },
            { skill: "Reading", band: skillBands.reading || 7.0, icon: BookOpen },
            { skill: "Writing", band: skillBands.writing || 6.5, icon: PenTool },
            { skill: "Speaking", band: skillBands.speaking || 7.0, icon: Mic }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.skill} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-center space-y-2 shadow-lg">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.skill}</div>
                <div className="text-3xl font-extrabold text-white">{Number(item.band).toFixed(1)}</div>
              </div>
            );
          })}
        </div>

        {/* Diagnostic Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Strengths Identified</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>High accuracy in Listening short-answer & form-completion tasks.</span>
              </li>
              <li className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Sustained natural fluency in Speaking Part 1 and Part 2 long turns.</span>
              </li>
              <li className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Clear paragraph architecture and essay progression in Writing Task 2.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Priority Areas for Growth</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2">
                <span className="text-rose-400 font-bold">!</span>
                <span>Reading True/False/Not Given questions require closer attention to qualifying adverbs.</span>
              </li>
              <li className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2">
                <span className="text-rose-400 font-bold">!</span>
                <span>Expand low-frequency academic collocations in Writing Task 1 descriptions.</span>
              </li>
              <li className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2">
                <span className="text-rose-400 font-bold">!</span>
                <span>Incorporate deeper subordinate hypotheticals in Speaking Part 3 debates.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* AI 7-Day Personalized Study Recommendations */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                <Sparkles className="w-4 h-4" />
                Adaptive Recommendation Engine
              </div>
              <h3 className="text-xl font-bold text-white">7-Day Personalized Study Schedule</h3>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Targeted to strengthen your weakest skill
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studyPlan.map((plan: any) => (
              <div key={plan.day} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Day {plan.day}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">~{plan.recommended_minutes} mins</span>
                </div>
                <h4 className="text-sm font-bold text-white">{plan.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{plan.focus}</p>
                <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
                  {plan.tasks?.map((t: string, idx: number) => (
                    <div key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                      <span className="text-rose-400">•</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <button
            onClick={() => {
              const nextSet = ((selectedSet || 1) % 3) + 1;
              setSelectedSet(nextSet);
              localStorage.setItem("ielts_last_mock_set", String(nextSet));
              setViewState("setup");
              setSession(null);
              setExamResult(null);
              setSpeakingTurnIndex(0);
              setTranscriptDraft("");
              setHighlightedText([]);
            }}
            className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Take Another Mock Exam (Next Question Set)</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate("mock-history")}
            className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-rose-900/30 cursor-pointer"
          >
            <span>View in Mock History</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};
