import React, { useState } from "react";
import { GraduationCap, Mail, Lock, User as UserIcon, Shield, Sparkles, ArrowRight, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "../api";

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [targetBand, setTargetBand] = useState<number>(7.5);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        if (!email.trim() || !password.trim() || !fullName.trim()) {
          throw new Error("Please fill in all required fields.");
        }
        // Public registration strictly creates Learner accounts
        const res = await api.register({
          email: email.trim().toLowerCase(),
          password,
          full_name: fullName.trim(),
          target_band: targetBand,
          role: "learner",
        });
        localStorage.setItem("ielts_token", res.access_token);
        onLoginSuccess(res.user);
      } else {
        if (!email.trim() || !password.trim()) {
          throw new Error("Please enter both email and password.");
        }
        const res = await api.login({
          email: email.trim().toLowerCase(),
          password,
        });
        localStorage.setItem("ielts_token", res.access_token);
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setError("");
    setLoading(true);
    try {
      const res = await api.login({ email: demoEmail, password: demoPass });
      localStorage.setItem("ielts_token", res.access_token);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || "Failed to sign in with demo account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-rose-600 text-white rounded-2xl shadow-xl shadow-rose-600/30 mb-1">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            IELTS AI Coach
          </h1>
          <p className="text-xs text-slate-400">
            Real-Time AI-Powered IELTS Academic & General Training Platform
          </p>
        </div>

        {/* Quick Demo Selector Card */}
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1-Click Demo Profiles
            </span>
            <span className="text-[10px] text-slate-500 font-normal">Click to test instantly</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("newlearner@ielts.com", "learner123")}
              className="w-full text-left p-2.5 bg-slate-950/80 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-500 rounded-xl transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300">
                    New Learner (Fresh Account — 0 Tests)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    newlearner@ielts.com • Zero-state (--) on dashboard
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-semibold shrink-0">
                0 Tests
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("priya.patel@ielts.com", "learner123")}
              className="w-full text-left p-2.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 rounded-xl transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-blue-300">
                    Learner with History (Priya Patel)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    priya.patel@ielts.com • Active Band 7.5 profile
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-semibold shrink-0">
                6 Tests
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("admin@ielts.com", "admin123")}
              className="w-full text-left p-2.5 bg-slate-950/80 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-500 rounded-xl transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                <div>
                  <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200 flex items-center gap-1.5">
                    <span>Sole System Administrator</span>
                    <Shield className="w-3 h-3 text-amber-400" />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    admin@ielts.com • Real-time monitoring & learner cohort
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold shrink-0">
                Single Admin
              </span>
            </button>
          </div>
        </div>

        {/* Auth Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
              }}
              className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                mode === "signin"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                mode === "register"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Create Learner Account
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-xs text-rose-400 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Full Name
                  </label>
                  <div className="flex items-center bg-slate-950 border border-slate-800 focus-within:border-rose-500 rounded-xl px-3 py-2.5 text-xs">
                    <UserIcon className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-transparent w-full text-slate-200 outline-none placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Learner Account Badge Notice */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-2.5 flex items-center gap-2 text-[11px] text-blue-300">
                  <BookOpen className="w-4 h-4 shrink-0 text-blue-400" />
                  <span>
                    Registering as a <strong>Learner</strong>. All exams, writing submissions, and speaking evaluations are stored in your personal record.
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Target Band Score
                    </label>
                    <span className="text-xs font-bold text-emerald-400">Band {targetBand.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="9.0"
                    step="0.5"
                    value={targetBand}
                    onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>5.0 (Modest)</span>
                    <span>6.5 (Competent)</span>
                    <span>7.5 (Good)</span>
                    <span>9.0 (Expert)</span>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Email Address
              </label>
              <div className="flex items-center bg-slate-950 border border-slate-800 focus-within:border-rose-500 rounded-xl px-3 py-2.5 text-xs">
                <Mail className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="candidate@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent w-full text-slate-200 outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Password
              </label>
              <div className="flex items-center bg-slate-950 border border-slate-800 focus-within:border-rose-500 rounded-xl px-3 py-2.5 text-xs">
                <Lock className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent w-full text-slate-200 outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : mode === "register" ? (
                <>
                  <span>Create Learner Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Sign In with Email</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "register" : "signin");
                setError("");
              }}
              className="text-xs text-slate-400 hover:text-white transition underline underline-offset-4 cursor-pointer"
            >
              {mode === "signin"
                ? "Don't have an account? Register free as a Learner"
                : "Already have an account? Sign in here"}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-slate-500">
          IELTS is a registered trademark of Cambridge University Press & Assessment, the British Council, and IDP: IELTS Australia.
        </p>
      </div>
    </div>
  );
};
