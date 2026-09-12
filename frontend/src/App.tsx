import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { AuthModal } from "./components/AuthModal";
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
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    const token = localStorage.getItem("ielts_token");
    if (!token) {
      // Auto sign in as Demo Student for seamless guest exploration
      try {
        const demo = await api.login({ email: "student@ielts.com", password: "password123" });
        localStorage.setItem("ielts_token", demo.access_token);
        setUser(demo.user);
      } catch (err) {
        console.warn("Demo auto-login notice:", err);
      }
      return;
    }

    try {
      const u = await api.getMe();
      setUser(u);
    } catch (err) {
      console.warn("Token expired or invalid:", err);
      localStorage.removeItem("ielts_token");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ielts_token");
    setUser(null);
  };

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
        return <AdminPage />;
      default:
        return <DashboardPage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <Navbar
        user={user}
        onLoginClick={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdmin={user?.role === "admin"}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950/60">
          <div className="max-w-7xl mx-auto">
            {renderActivePage()}
          </div>
        </main>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(u) => setUser(u)}
      />
    </div>
  );
}

export default App;
