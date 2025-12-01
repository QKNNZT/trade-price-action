// components/dashboard/StatsCards.jsx
import {
  FiTarget,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiActivity,
} from "react-icons/fi";

export default function StatsCards({
  totalTrades,
  winrate,
  totalProfit,
  avgR,
  maxDrawdown,
  expectancy,
  profitFactor,
  theme = "dark", // nhận prop theme
}) {
  const isDark = theme === "dark";

  // ──────────────────────────────────────────────────────────────
  // XỬ LÝ PROFIT FACTOR
  // ──────────────────────────────────────────────────────────────
  const pfRaw = profitFactor;
  const pfIsInfinite = pfRaw === null || pfRaw === undefined;
  const pfNumber = pfIsInfinite ? Infinity : pfRaw;
  const pfDisplay = pfIsInfinite ? "∞" : pfRaw?.toFixed(2);

  // ──────────────────────────────────────────────────────────────
  // MÀU SẮC THEO THEME
  // ──────────────────────────────────────────────────────────────
  const cardBg = isDark
    ? "bg-gradient-to-br from-[#1A1D23] to-[#0F1117] border-[#2A2F36]"
    : "bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg";

  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const iconBgOpacity = isDark ? "bg-opacity-20" : "bg-opacity-15";

  // ──────────────────────────────────────────────────────────────
  // ĐỊNH NGHĨA CÁC STAT CARD
  // ──────────────────────────────────────────────────────────────
  const stats = [
    {
      label: "Total Trades",
      value: totalTrades.toLocaleString(),
      icon: FiTarget,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Winrate",
      value: `${winrate}%`,
      icon: FiTrendingUp,
      gradient:
        winrate >= 60
          ? "from-emerald-500 to-green-500"
          : winrate >= 50
          ? "from-yellow-500 to-amber-500"
          : "from-orange-500 to-red-500",
    },
    {
      label: "Total P&L",
      value:
        totalProfit >= 0
          ? `+$${totalProfit.toFixed(0)}`
          : `-$${Math.abs(totalProfit).toFixed(0)}`,
      icon: FiDollarSign,
      gradient:
        totalProfit >= 0
          ? "from-emerald-500 to-green-500"
          : "from-red-500 to-rose-500",
    },
    {
      label: "Avg R:R",
      value: avgR.toFixed(2),
      icon: FiActivity,
      gradient:
        avgR >= 2
          ? "from-purple-500 to-pink-500"
          : avgR >= 1.5
          ? "from-cyan-500 to-blue-500"
          : "from-orange-500 to-red-500",
    },
    {
      label: "Expectancy",
      value:
        expectancy >= 0
          ? `+$${expectancy.toFixed(2)}`
          : `-$${Math.abs(expectancy).toFixed(2)}`,
      icon: FiTrendingUp,
      gradient:
        expectancy > 1
          ? "from-emerald-500 to-green-500"
          : expectancy > 0
          ? "from-yellow-500 to-amber-500"
          : "from-red-600 to-rose-600",
    },
    {
      label: "Profit Factor",
      value: pfDisplay,
      icon: FiTrendingUp,
      gradient:
        pfIsInfinite || pfNumber >= 2
          ? "from-emerald-500 to-green-500"
          : pfNumber >= 1.5
          ? "from-yellow-500 to-amber-500"
          : "from-red-600 to-rose-600",
    },
    {
      label: "Max DD",
      value: `${maxDrawdown}%`,
      icon: FiTrendingDown,
      gradient:
        maxDrawdown <= 10
          ? "from-emerald-500 to-green-500"
          : maxDrawdown <= 20
          ? "from-yellow-500 to-amber-500"
          : "from-red-600 to-rose-600",
    },
  ];

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div
      className="grid gap-4 mb-12
                  grid-cols-2
                  sm:grid-cols-2
                  md:grid-cols-3
                  lg:grid-cols-4
                  xl:grid-cols-5
                  2xl:grid-cols-7"
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`
          ${cardBg}
          w-full
          rounded-2xl p-5
          border
          transition-all duration-300
          hover:scale-[1.03] hover:shadow-xl
          cursor-default
        `}
        > 
          {/* Icon với gradient background */}
          <div
            className={`
              w-11 h-11 rounded-xl
              bg-gradient-to-br ${stat.gradient}
              ${iconBgOpacity}
              flex items-center justify-center mb-3
              transition-all duration-300
            `}
          >
            <stat.icon size={22} className="text-white drop-shadow-sm" />
          </div>

          {/* Label */}
          <p
            className={`text-xs font-medium ${textSecondary} tracking-wider uppercase`}
          >
            {stat.label}
          </p>

          {/* Value */}
          <p
            className={`text-2xl font-bold ${textPrimary} mt-1.5 tracking-tight`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
