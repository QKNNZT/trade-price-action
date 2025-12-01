import React from "react";
import { Plus } from "lucide-react";

export default function StatsCards({ stats, onAdd, theme = "dark" }) {
  const isDark = theme === "dark";

  const gridClass = "grid grid-cols-2 md:grid-cols-5 gap-4 mb-8";

  const cardBase = "rounded-xl p-5 border shadow-sm";
  const cardTheme = isDark
    ? "bg-slate-900 border-slate-700"
    : "bg-white border-slate-200";
  const cardClass = `${cardBase} ${cardTheme}`;

  const labelClass = `text-sm ${
    isDark ? "text-slate-400" : "text-slate-500"
  }`;

  const expectancyPositive = parseFloat(stats.expectancy) > 0;

  const addCardClass = `${cardBase} ${cardTheme}`;

  const addBtnClass = [
    "w-full h-full flex items-center justify-center gap-2 rounded-lg transition text-sm font-semibold",
    isDark
      ? "bg-blue-600 hover:bg-blue-500 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white",
  ].join(" ");

  return (
    <div className={gridClass}>
      {/* Total trades */}
      <div className={cardClass}>
        <div
          className={`text-3xl font-bold ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`}
        >
          {stats.total}
        </div>
        <div className={labelClass}>Tổng lệnh test</div>
      </div>

      {/* Winrate */}
      <div className={cardClass}>
        <div
          className={`text-3xl font-bold ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}
        >
          {stats.winrate}%
        </div>
        <div className={labelClass}>Winrate</div>
      </div>

      {/* Avg R:R */}
      <div className={cardClass}>
        <div
          className={`text-3xl font-bold ${
            isDark ? "text-amber-400" : "text-amber-500"
          }`}
        >
          1:{stats.avgRR}
        </div>
        <div className={labelClass}>Avg R:R</div>
      </div>

      {/* Expectancy */}
      <div className={cardClass}>
        <div
          className={`text-3xl font-bold ${
            expectancyPositive
              ? isDark
                ? "text-emerald-400"
                : "text-emerald-600"
              : isDark
              ? "text-rose-400"
              : "text-rose-600"
          }`}
        >
          {stats.expectancy}
        </div>
        <div className={labelClass}>Expectancy</div>
      </div>

      {/* Add trade */}
      <div className={addCardClass}>
        <button onClick={onAdd} className={addBtnClass}>
          <Plus className="w-5 h-5" />
          <span>Thêm lệnh</span>
        </button>
      </div>
    </div>
  );
}
