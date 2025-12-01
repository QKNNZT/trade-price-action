// components/tradeform/BasicInfoSection.jsx
import CreatableSelect from "react-select/creatable";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

export default function BasicInfoSection({
  form,
  updateForm,
  symbolOptions,
  setupOptions,
  onSetupSelect,
  symbolInputRef, // <-- nhận ref
  theme = "dark", // <-- thêm theme
}) {
  const isDark = theme === "dark";

  // ──────────────────────────────────────────────────────────────
  // react-select STYLES THEO THEME (embedded luôn ở đây)
  // ──────────────────────────────────────────────────────────────
  const commonSelect = {
    control: (base, state) => ({
      ...base,
      borderRadius: 12,
      minHeight: 44,
      boxShadow: "none",
      borderColor: state.isFocused ? "#F0B90B" : isDark ? "#374151" : "#e5e7eb",
      backgroundColor: isDark ? "#161b22" : "#ffffff",
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
        ? isDark
          ? "rgba(148, 163, 184, 0.2)"
          : "rgba(55, 65, 81, 0.06)"
        : "transparent",
      color: state.isSelected ? "#020617" : isDark ? "#e5e7eb" : "#111827",
      fontSize: 13,
      paddingTop: 8,
      paddingBottom: 8,
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? "#e5e7eb" : "#111827",
      fontSize: 14,
    }),
    placeholder: (base) => ({
      ...base,
      color: isDark ? "#6b7280" : "#9ca3af",
      fontSize: 13,
    }),
    input: (base) => ({
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
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: 13,
      color: isDark ? "#9ca3af" : "#6b7280",
    }),
    valueContainer: (base) => ({
      ...base,
      paddingInline: 10,
    }),
  };

  // ──────────────────────────────────────────────────────────────
  // CLASSES THEO THEME
  // ──────────────────────────────────────────────────────────────
  const labelBase = "text-xs font-semibold";
  const labelColor = isDark ? "text-gray-300" : "text-gray-700";

  const inputBase =
    "w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition";
  const inputTheme = isDark
    ? "bg-[#161b22] border-gray-700 text-white focus:border-[#F0B90B] focus:ring-[#F0B90B]/40"
    : "bg-white border-gray-200 text-gray-900 focus:border-[#F0B90B] focus:ring-[#F0B90B]/20 shadow-sm";

  const labelClass = `${labelBase} ${labelColor}`;
  const inputClass = `${inputBase} ${inputTheme}`;

  const directionLabelClass = `${labelBase} ${labelColor} block mb-2`;

  const directionBase =
    "flex-1 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 border";

  const longActiveClass = isDark
    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border-transparent"
    : "bg-emerald-500 text-white shadow-md shadow-emerald-500/25 border-transparent";

  const shortActiveClass = isDark
    ? "bg-red-600 text-white shadow-lg shadow-red-600/30 border-transparent"
    : "bg-red-500 text-white shadow-md shadow-red-500/25 border-transparent";

  const directionInactiveTheme = isDark
    ? "bg-[#161b22] text-gray-400 border-gray-700 hover:border-[#F0B90B]"
    : "bg-white text-gray-500 border-gray-200 hover:border-[#F0B90B] shadow-sm";

  const directionInactiveClass = directionInactiveTheme;

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* DATE */}
      <div>
        <label className={labelClass}>Date</label>
        <input
          type="date"
          lang="vi"
          className={inputClass}
          value={form.date || ""}
          onChange={(e) => updateForm({ date: e.target.value })}
        />
        {/* ... thông báo lỗi */}
      </div>

      {/* SYMBOL – REF ĐÚNG Ở ĐÂY */}
      <div>
        <label className={labelClass}>Symbol</label>
        <CreatableSelect
          ref={symbolInputRef} // <-- focus vào Symbol
          styles={commonSelect}
          options={symbolOptions}
          value={
            form.symbol ? { value: form.symbol, label: form.symbol } : null
          }
          onChange={(opt) => updateForm({ symbol: opt?.value || "" })}
          placeholder="EUR/USD, XAU/USD..."
        />
        {/* ... thông báo lỗi */}
      </div>

      {/* SETUP */}
      <div>
        <label className={labelClass}>Setup</label>
        <CreatableSelect
          styles={commonSelect}
          options={setupOptions}
          value={form.setup ? { value: form.setup, label: form.setup } : null}
          onChange={onSetupSelect}
          placeholder="Chọn setup..."
        />
      </div>

      {/* DIRECTION */}
      <div>
        <label className={directionLabelClass}>Direction</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => updateForm({ direction: "Long" })}
            className={
              form.direction === "Long"
                ? `${directionBase} ${longActiveClass}`
                : `${directionBase} ${directionInactiveClass}`
            }
          >
            <FiTrendingUp size={18} /> LONG
          </button>

          <button
            type="button"
            onClick={() => updateForm({ direction: "Short" })}
            className={
              form.direction === "Short"
                ? `${directionBase} ${shortActiveClass}`
                : `${directionBase} ${directionInactiveClass}`
            }
          >
            <FiTrendingDown size={18} /> SHORT
          </button>
        </div>
      </div>
    </div>
  );
}
