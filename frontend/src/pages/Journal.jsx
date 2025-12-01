// src/pages/Journal.jsx
import { useLocation, Link } from "react-router-dom";
import useTrades from "../hooks/useTrades";
import { format } from "date-fns";

export default function Journal({ theme = "dark" }) {
  const allTrades = useTrades("http://127.0.0.1:5000");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const setup = searchParams.get("setup");

  const trades = setup ? allTrades.filter((t) => t.setup === setup) : allTrades;
  const isDark = theme === "dark";

  if (!allTrades.length)
    return (
      <div className={`text-center py-20 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        Loading journal...
      </div>
    );

  return (
    <div className={`min-h-screen py-10 px-4 ${isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-4xl font-bold bg-gradient-to-r ${isDark ? "from-[#F0B90B] to-yellow-400" : "from-yellow-500 to-amber-600"} bg-clip-text text-transparent`}>
            Trade Journal {setup && `• ${setup}`}
          </h1>
          <Link
            to="/dashboard"
            className={`
              px-6 py-2 rounded-xl font-medium transition-all duration-200
              ${isDark
                ? "bg-[#1A1D23] hover:bg-[#2A2F36] text-white border border-[#2A2F36]"
                : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 shadow-sm"
              }
            `}
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* TRADE LIST */}
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
                className={`
                  rounded-2xl p-6 transition-all duration-300
                  ${isDark
                    ? "bg-[#1A1D23] border border-[#2A2F36] hover:border-[#F0B90B] hover:shadow-lg hover:shadow-yellow-500/10"
                    : "bg-white border border-gray-200 hover:border-yellow-500 hover:shadow-md"
                  }
                `}
              >
                {/* TITLE + PROFIT */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {trade.setup || "Unknown Setup"}
                    </h3>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {trade.date
                        ? format(new Date(trade.date), "dd MMM yyyy • HH:mm")
                        : "No date"}
                    </p>
                  </div>
                  <span
                    className={`
                      px-4 py-2 rounded-xl font-bold text-sm
                      ${trade.profit > 0
                        ? isDark
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-green-100 text-green-700 border border-green-300"
                        : isDark
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-red-100 text-red-700 border border-red-300"
                      }
                    `}
                  >
                    ${trade.profit > 0 ? "+" : ""}
                    {trade.profit.toFixed(2)}
                  </span>
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className={`${isDark ? "text-gray-500" : "text-gray-600"}`}>R:R</span>{" "}
                    <span className={`font-bold ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                      {trade.rr || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className={`${isDark ? "text-gray-500" : "text-gray-600"}`}>Session</span>{" "}
                    <span className={`${isDark ? "text-purple-400" : "text-purple-600"}`}>
                      {trade.session}
                    </span>
                  </div>
                  <div>
                    <span className={`${isDark ? "text-gray-500" : "text-gray-600"}`}>TF</span>{" "}
                    <span className={`${isDark ? "text-orange-400" : "text-orange-600"}`}>
                      {trade.timeframe}
                    </span>
                  </div>
                  <div>
                    <span className={`${isDark ? "text-gray-500" : "text-gray-600"}`}>Mistakes</span>{" "}
                    <span className={`${isDark ? "text-red-400" : "text-red-600"}`}>
                      {trade.mistakes
                        ? JSON.parse(trade.mistakes).join(", ")
                        : "Clean"}
                    </span>
                  </div>
                </div>

                {/* NOTE */}
                {trade.note && (
                  <p className={`mt-4 italic ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    "{trade.note}"
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}