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

export default function Dashboard() {
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
      <div className="flex items-center justify-center min-h-screen bg-[#0B0E11]">
        <div className="text-2xl text-gray-400 animate-pulse">
          Loading Pro Dashboard...
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0E11]">
        <div className="text-2xl text-gray-400">
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

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      {/* Header */}
      <div className="text-center py-10">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#F0B90B] via-yellow-400 to-amber-500 bg-clip-text text-transparent">
          PRO TRADING DASHBOARD
        </h1>
        <p className="mt-3 text-gray-400 text-lg">
          {totalTrades} trades •{" "}
          <span className="text-[#F0B90B] font-semibold">{filter}</span>
        </p>
        {statsError && (
          <p className="mt-2 text-sm text-red-400">Stats error: {statsError}</p>
        )}
      </div>

      {/* FILTER BUTTONS (time) */}
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto px-4 mb-10">
        {["All Time", "Last 30D", "Last 6M", "YTD"].map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 ${
              filter === option
                ? "bg-gradient-to-r from-[#F0B90B] to-yellow-500 text-black shadow-xl shadow-yellow-500/30"
                : "bg-[#1A1D23] border border-[#2A2F36] text-gray-300 hover:bg-[#2A2F36]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* ADVANCED FILTERS: symbol / setup / session / timeframe */}
      <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto px-4 mb-8">
        <select
          value={symbolFilter}
          onChange={(e) => setSymbolFilter(e.target.value)}
          className="px-4 py-2 bg-[#1A1D23] border border-[#2A2F36] rounded-xl text-sm text-gray-200"
        >
          <option value="All">All Symbols</option>
          {symbols.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={setupFilter}
          onChange={(e) => setSetupFilter(e.target.value)}
          className="px-4 py-2 bg-[#1A1D23] border border-[#2A2F36] rounded-xl text-sm text-gray-200"
        >
          <option value="All">All Setups</option>
          {setups.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={sessionFilter}
          onChange={(e) => setSessionFilter(e.target.value)}
          className="px-4 py-2 bg-[#1A1D23] border border-[#2A2F36] rounded-xl text-sm text-gray-200"
        >
          <option value="All">All Sessions</option>
          {sessions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={timeframeFilter}
          onChange={(e) => setTimeframeFilter(e.target.value)}
          className="px-4 py-2 bg-[#1A1D23] border border-[#2A2F36] rounded-xl text-sm text-gray-200"
        >
          <option value="All">All Timeframes</option>
          {timeframes.map((tf) => (
            <option key={tf} value={tf}>
              {tf}
            </option>
          ))}
        </select>
      </div>

      <div className="px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-20 pb-20 space-y-12">
        {/* TOP STATS */}
        <StatsCards
          totalTrades={totalTrades}
          winrate={winrate}
          totalProfit={totalProfit}
          avgR={avgR}
          maxDrawdown={maxDrawdown}
          expectancy={expectancy}
          profitFactor={profitFactor}
        />

        {/* EQUITY CURVE */}
        <div className="bg-[#1A1D23]/80 backdrop-blur border border-[#2A2F36] rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-[#F0B90B] mb-6">
            Equity Curve • {filter} (R)
          </h2>
          <div className="h-96">
            <EquityCurve data={equityR} />
          </div>
        </div>

        {/* WINRATE BY SETUP + MISTAKES */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-[#1A1D23] border border-[#2A2F36] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-emerald-400 mb-6">
              Winrate by Setup
            </h2>
            <div className="h-80">
              <WinrateBySetup statsBySetup={statsBySetup} />
            </div>
          </div>
          <div className="bg-[#1A1D23] border border-[#2A2F36] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-red-500 mb-6">
              Mistakes Analysis
            </h2>
            <div className="h-80 flex items-center justify-center">
              <div className="w-full max-w-md">
                <MistakesAnalysis data={mistakes} />
              </div>
            </div>
          </div>
        </div>

        {/* MONTHLY P&L + DRAWDOWN */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-[#1A1D23] border border-[#2A2F36] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-emerald-400 mb-6">
              Monthly P&L
            </h2>
            <div className="h-80">
              <MonthlyPnL data={monthlyPnl} />
            </div>
          </div>
          <div className="bg-[#1A1D23] border border-[#2A2F36] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-red-500 mb-6">
              Drawdown Curve
            </h2>
            <div className="h-80">
              <DrawdownChart drawdowns={drawdowns} maxDrawdown={maxDrawdown} />
            </div>
          </div>
        </div>

        {/* SESSION / TIMEFRAME */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#1A1D23] border border-[#2A2F36] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-cyan-400 mb-6">
              Best Session
            </h2>
            <div className="h-72">
              <SessionStats data={sessionMap} />
            </div>
          </div>
          <div className="bg-[#1A1D23] border border-[#2A2F36] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-purple-400 mb-6">
              Best Timeframe
            </h2>
            <div className="h-72">
              <TimeframeStats data={timeframeMap} />
            </div>
          </div>
        </div>

        {/* GRADE / PROCESS QUALITY */}
        {Object.keys(gradeMap).length > 0 && (
          <div className="bg-[#1A1D23] border border-[#2A2F36] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-teal-400 mb-6">
              Process Quality by Grade
            </h2>
            <GradeStats data={gradeMap} />
          </div>
        )}

        {/* SETUP TABLE DETAIL */}
        <div className="bg-[#1A1D23] border border-[#2A2F36] rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-[#F0B90B] mb-6">
            Setup Performance Detail
          </h2>
          <div className="overflow-x-auto">
            <SetupTable statsBySetup={statsBySetup} />
          </div>
        </div>
      </div>
    </div>
  );
}
