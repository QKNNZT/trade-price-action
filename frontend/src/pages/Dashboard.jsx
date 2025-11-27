import useTrades from "../hooks/useTrades";
import useTimeFilter from "../hooks/useTimeFilter";
import MonthlyPnL from "../components/dashboard/MonthlyPnL";
import DrawdownChart from "../components/dashboard/DrawdownChart";
import {
  calcMonthlyPnL,
  calcExpectancy,
  calcProfitFactor,
  calcDrawdown,
} from "../utils/calcStats";
import { API_BASE_URL } from "../config/api";

import {
  calcBasicStats,
  calcEquityCurve,
  calcStatsBySetup,
  groupBy,
  calcMistakes,
} from "../utils/calcStats";

import StatsCards from "../components/dashboard/StatsCards";
import EquityCurve from "../components/dashboard/EquityCurve";
import WinrateBySetup from "../components/dashboard/WinrateBySetup";
import MistakesAnalysis from "../components/dashboard/MistakesAnalysis";
import SessionStats from "../components/dashboard/SessionStats";
import TimeframeStats from "../components/dashboard/TimeframeStats";
import SetupTable from "../components/dashboard/SetupTable";

export default function Dashboard() {
  const allTrades = useTrades();
  const { filter, setFilter, applyFilter } = useTimeFilter("Last 6M");
  const trades = applyFilter(allTrades);

  if (!trades.length)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0E11]">
        <div className="text-2xl text-gray-400 animate-pulse">
          Loading Pro Dashboard...
        </div>
      </div>
    );
  const monthlyData = calcMonthlyPnL(trades);

  const expectancy = calcExpectancy(trades);
  const profitFactor = calcProfitFactor(trades);
  const basic = calcBasicStats(trades);
  const equity = calcEquityCurve(trades);
  const { drawdowns, maxDrawdown } = calcDrawdown(equity);
  const statsBySetup = calcStatsBySetup(trades);
  const bySession = groupBy(trades, "session");
  const byTimeframe = groupBy(trades, "timeframe");
  const mistakes = calcMistakes(trades);

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      {/* Header */}
      <div className="text-center py-10">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#F0B90B] via-yellow-400 to-amber-500 bg-clip-text text-transparent">
          PRO TRADING DASHBOARD
        </h1>
        <p className="mt-3 text-gray-400 text-lg">
          {trades.length} trades •{" "}
          <span className="text-[#F0B90B] font-semibold">{filter}</span>
        </p>
      </div>

      {/* FILTER BUTTONS - ĐẸP NHƯ TRADER PRO */}
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

      <div className="px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-20 pb-20 space-y-12">
        <StatsCards
          {...basic}
          maxDrawdown={maxDrawdown}
          expectancy={expectancy}
          profitFactor={profitFactor}
        />

        <div className="bg-[#1A1D23]/80 backdrop-blur border border-[#2A2F36] rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-[#F0B90B] mb-6">
            Equity Curve • {filter}
          </h2>
          <div className="h-96">
            <EquityCurve data={equity} />
          </div>
        </div>

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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Monthly P&L */}
          <div className="bg-[#1A1D23] border border-[#2A2F36] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-emerald-400 mb-6">
              Monthly P&L
            </h2>
            <div className="h-80">
              <MonthlyPnL data={monthlyData} />
            </div>
          </div>

          {/* Drawdown Chart */}
          <div className="bg-[#1A1D23] border border-[#2A2F36] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-red-500 mb-6">
              Drawdown Curve
            </h2>
            <div className="h-80">
              <DrawdownChart drawdowns={drawdowns} maxDrawdown={maxDrawdown} />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#1A1D23] border border-[#2A2F36] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-cyan-400 mb-6">
              Best Session
            </h2>
            <div className="h-72">
              <SessionStats data={bySession} />
            </div>
          </div>
          <div className="bg-[#1A1D23] border border-[#2A2F36] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-purple-400 mb-6">
              Best Timeframe
            </h2>
            <div className="h-72">
              <TimeframeStats data={byTimeframe} />
            </div>
          </div>
        </div>

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
