// src/pages/Journal.jsx
import { useLocation, Link } from "react-router-dom";
import useTrades from "../hooks/useTrades";
import { format } from "date-fns";

export default function Journal() {
  const allTrades = useTrades("http://127.0.0.1:5000");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const setup = searchParams.get("setup");

  const trades = setup ? allTrades.filter((t) => t.setup === setup) : allTrades;

  if (!allTrades.length)
    return (
      <div className="text-center py-20 text-gray-400">Loading journal...</div>
    );

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F0B90B] to-yellow-400 bg-clip-text text-transparent">
            Trade Journal {setup && `• ${setup}`}
          </h1>
          <Link
            to="/dashboard"
            className="px-6 py-2 bg-[#1A1D23] rounded-xl hover:bg-[#2A2F36] transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-6">
          {trades
            .sort((a, b) => {
              if (!a.date) return 1;
              if (!b.date) return -1;
              return new Date(b.date) - new Date(a.date);
            })
            .map((trade) => (
              <div
                key={trade.id}
                className="bg-[#1A1D23] border border-[#2A2F36] rounded-2xl p-6 hover:border-[#F0B90B] transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {trade.setup || "Unknown Setup"}
                    </h3>
                    <p className="text-gray-400">
                      {trade.date
                        ? format(new Date(trade.date), "dd MMM yyyy • HH:mm")
                        : "No date"}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-xl font-bold ${
                      trade.profit > 0
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    ${trade.profit > 0 ? "+" : ""}
                    {trade.profit.toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">R:R</span>{" "}
                    <span className="text-cyan-400 font-bold">
                      {trade.rr || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Session</span>{" "}
                    <span className="text-purple-400">{trade.session}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">TF</span>{" "}
                    <span className="text-orange-400">{trade.timeframe}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Mistakes</span>{" "}
                    <span className="text-red-400">
                      {trade.mistakes
                        ? JSON.parse(trade.mistakes).join(", ")
                        : "Clean"}
                    </span>
                  </div>
                </div>
                {trade.note && (
                  <p className="mt-4 text-gray-300 italic">"{trade.note}"</p>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
