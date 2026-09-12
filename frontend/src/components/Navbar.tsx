import React from "react";
import { GraduationCap, LogIn, LogOut, User as UserIcon, Shield } from "lucide-react";

interface NavbarProps {
  user: any;
  onLoginClick: () => void;
  onLogout: () => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onLogout, activeTab }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-rose-600 text-white p-2 rounded-xl flex items-center justify-center shadow-lg shadow-rose-600/30">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg tracking-tight text-white">IELTS AI Coach</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/30">
              Academic & General
            </span>
          </div>
          <p className="text-xs text-slate-400">Personalized Preparation with ML & Voice AI</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-200">{user.full_name || user.email}</p>
              <p className="text-xs text-emerald-400 font-medium">Target: Band {user.target_band || 7.5}</p>
            </div>
            {user.role === "admin" && (
              <span className="flex items-center gap-1 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                <Shield className="w-3.5 h-3.5" /> Admin
              </span>
            )}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-rose-500/30 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl shadow-lg shadow-rose-600/30 transition"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Demo</span>
          </button>
        )}
      </div>
    </header>
  );
};
