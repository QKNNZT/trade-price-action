import React from "react";
import { Download } from "lucide-react";
import { SETUP_TYPES, RESULT_TYPES } from "./constants";

export default function Filters({
  filterSetup,
  setFilterSetup,
  filterResult,
  setFilterResult,
  theme = "dark",
  onExport,
}) {
  const isDark = theme === "dark";

  const selectBase =
    "px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 transition";
  const selectTheme = isDark
    ? "bg-slate-900 border border-slate-700 text-slate-100 focus:ring-blue-500 focus:border-blue-500"
    : "bg-white border border-slate-300 text-slate-900 focus:ring-blue-500 focus:border-blue-500";
  const selectClass = `${selectBase} ${selectTheme}`;

  const btnClass = [
    "px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition border",
    isDark
      ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800"
      : "bg-white border-slate-300 text-slate-800 hover:bg-slate-100",
  ].join(" ");

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Filter setup */}
      <select
        value={filterSetup}
        onChange={(e) => setFilterSetup(e.target.value)}
        className={selectClass}
      >
        <option value="all">Tất cả Setup</option>
        {SETUP_TYPES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {/* Filter result */}
      <select
        value={filterResult}
        onChange={(e) => setFilterResult(e.target.value)}
        className={selectClass}
      >
        <option value="all">Tất cả Kết quả</option>
        {RESULT_TYPES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>

      {/* Export */}
      <button
        type="button"
        onClick={onExport}
        className={btnClass}
      >
        <Download className="w-4 h-4" />
        Export CSV
      </button>
    </div>
  );
}
