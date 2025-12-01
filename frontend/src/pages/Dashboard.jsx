import { useState } from "react";
import useDashboardStats from "../hooks/useDashboardStats";
import useTrades from "../hooks/useTrades";

import GradeStats from "../components/dashboard/GradeStats";
import MonthlyPnL from "../components/dashboard/MonthlyPnL";
import DrawdownChart from "../components/dashboard/DrawdownChart";
import { calcDrawdown } from "../utils/calcStats";

import StatsCards from "../components/dashboard/StatsCards";
import EquityCurve from "../components/dashboard/EquityCurve";
import WinrateBySetup from "../components/dashboard/WinrateBySetup";
import MistakesAnalysis from "../components/dashboard/MistakesAnalysis";
import SessionStats from "../components/dashboard/SessionStats";
import TimeframeStats from "../components/dashboard/TimeframeStats";
import SetupTable from "../components/dashboard/SetupTable";

export default function Dashboard({ theme = "dark" }) {
  const isDark = theme === "dark";

  // Filter thời gian cho backend stats
  const [filter, setFilter] = useState("Last 6M");

  // Filter nâng cao
  const [symbolFilter, setSymbolFilter] = useState("All");
  const [setupFilter, setSetupFilter] = useState("All");
  const [sessionFilter, setSessionFilter] = useState("All");
  const [timeframeFilter, setTimeframeFilter] = useState("All");

  // Dùng toàn bộ trades để lấy list value cho dropdown
  const allTrades = useTrades();

  // Tất cả stats chính lấy từ backend (đã filter theo thời gian + advanced filters)
  const {
    overview,
    equityCurve,
    bySetup,
    bySession,
    byTimeframe,
    byGrade,
    monthlyPnl,
    mistakes,
    loading: statsLoading,
    error: statsError,
  } = useDashboardStats(filter, {
    symbol: symbolFilter,
    setup: setupFilter,
    session: sessionFilter,
    timeframe: timeframeFilter,
  });

  // Lấy list giá trị duy nhất cho dropdown từ toàn bộ trades
  const uniqueValues = (key) => {
    const set = new Set();
    allTrades.forEach((t) => {
      if (t[key]) set.add(t[key]);
    });
    return Array.from(set).sort();
  };

  const symbols = uniqueValues("symbol");
  const setups = uniqueValues("setup");
  const sessions = uniqueValues("session");
  const timeframes = uniqueValues("timeframe");

  // Loading state
  if (statsLoading && !overview) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDark ? "bg-[#0B0E11]" : "bg-slate-50"
        }`}
      >
        <div
          className={`text-2xl animate-pulse ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Loading Pro Dashboard...
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDark ? "bg-[#0B0E11]" : "bg-slate-50"
        }`}
      >
        <div
          className={`text-2xl ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          No stats available yet. Add some trades to see the magic ✨
        </div>
      </div>
    );
  }

  // Equity curve theo R từ backend
  const equityR = equityCurve.map((p) => p.equity_r);
  const { drawdowns, maxDrawdown } = calcDrawdown(equityR);

  // Map overview -> StatsCards
  const totalTrades = overview.total_trades;
  const winrate = overview.winrate; // %
  const totalProfit = overview.net_profit; // $
  const avgR = overview.avg_r; // R
  const expectancy = overview.expectancy_profit; // $/trade
  const profitFactor = overview.profit_factor; // số hoặc null

  // Map bySetup (array) -> object cho SetupTable & WinrateBySetup
  const statsBySetup = bySetup.reduce((acc, item) => {
    const key = item.key || "Unknown";
    const s = item.stats;
    acc[key] = {
      trades: s.total_trades,
      win: s.win_trades,
      rr: s.net_r,
      profit: s.net_profit,
    };
    return acc;
  }, {});

  // Map bySession -> { [session]: { win, total } }
  const sessionMap = bySession.reduce((acc, item) => {
    const key = item.key || "Unknown";
    const s = item.stats;
    acc[key] = {
      win: s.win_trades,
      total: s.total_trades,
    };
    return acc;
  }, {});

  // Map byTimeframe -> { [tf]: { win, total } }
  const timeframeMap = byTimeframe.reduce((acc, item) => {
    const key = item.key || "Unknown";
    const s = item.stats;
    acc[key] = {
      win: s.win_trades,
      total: s.total_trades,
    };
    return acc;
  }, {});

  // Map byGrade -> { [grade]: { winrate, trades, avgR } }
  const gradeMap = (byGrade || []).reduce((acc, item) => {
    const key = item.key || "N/A";
    const s = item.stats;
    acc[key] = {
      winrate: s.winrate,
      trades: s.total_trades,
      avgR: s.avg_r,
    };
    return acc;
  }, {});

  // ─────────────────────────────────────────
  // LAYOUT GIỐNG MONTHLY (NO HORIZONTAL SCROLL)
  // ─────────────────────────────────────────
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-[#0B0E11] text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      } p-6`} // ✨ thêm p-6 giống Monthly.jsx
    >
      {/* Container giống Monthly: w-full + padding, KHÔNG max-w */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#F0B90B] via-amber-400 to-yellow-500 bg-clip-text text-transparent">
            PRO TRADING DASHBOARD
          </h1>
          <p
            className={`mt-3 text-lg ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {totalTrades} trades •{" "}
            <span className="text-[#F0B90B] font-semibold">{filter}</span>
          </p>
          {statsError && (
            <p className="mt-2 text-sm text-red-500">{statsError}</p>
          )}
        </div>

        {/* FILTER BUTTONS (time) */}
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {["All Time", "Last 30D", "Last 6M", "YTD"].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 shadow-md ${
                filter === option
                  ? "bg-gradient-to-r from-[#F0B90B] to-amber-500 text-black shadow-amber-400/30"
                  : isDark
                  ? "bg-[#1A1D23] border border-[#2A2F36] text-gray-300 hover:bg-[#2A2F36]"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* ADVANCED FILTERS */}
        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
          {[
            {
              value: symbolFilter,
              set: setSymbolFilter,
              options: symbols,
              label: "Symbols",
            },
            {
              value: setupFilter,
              set: setSetupFilter,
              options: setups,
              label: "Setups",
            },
            {
              value: sessionFilter,
              set: setSessionFilter,
              options: sessions,
              label: "Sessions",
            },
            {
              value: timeframeFilter,
              set: setTimeframeFilter,
              options: timeframes,
              label: "Timeframes",
            },
          ].map(({ value, set, options, label }) => (
            <select
              key={label}
              value={value}
              onChange={(e) => set(e.target.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                isDark
                  ? "bg-[#1A1D23] border-[#2A2F36] text-gray-200 focus:border-yellow-500"
                  : "bg-white border-gray-300 text-gray-800 focus:border-[#F0B90B] focus:ring-2 focus:ring-yellow-200"
              } focus:outline-none focus:ring-2`}
            >
              <option value="All">All {label}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ))}
        </div>

        {/* MAIN CONTENT BLOCKS */}
        <div className="space-y-12">
          {/* TOP STATS */}
          <StatsCards
            totalTrades={totalTrades}
            winrate={winrate}
            totalProfit={totalProfit}
            avgR={avgR}
            maxDrawdown={maxDrawdown}
            expectancy={expectancy}
            profitFactor={profitFactor}
            theme={theme}
          />

          {/* EQUITY CURVE */}
          <div
            className={`rounded-3xl p-8 shadow-xl backdrop-blur-sm border transition-all ${
              isDark
                ? "bg-[#1A1D23]/80 border-[#2A2F36]"
                : "bg-white/95 border-gray-200 shadow-lg"
            }`}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#F0B90B] to-amber-500 bg-clip-text text-transparent mb-6">
              Equity Curve • {filter} (R)
            </h2>
            <div className="h-96">
              <EquityCurve data={equityR} theme={theme} />
            </div>
          </div>

          {/* WINRATE BY SETUP + MISTAKES */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div
              className={`rounded-3xl p-8 shadow-xl border transition-all ${
                isDark
                  ? "bg-[#1A1D23] border-[#2A2F36]"
                  : "bg-white border-gray-200"
              }`}
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-6">
                Winrate by Setup
              </h2>
              <div className="h-80">
                <WinrateBySetup statsBySetup={statsBySetup} theme={theme} />
              </div>
            </div>

            <div
              className={`rounded-3xl p-8 shadow-xl border transition-all ${
                isDark
                  ? "bg-[#1A1D23] border-[#2A2F36]"
                  : "bg-white border-gray-200"
              }`}
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent mb-6">
                Mistakes Analysis
              </h2>
              <div className="h-80 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <MistakesAnalysis data={mistakes} theme={theme} />
                </div>
              </div>
            </div>
          </div>

          {/* MONTHLY P&L + DRAWDOWN */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div
              className={`rounded-3xl p-8 shadow-xl border transition-all ${
                isDark
                  ? "bg-[#1A1D23] border-[#2A2F36]"
                  : "bg-white border-gray-200"
              }`}
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent mb-6">
                Monthly P&L
              </h2>
              <div className="h-80">
                <MonthlyPnL data={monthlyPnl} theme={theme} />
              </div>
            </div>

            <div
              className={`rounded-3xl p-8 shadow-xl border transition-all ${
                isDark
                  ? "bg-[#1A1D23] border-[#2A2F36]"
                  : "bg-white border-gray-200"
              }`}
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-6">
                Drawdown Curve
              </h2>
              <div className="h-80">
                <DrawdownChart
                  drawdowns={drawdowns}
                  maxDrawdown={maxDrawdown}
                  theme={theme}
                />
              </div>
            </div>
          </div>

          {/* SESSION / TIMEFRAME */}
          <div className="grid md:grid-cols-2 gap-8">
            <div
              className={`rounded-3xl p-8 shadow-xl border transition-all ${
                isDark
                  ? "bg-[#1A1D23] border-[#2A2F36]"
                  : "bg-white border-gray-200"
              }`}
            >
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-6">
                Best Session
              </h2>
              <div className="h-72">
                <SessionStats data={sessionMap} theme={theme} />
              </div>
            </div>

            <div
              className={`rounded-3xl p-8 shadow-xl border transition-all ${
                isDark
                  ? "bg-[#1A1D23] border-[#2A2F36]"
                  : "bg-white border-gray-200"
              }`}
            >
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent mb-6">
                Best Timeframe
              </h2>
              <div className="h-72">
                <TimeframeStats data={timeframeMap} theme={theme} />
              </div>
            </div>
          </div>

          {/* GRADE / PROCESS QUALITY */}
          {Object.keys(gradeMap).length > 0 && (
            <div
              className={`rounded-3xl p-8 shadow-xl border transition-all ${
                isDark
                  ? "bg-[#1A1D23] border-[#2A2F36]"
                  : "bg-white border-gray-200"
              }`}
            >
              <h2 className="text-xl font-bold bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent mb-6">
                Process Quality by Grade
              </h2>
              <GradeStats data={gradeMap} theme={theme} />
            </div>
          )}

          {/* SETUP TABLE DETAIL */}
          <div
            className={`rounded-3xl p-8 shadow-xl border transition-all ${
              isDark
                ? "bg-[#1A1D23] border-[#2A2F36]"
                : "bg-white border-gray-200"
            }`}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#F0B90B] to-amber-500 bg-clip-text text-transparent mb-6">
              Setup Performance Detail
            </h2>
            <div className="overflow-x-auto">
              <SetupTable statsBySetup={statsBySetup} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
