// components/tradeform/MarketStructureSection.jsx

export default function MarketStructureSection({
  form,
  updateForm,
  theme = "dark",
}) {
  const isDark = theme === "dark";

  // ──────────────────────────────────────────────────────────────
  // THEME CLASSES
  // ──────────────────────────────────────────────────────────────
  const wrapperClass = "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8";

  const labelClass = `text-xs font-bold mb-1 block ${
    isDark ? "text-blue-300" : "text-blue-600"
  }`;

  const selectBase =
    "w-full h-12 border rounded-lg px-4 focus:outline-none focus:ring-1 transition";
  const selectTheme = isDark
    ? "bg-[#161b22] border-gray-700 text-white focus:border-[#F0B90B] focus:ring-[#F0B90B]/30"
    : "bg-white border-gray-200 text-gray-900 focus:border-[#F0B90B] focus:ring-[#F0B90B]/20 shadow-sm";
  const selectClass = `${selectBase} ${selectTheme}`;

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div className={wrapperClass}>
      {/* HTF BIAS */}
      <div>
        <label className={labelClass}>HTF Bias</label>
        <select
          className={selectClass}
          value={form.htf_bias || ""}
          onChange={(e) => updateForm({ htf_bias: e.target.value })}
        >
          <option value="">—</option>
          <option value="Bullish">Bullish</option>
          <option value="Bearish">Bearish</option>
          <option value="Range">Range</option>
        </select>
      </div>

      {/* TREND DIRECTION */}
      <div>
        <label className={labelClass}>Trend Direction</label>
        <select
          className={selectClass}
          value={form.trend_direction || ""}
          onChange={(e) => updateForm({ trend_direction: e.target.value })}
        >
          <option value="">—</option>
          <option value="Uptrend">Uptrend</option>
          <option value="Downtrend">Downtrend</option>
          <option value="Range">Range</option>
          <option value="Transition">Transition</option>
        </select>
      </div>

      {/* STRUCTURE EVENT */}
      <div>
        <label className={labelClass}>Structure Event</label>
        <select
          className={selectClass}
          value={form.structure_event || ""}
          onChange={(e) => updateForm({ structure_event: e.target.value })}
        >
          <option value="">—</option>
          <option value="BOS">BOS</option>
          <option value="CHoCH">CHoCH</option>
          <option value="MSS">MSS</option>
          <option value="Reversal">Reversal</option>
          <option value="Continuation">Continuation</option>
          <option value="Sweep">Liquidity Sweep</option>
        </select>
      </div>
    </div>
  );
}
