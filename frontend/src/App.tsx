import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ReadingPage } from "./pages/ReadingPage";
import { ListeningPage } from "./pages/ListeningPage";
import { WritingPage } from "./pages/WritingPage";
import { SpeakingPage } from "./pages/SpeakingPage";
import { AITutorPage } from "./pages/AITutorPage";
import { VocabularyPage } from "./pages/VocabularyPage";
import { GrammarPage } from "./pages/GrammarPage";
import { PracticeBankPage } from "./pages/PracticeBankPage";
import { AdminPage } from "./pages/AdminPage";
import { api } from "./api";

export function App() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    const token = localStorage.getItem("ielts_token");
    if (!token) {
      setUser(null);
      setCheckingAuth(false);
      return;
    }

    try {
      const u = await api.getMe();
      setUser(u);
    } catch (err) {
      console.warn("Token expired or invalid:", err);
      localStorage.removeItem("ielts_token");
      localStorage.removeItem("ielts_active_email");
      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ielts_token");
    localStorage.removeItem("ielts_active_email");
    setUser(null);
    setActiveTab("dashboard");
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
          <span className="text-xs text-slate-400">Initializing IELTS AI Coach...</span>
        </div>
      </div>
    );
  }

  // Dedicated Login & Registration Page when not authenticated
  if (!user) {
    return <LoginPage onLoginSuccess={(u) => setUser(u)} />;
  }

  const isAdmin = user.role === "admin";

  const renderActivePage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage onNavigate={setActiveTab} />;
      case "reading":
        return <ReadingPage />;
      case "listening":
        return <ListeningPage />;
      case "writing":
        return <WritingPage />;
      case "speaking":
        return <SpeakingPage />;
      case "ai-tutor":
        return <AITutorPage />;
      case "vocabulary":
        return <VocabularyPage />;
      case "grammar":
        return <GrammarPage />;
      case "practice":
        return <PracticeBankPage />;
      case "admin":
        return isAdmin ? <AdminPage /> : <DashboardPage onNavigate={setActiveTab} />;
      default:
        return <DashboardPage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <Navbar
        user={user}
        onLoginClick={() => {}}
        onLogout={handleLogout}
        activeTab={activeTab}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdmin={isAdmin}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950/60">
          <div className="max-w-7xl mx-auto">
            {renderActivePage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
