import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Database,
  ShieldCheck,
  TrendingUp
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isAdmin }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: "ML" },
    { id: "reading", label: "Reading Practice", icon: BookOpen },
    { id: "listening", label: "Listening Practice", icon: Headphones },
    { id: "writing", label: "Writing Evaluator", icon: PenTool, badge: "AI" },
    { id: "speaking", label: "Voice Speaking AI", icon: Mic, badge: "Voice" },
    { id: "ai-tutor", label: "AI IELTS Tutor", icon: Sparkles, badge: "RAG" },
    { id: "vocabulary", label: "Vocabulary AWL", icon: Bookmark },
    { id: "grammar", label: "Grammar Drills", icon: CheckCircle2 },
    { id: "practice", label: "Questions Bank", icon: Database },
  ];

  if (isAdmin) {
    navItems.push({ id: "admin", label: "Admin Panel", icon: ShieldCheck, badge: "Sys" });
  }

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between py-4 select-none shrink-0">
      <div className="space-y-1 px-3">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Preparation Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-rose-600/15 text-rose-400 border border-rose-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-rose-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    isActive ? "bg-rose-500/30 text-rose-300" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="px-4 pt-4 border-t border-slate-800 text-center">
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
          <p className="text-[11px] text-slate-400">Official IELTS Descriptors</p>
          <p className="text-xs font-semibold text-slate-300 mt-1">CEFR C1 / C2 Aligned</p>
          <div className="mt-2 text-[10px] text-rose-400/80">AI Practice Estimates Only</div>
        </div>
      </div>
    </aside>
  );
};
