import React from "react";
import { Download } from "lucide-react";
import { SETUP_TYPES, RESULT_TYPES } from "./constants";

export default function Filters({ filterSetup, setFilterSetup, filterResult, setFilterResult }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <select
        value={filterSetup}
        onChange={(e) => setFilterSetup(e.target.value)}
        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
      >
        <option value="all">Tất cả Setup</option>
        {SETUP_TYPES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        value={filterResult}
        onChange={(e) => setFilterResult(e.target.value)}
        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
      >
        <option value="all">Tất cả Kết quả</option>
        {RESULT_TYPES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>

      <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg flex items-center gap-2">
        <Download className="w-4 h-4" />
        Export CSV
      </button>
    </div>
  );
}
