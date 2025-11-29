// App.jsx
import { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // <-- THÊM
import TradeLog from "./pages/TradeLog";
import Dashboard from "./pages/Dashboard";
import MonthlyReview from "./pages/Monthly";
import Journal from "./pages/Journal";
import Backtest from "./pages/Backtest";
import Playbook from "./pages/Playbook";
import "./chartSetup.js";

// Optional: Tự động ẩn toast sau 4s, style đẹp
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
  return (
    <Router future={{ v7_startTransition: true }}>
      <div className="flex">
        <Sidebar />

        <div className="p-8 w-full bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/" element={<TradeLog />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/monthly" element={<MonthlyReview />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/backtest" element={<Backtest />} />
            <Route path="/playbook" element={<Playbook />} />
          </Routes>
        </div>
      </div>

      {/* TOASTER – HIỂN THỊ TOAST TOÀN APP */}
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