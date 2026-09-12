import React, { useState } from "react";
import { X, Lock, Mail, User as UserIcon, Shield, CheckCircle } from "lucide-react";
import { api } from "../api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [targetBand, setTargetBand] = useState(7.5);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const res = await api.register({
          email,
          password,
          full_name: fullName,
          target_band: targetBand,
        });
        localStorage.setItem("ielts_token", res.access_token);
        onSuccess(res.user);
      } else {
        const res = await api.login({ email, password });
        localStorage.setItem("ielts_token", res.access_token);
        onSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (demoType: "student" | "admin") => {
    if (demoType === "student") {
      setEmail("student@ielts.com");
      setPassword("password123");
      setIsRegister(false);
    } else {
      setEmail("admin@ielts.com");
      setPassword("admin123");
      setIsRegister(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {isRegister ? "Create IELTS AI Account" : "Sign In to IELTS AI Coach"}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Access personalized diagnostic scoring and historical tracking
          </p>
        </div>

        {/* Quick Demo Logins */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Quick 1-Click Demo Logins:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo("student")}
              className="text-xs p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-slate-200 font-semibold transition text-left flex items-center justify-between"
            >
              <span>Demo Student</span>
              <span className="text-[10px] text-emerald-400">7.5 Target</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo("admin")}
              className="text-xs p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-slate-200 font-semibold transition text-left flex items-center justify-between"
            >
              <span>Demo Admin</span>
              <span className="text-[10px] text-amber-400">Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="mt-1 flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
                <UserIcon className="w-4 h-4 text-slate-500 mr-2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-transparent w-full text-slate-200 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="mt-1 flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
              <Mail className="w-4 h-4 text-slate-500 mr-2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent w-full text-slate-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="mt-1 flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
              <Lock className="w-4 h-4 text-slate-500 mr-2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent w-full text-slate-200 outline-none"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-slate-300">Target IELTS Band (5.0 - 9.0)</label>
              <input
                type="number"
                step="0.5"
                min="5.0"
                max="9.0"
                value={targetBand}
                onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-600/30 transition mt-2"
          >
            {loading ? "Processing..." : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-xs text-slate-400 hover:text-white"
          >
            {isRegister ? "Already have an account? Sign In" : "Need an account? Register free"}
          </button>
        </div>
      </div>
    </div>
  );
};
