// components/dashboard/SetupTable.jsx
import { Link } from "react-router-dom";

export default function SetupTable({ statsBySetup, theme = "dark" }) {
  const isDark = theme === "dark";

  // ──────────────────────────────────────────────────────────────
  // SẮP XẾP THEO WINRATE (cao → thấp)
  // ──────────────────────────────────────────────────────────────
  const sortedSetups = Object.entries(statsBySetup)
    .filter(([, data]) => data.trades > 0)
    .sort(([, a], [, b]) => (b.win / b.trades) - (a.win / a.trades));

  if (!sortedSetups.length) {
    return (
      <div className={`h-48 flex items-center justify-center text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        No setup data available yet.
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // MÀU SẮC THEO THEME
  // ──────────────────────────────────────────────────────────────
  const colors = {
    headerBg: isDark ? "bg-[#1A1D23]" : "bg-gray-50",
    headerText: isDark ? "text-gray-300" : "text-gray-700",
    rowHover: isDark ? "hover:bg-[#2A2F36]/40" : "hover:bg-gray-100",
    border: isDark ? "border-[#2A2F36]" : "border-gray-200",
    link: isDark ? "text-[#F0B90B] hover:text-yellow-400" : "text-amber-600 hover:text-amber-500",
    winrate: isDark ? "text-emerald-400" : "text-emerald-600",
    avgR: isDark ? "text-cyan-400" : "text-cyan-600",
    profitPositive: isDark ? "text-emerald-500" : "text-emerald-700",
    profitNegative: isDark ? "text-red-500" : "text-red-600",
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-[#2A2F36]">
      <table className="w-full text-sm">
        {/* HEADER */}
        <thead className={`${colors.headerBg} border-b ${colors.border}`}>
          <tr>
            {["Setup", "Trades", "Winrate", "Avg R", "Profit"].map((header) => (
              <th
                key={header}
                className={`py-4 px-5 font-semibold text-left uppercase tracking-wider ${colors.headerText}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-gray-200 dark:divide-[#2A2F36]">
          {sortedSetups.map(([setup, data]) => {
            const winrate = ((data.win / data.trades) * 100).toFixed(1);
            const avgR = (data.rr / data.trades).toFixed(2);
            const profit = data.profit.toFixed(2);
            const isPositive = data.profit >= 0;

            return (
              <tr
                key={setup}
                className={`transition-all duration-200 ${colors.rowHover} ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {/* SETUP NAME */}
                <td className="py-4 px-5 font-medium">
                  <Link
                    to={`/journal?setup=${encodeURIComponent(setup)}`}
                    className={`font-semibold underline-offset-2 hover:underline transition ${colors.link}`}
                  >
                    {setup}
                  </Link>
                </td>

                {/* TRADES */}
                <td className="py-4 px-5 font-mono">
                  {data.trades}
                </td>

                {/* WINRATE */}
                <td className={`py-4 px-5 font-bold ${colors.winrate}`}>
                  {winrate}%
                </td>

                {/* AVG R */}
                <td className={`py-4 px-5 font-medium ${colors.avgR}`}>
                  {avgR}
                </td>

                {/* PROFIT */}
                <td
                  className={`py-4 px-5 font-bold font-mono ${
                    isPositive ? colors.profitPositive : colors.profitNegative
                  }`}
                >
                  {isPositive ? "+" : ""}${profit}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}