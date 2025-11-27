import React from "react";
import { Plus } from "lucide-react";

export default function StatsCards({ stats, onAdd }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
        <div className="text-gray-400 text-sm">Tổng lệnh test</div>
      </div>

      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <div className="text-3xl font-bold text-green-400">{stats.winrate}%</div>
        <div className="text-gray-400 text-sm">Winrate</div>
      </div>

      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <div className="text-3xl font-bold text-yellow-400">1:{stats.avgRR}</div>
        <div className="text-gray-400 text-sm">Avg R:R</div>
      </div>

      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <div
          className={`text-3xl font-bold ${
            parseFloat(stats.expectancy) > 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {stats.expectancy}
        </div>
        <div className="text-gray-400 text-sm">Expectancy</div>
      </div>

      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <button
          onClick={onAdd}
          className="w-full h-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          <Plus className="w-6 h-6" />
          <span className="font-semibold">Thêm lệnh</span>
        </button>
      </div>
    </div>
  );
}
