import { useEffect, useState } from "react";
import StatsCards from "../components/backtest/StatsCards";
import Filters from "../components/backtest/Filters";
import TradeCard from "../components/backtest/TradeCard";
import TradeForm from "../components/backtest/TradeForm";
import TradeModal from "../components/backtest/TradeModal";

export default function Backtest({ theme = "dark" }) {
  const [trades, setTrades] = useState([]);
  const [filterSetup, setFilterSetup] = useState("all");
  const [filterResult, setFilterResult] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);

  const isDark = theme === "dark";

  // ──────────────────────────────────────────────────────────────
  // THEME CLASSES
  // ──────────────────────────────────────────────────────────────
  const pageClass = [
    "min-h-screen",
    isDark
      ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100"
      : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900", // Sáng như Playbook
  ].join(" ");

  const emptyTextClass = `text-center py-20 ${
    isDark ? "text-gray-500" : "text-gray-500"
  }`;

  // ──────────────────────────────────────────────────────────────
  // PERSISTENCE
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("priceaction_backtest");
    if (saved) setTrades(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("priceaction_backtest", JSON.stringify(trades));
  }, [trades]);

  // ──────────────────────────────────────────────────────────────
  // FILTER + STATS
  // ──────────────────────────────────────────────────────────────
  const filteredTrades = trades.filter((t) => {
    if (filterSetup !== "all" && t.setup !== filterSetup) return false;
    if (filterResult !== "all" && t.result !== filterResult) return false;
    return true;
  });

  const stats = {
    total: filteredTrades.length,
    winrate:
      filteredTrades.length > 0
        ? (
            (filteredTrades.filter((t) => t.result === "win").length /
              filteredTrades.length) *
            100
          ).toFixed(1)
        : 0,
    avgRR:
      filteredTrades.length > 0
        ? (
            filteredTrades.reduce((a, t) => a + t.profit, 0) /
              filteredTrades.filter((t) => t.result === "win").length || 1
          ).toFixed(2)
        : 0,
    expectancy:
      filteredTrades.length > 0
        ? (
            filteredTrades.reduce((a, t) => a + t.profit, 0) /
            filteredTrades.length
          ).toFixed(3)
        : 0,
  };

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div className={pageClass}>
      <div className="px-4 sm:px-6 lg:px-10 pt-6 pb-24">
        <StatsCards
          stats={stats}
          onAdd={() => setShowForm(true)}
          theme={theme}
        />

        <Filters
          filterSetup={filterSetup}
          setFilterSetup={setFilterSetup}
          filterResult={filterResult}
          setFilterResult={setFilterResult}
          theme={theme}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-4">
          {filteredTrades.map((trade) => (
            <TradeCard
              key={trade.id}
              trade={trade}
              onSelect={setSelectedTrade}
              onDelete={(id) =>
                setTrades((prev) => prev.filter((t) => t.id !== id))
              }
              theme={theme}
            />
          ))}
        </div>

        {filteredTrades.length === 0 && (
          <div className={emptyTextClass}>
            <p className="text-xl">Chưa có lệnh backtest nào</p>
            <p>Nhấn "Thêm lệnh" để bắt đầu!</p>
          </div>
        )}

        {showForm && (
          <TradeForm
            onClose={() => setShowForm(false)}
            onSave={(t) => setTrades((prev) => [t, ...prev])}
            theme={theme}
          />
        )}

        {selectedTrade && (
          <TradeModal
            trade={selectedTrade}
            index={trades.findIndex((t) => t.id === selectedTrade.id)}
            trades={trades}
            setTrades={setTrades}
            onClose={() => setSelectedTrade(null)}
            onSelect={(t) => setSelectedTrade(t)}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}
