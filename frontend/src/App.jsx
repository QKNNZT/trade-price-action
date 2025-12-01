// src/App.jsx
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import TradeLog from "./pages/TradeLog";
import Dashboard from "./pages/Dashboard";
import MonthlyReview from "./pages/Monthly";
import Journal from "./pages/Journal";
import Backtest from "./pages/Backtest";
import Playbook from "./pages/Playbook";
import "./chartSetup.js";

const toastOptions = {
  duration: 4000,
  style: {
    background: "#1f2937",
    color: "#e5e7eb",
    fontSize: "14px",
    borderRadius: "12px",
    padding: "12px 16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  success: {
    icon: "Success",
    style: { background: "#10b981", color: "white" },
  },
  error: {
    icon: "Error",
    style: { background: "#ef4444", color: "white" },
  },
};

export default function App() {
  // ====== THEME STATE ======
  const [theme, setTheme] = useState(() => {
    // mặc định là dark, nếu localStorage chưa có gì
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  return (
    <Router future={{ v7_startTransition: true }}>
      <div
        className={`flex min-h-screen transition-colors duration-200 ${
          isDark ? "bg-slate-900 text-slate-50" : "bg-slate-100 text-slate-900"
        }`}
      >
        {/* Truyền theme & toggle xuống Sidebar */}
        <Sidebar theme={theme} onToggleTheme={toggleTheme} />

        <div className="p-8 flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<TradeLog theme={theme} />} />
            <Route path="/dashboard" element={<Dashboard theme={theme} />} />
            <Route path="/monthly" element={<MonthlyReview theme={theme} />} />
            <Route path="/journal" element={<Journal theme={theme} />} />
            <Route path="/backtest" element={<Backtest theme={theme} />} />
            <Route path="/playbook" element={<Playbook theme={theme} />} />
          </Routes>
        </div>
      </div>

      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        containerStyle={{ margin: "16px" }}
        toastOptions={toastOptions}
      />
    </Router>
  );
}
