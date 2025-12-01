// components/tradeform/TradeManagementSection.jsx

export default function TradeManagementSection({
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
    isDark ? "text-purple-300" : "text-purple-600"
  }`;

  const selectBase =
    "w-full rounded-lg px-4 py-3 border focus:outline-none focus:ring-1 transition";
  const selectTheme = isDark
    ? "bg-[#161b22] border-gray-700 text-gray-100 focus:border-[#F0B90B] focus:ring-[#F0B90B]/30"
    : "bg-white border-gray-200 text-gray-900 focus:border-[#F0B90B] focus:ring-[#F0B90B]/20 shadow-sm";
  const selectClass = `${selectBase} ${selectTheme}`;

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div className={wrapperClass}>
      {/* PARTIAL TP */}
      <div>
        <label className={labelClass}>Partial TP</label>
        <select
          className={selectClass}
          value={form.partial_tp || ""}
          onChange={(e) => updateForm({ partial_tp: e.target.value })}
        >
          <option value="">None</option>
          <option value="25%">25%</option>
          <option value="50%">50%</option>
          <option value="75%">75%</option>
        </select>
      </div>

      {/* BE TRIGGER */}
      <div>
        <label className={labelClass}>BE Trigger</label>
        <select
          className={selectClass}
          value={form.be_trigger || ""}
          onChange={(e) => updateForm({ be_trigger: e.target.value })}
        >
          <option value="">None</option>
          <option value="1R">After +1R</option>
          <option value="Structure Shift">After structure shift</option>
          <option value="Mitigation">After mitigation</option>
        </select>
      </div>

      {/* SCALE MODE */}
      <div>
        <label className={labelClass}>Scale Mode</label>
        <select
          className={selectClass}
          value={form.scale_mode || ""}
          onChange={(e) => updateForm({ scale_mode: e.target.value })}
        >
          <option value="">None</option>
          <option value="Scale In">Scale In</option>
          <option value="Scale Out">Scale Out</option>
        </select>
      </div>
    </div>
  );
}
