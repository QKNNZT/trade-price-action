// components/tradeform/ContextSection.jsx
import CreatableSelect from "react-select/creatable";
import { sessions, timeframes, confluenceOptions } from "./tradeOptions";

export default function ContextSection({
  form,
  updateForm,
  handleMultiChange,
  theme = "dark",
}) {
  const isDark = theme === "dark";

  // ──────────────────────────────────────────────────────────────
  // COMMON CLASSES THEO THEME
  // ──────────────────────────────────────────────────────────────
  const inputBase =
    "w-full h-12 border rounded-lg px-4 focus:outline-none focus:ring-1 transition";
  const inputTheme = isDark
    ? "bg-[#161b22] border-gray-700 text-white focus:border-[#F0B90B] focus:ring-[#F0B90B]/40"
    : "bg-white border-gray-200 text-gray-900 focus:border-[#F0B90B] focus:ring-[#F0B90B]/20 shadow-sm";
  const inputClass = `${inputBase} ${inputTheme}`;

  const labelMutedClass = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-400" : "text-gray-600"
  }`;

  const labelStrongClass = `block text-xs font-semibold mb-1 ${
    isDark ? "text-gray-300" : "text-gray-700"
  }`;

  const confluenceLabelClass =
    "block text-xs font-bold mb-1 text-emerald-400"; // giữ màu xanh để nhấn

  const errorTextClass = "text-red-500 text-xs mt-1 flex items-center gap-1";

  // ──────────────────────────────────────────────────────────────
  // react-select STYLES CHO CONFLUENCE (THEO THEME)
  // ──────────────────────────────────────────────────────────────
  const confluenceStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: isDark ? "#161b22" : "#ffffff",
      borderColor: state.isFocused
        ? "#F0B90B"
        : isDark
        ? "#374151"
        : "#e5e7eb",
      borderRadius: 12,
      minHeight: 52,
      height: "auto",
      padding: "4px 8px",
      boxShadow: isDark
        ? "0 1px 3px rgba(0,0,0,0.5)"
        : "0 1px 3px rgba(15,23,42,0.12)",
      "&:hover": {
        borderColor: isDark ? "#4b5563" : "#d1d5db",
      },
      cursor: "text",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "4px 8px",
      gap: "8px",
      flexWrap: "wrap",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: isDark ? "#1f2937" : "#f1f5f9",
      border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
      borderRadius: 8,
      padding: "2px 6px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: 13,
      fontWeight: 500,
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: isDark ? "#22d3ee" : "#0284c7",
      padding: 0,
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: isDark ? "#94a3b8" : "#64748b",
      borderRadius: 6,
      padding: "0 4px",
      cursor: "pointer",
      ":hover": {
        backgroundColor: "#ef4444",
        color: "white",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: isDark ? "#64748b" : "#9ca3af",
      fontSize: 14,
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? "#161b22" : "#ffffff",
      border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
      borderRadius: 12,
      marginTop: 8,
      overflow: "hidden",
      zIndex: 40,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? isDark
          ? "#1e40af"
          : "#2563eb"
        : state.isFocused
        ? isDark
          ? "#1f2937"
          : "#e5e7eb"
        : isDark
        ? "#161b22"
        : "#ffffff",
      color: state.isSelected
        ? "#ffffff"
        : isDark
        ? "#e2e8f0"
        : "#1f2937",
      padding: "10px 16px",
      fontSize: 14,
      ":active": {
        backgroundColor: isDark ? "#1e40af" : "#2563eb",
      },
    }),
    input: (base) => ({
      ...base,
      color: isDark ? "#e5e7eb" : "#111827",
      fontSize: 14,
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? "#e5e7eb" : "#111827",
      fontSize: 14,
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? "#F0B90B" : isDark ? "#6b7280" : "#9ca3af",
      "&:hover": { color: "#F0B90B" },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: isDark ? "#374151" : "#e5e7eb",
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: 13,
      color: isDark ? "#9ca3af" : "#6b7280",
    }),
  };

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
      {/* CAPITAL */}
      <div className="md:col-span-2">
        <label className={labelMutedClass}>Account Capital ($)</label>
        <input
          type="number"
          placeholder="100000"
          className={inputClass}
          value={form.capital || ""}
          onChange={(e) => updateForm({ capital: e.target.value })}
        />
        {(!form.capital || parseFloat(form.capital) <= 0) && (
          <p className={errorTextClass}>
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            Capital phải lớn hơn 0
          </p>
        )}
      </div>

      {/* SESSION */}
      <div className="md:col-span-3">
        <label className={labelStrongClass}>Session</label>
        <select
          className={inputClass}
          value={form.session || ""}
          onChange={(e) => updateForm({ session: e.target.value })}
        >
          <option value="">—</option>
          {sessions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* TIMEFRAME */}
      <div className="md:col-span-3">
        <label className={labelStrongClass}>Timeframe</label>
        <select
          className={inputClass}
          value={form.timeframe || ""}
          onChange={(e) => updateForm({ timeframe: e.target.value })}
        >
          <option value="">—</option>
          {timeframes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* CONFLUENCE */}
      <div className="md:col-span-4">
        <label className={confluenceLabelClass}>Confluence (+)</label>
        <CreatableSelect
          isMulti
          options={confluenceOptions}
          value={form.confluence || []}
          onChange={handleMultiChange("confluence")}
          placeholder="FVG + Liquidity Grab + Order Block..."
          formatCreateLabel={(input) => `+ Thêm "${input}"`}
          styles={confluenceStyles}
          classNamePrefix="react-select"
        />
      </div>
    </div>
  );
}
