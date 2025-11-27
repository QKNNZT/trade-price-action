import { useEffect, useState } from "react";
import StatsCards from "../components/backtest/StatsCards";
import Filters from "../components/backtest/Filters";
import TradeCard from "../components/backtest/TradeCard";
import TradeForm from "../components/backtest/TradeForm";
import TradeModal from "../components/backtest/TradeModal";

export default function Backtest() {
  const [trades, setTrades] = useState([]);
  const [filterSetup, setFilterSetup] = useState("all");
  const [filterResult, setFilterResult] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("priceaction_backtest");
    if (saved) setTrades(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("priceaction_backtest", JSON.stringify(trades));
  }, [trades]);

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

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100">
      <div className="px-6 pt-6 pb-24">
        <StatsCards stats={stats} onAdd={() => setShowForm(true)} />

        <Filters
          filterSetup={filterSetup}
          setFilterSetup={setFilterSetup}
          filterResult={filterResult}
          setFilterResult={setFilterResult}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTrades.map((trade) => (
            <TradeCard
              key={trade.id}
              trade={trade}
              onSelect={setSelectedTrade}
              onDelete={(id) => setTrades(trades.filter((t) => t.id !== id))}
            />
          ))}
        </div>

        {filteredTrades.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">Chưa có lệnh backtest nào</p>
            <p>Nhấn "Thêm lệnh" để bắt đầu!</p>
          </div>
        )}

        {showForm && (
          <TradeForm
            onClose={() => setShowForm(false)}
            onSave={(t) => setTrades([t, ...trades])}
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
          />
        )}
      </div>
    </div>
  );
}
