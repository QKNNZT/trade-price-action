// components/tradeform/EntryModelSection.jsx
import CreatableSelect from "react-select/creatable";

const ENTRY_MODEL_OPTIONS = [
  { label: "FVG Entry", value: "FVG Entry" },
  { label: "Liquidity Grab", value: "Liquidity Grab" },
  { label: "BOS Retest", value: "BOS Retest" },
  { label: "Breaker", value: "Breaker" },
  { label: "Mitigation Block", value: "Mitigation Block" },
  { label: "Rejection Candle", value: "Rejection Candle" },
];

export default function EntryModelSection({
  form,
  handleMultiChange,
  theme = "dark",
}) {
  const isDark = theme === "dark";

  // ──────────────────────────────────────────────────────────────
  // react-select STYLES THEO THEME (embedded)
  // ──────────────────────────────────────────────────────────────
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: 12,
      minHeight: 44,
      boxShadow: "none",
      borderColor: state.isFocused ? "#F0B90B" : isDark ? "#374151" : "#e5e7eb",
      backgroundColor: isDark ? "#020617" : "#ffffff",
      "&:hover": {
        borderColor: "#F0B90B",
      },
      cursor: "text",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 12,
      marginTop: 6,
      backgroundColor: isDark ? "#020617" : "#ffffff",
      border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
      overflow: "hidden",
      zIndex: 40,
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: 220,
      paddingTop: 4,
      paddingBottom: 4,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#F0B90B"
        : state.isFocused
        ? (isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(55, 65, 81, 0.06)")
        : "transparent",
      color: state.isSelected
        ? "#020617"
        : isDark
        ? "#e5e7eb"
        : "#111827",
      fontSize: 13,
      paddingTop: 8,
      paddingBottom: 8,
      cursor: "pointer",
    }),
    placeholder: (base) => ({
      ...base,
      color: isDark ? "#6b7280" : "#9ca3af",
      fontSize: 13,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: isDark ? "rgba(240, 185, 11, 0.08)" : "rgba(250, 204, 21, 0.12)",
      borderRadius: 999,
      paddingInline: 2,
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: isDark ? "#f9fafb" : "#1f2937",
      fontSize: 12,
      paddingInline: 6,
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: isDark ? "#fbbf24" : "#b45309",
      ":hover": {
        backgroundColor: "transparent",
        color: "#F59E0B",
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
      "&:hover": {
        color: "#F0B90B",
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: isDark ? "#374151" : "#e5e7eb",
    }),
    valueContainer: (base) => ({
      ...base,
      paddingInline: 10,
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: 13,
      color: isDark ? "#9ca3af" : "#6b7280",
    }),
  };

  const labelClass =
    "block text-xs font-bold mb-2 text-[#F0B90B]"; // giữ brand vàng

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="mb-8">
      <label className={labelClass}>Entry Model</label>
      <CreatableSelect
        isMulti
        styles={selectStyles}
        options={ENTRY_MODEL_OPTIONS}
        value={form.entry_model || []}
        onChange={handleMultiChange("entry_model")}
        placeholder="FVG Entry + Liquidity Grab..."
      />
    </div>
  );
}
