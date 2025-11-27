// src/components/dashboard/StatsCards.jsx
import { FiTarget, FiTrendingUp, FiTrendingDown, FiDollarSign, FiActivity } from "react-icons/fi";

export default function StatsCards({ totalTrades, winrate, totalProfit, avgR, maxDrawdown, expectancy, profitFactor }) {
  const stats = [
    { label: "Total Trades", value: totalTrades, icon: FiTarget, color: "from-blue-500 to-cyan-500" },
    { label: "Winrate", value: `${winrate}%`, icon: FiTrendingUp, color: winrate >= 55 ? "from-green-500 to-emerald-500" : "from-yellow-500 to-orange-500" },
    { label: "Total P&L", value: `$${totalProfit}`, icon: FiDollarSign, color: totalProfit > 0 ? "from-green-500 to-emerald-500" : "from-red-500 to-rose-500" },
    { label: "Avg R:R", value: avgR.toFixed(2), icon: FiActivity, color: avgR >= 1.5 ? "from-purple-500 to-pink-500" : "from-orange-500 to-red-500" },
    { label: "Expectancy", value: expectancy >= 0 ? `+$${expectancy}` : `-$${Math.abs(expectancy)}`, icon: FiTrendingUp, color: expectancy > 0.5 ? "from-emerald-500 to-green-500" : expectancy > 0 ? "from-yellow-500 to-orange-500" : "from-red-600 to-rose-600" },
    { label: "Profit Factor", value: profitFactor === Infinity ? "∞" : profitFactor, icon: FiTrendingUp, color: profitFactor >= 2 ? "from-green-500 to-emerald-500" : profitFactor >= 1.5 ? "from-yellow-500 to-orange-500" : "from-red-600 to-rose-600" },
    { label: "Max DD", value: `${maxDrawdown}%`, icon: FiTrendingDown, color: maxDrawdown <= 15 ? "from-green-500 to-emerald-500" : maxDrawdown <= 25 ? "from-yellow-500 to-orange-500" : "from-red-600 to-rose-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
      {stats.map((stat, i) => (
        <div key={i} className="bg-gradient-to-br from-[#1A1D23] to-[#0F1117] border border-[#2A2F36] rounded-2xl p-5 shadow-2xl hover:scale-105 transition-all">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
            <stat.icon size={20} />
          </div>
          <p className="text-gray-400 text-xs">{stat.label}</p>
          <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}