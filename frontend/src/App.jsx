import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TradeLog from "./pages/TradeLog";
import Dashboard from "./pages/Dashboard";
import MonthlyReview from "./pages/Monthly";
import Journal from "./pages/Journal";
import Backtest from "./pages/Backtest";
import Statistics from "./pages/Statistics";
import Playbook from "./pages/Playbook";
import "./chartSetup.js";
export default function App() {
  return (
    <Router future={{ v7_startTransition: true }}>
      <div className="flex">
        <Sidebar />

        <div className=" p-8 w-full bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/" element={<TradeLog />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/monthly" element={<MonthlyReview />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/backtest" element={<Backtest />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/playbook" element={<Playbook />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
