// components/tradeform/ContextSection.jsx
import CreatableSelect from "react-select/creatable";
import { sessions, timeframes, confluenceOptions } from "./tradeOptions";
import { darkSelect } from "./SelectStyles";

export default function ContextSection({ form, updateForm, handleMultiChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
      <div className="md:col-span-2">
        <label className="block text-xs text-gray-400 font-medium mb-1">
          Account Capital ($)
        </label>
        <input
          type="number"
          placeholder="100000"
          className="w-full h-12 bg-[#161b22] border border-gray-700 rounded-lg px-4 text-white focus:border-gray-500 transition"
          value={form.capital || ""}
          onChange={(e) => updateForm({ capital: e.target.value })}
        />
        {(!form.capital || parseFloat(form.capital) <= 0) && (
          <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
            Capital phải lớn hơn 0
          </p>
        )}
      </div>

      <div className="md:col-span-3">
        <label className="block text-xs font-semibold text-gray-300 mb-1">
          Session
        </label>
        <select
          className="w-full h-12 bg-[#161b22] border border-gray-700 rounded-lg px-4 text-white focus:border-gray-500 transition"
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

      <div className="md:col-span-3">
        <label className="block text-xs font-semibold text-gray-300 mb-1">
          Timeframe
        </label>
        <select
          className="w-full h-12 bg-[#161b22] border border-gray-700 rounded-lg px-4 text-white focus:border-gray-500 transition"
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

      <div className="md:col-span-4">
        <label className="block text-xs font-bold text-green-400 mb-1">
          Confluence (+)
        </label>
        <CreatableSelect
          isMulti
          options={confluenceOptions}
          value={form.confluence || []}
          onChange={handleMultiChange("confluence")}
          placeholder="FVG + Liquidity Grab + Order Block..."
          formatCreateLabel={(input) => `+ Thêm "${input}"`}
          styles={{
            ...darkSelect,
            control: (base) => ({
              ...darkSelect.control(base),
              backgroundColor: "#161b22",
              borderColor: "#374151",
              borderRadius: "12px",
              minHeight: "52px",
              height: "auto",
              padding: "4px 8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
              "&:hover": { borderColor: "#4b5563" },
            }),
            valueContainer: (base) => ({
              ...base,
              padding: "4px 8px",
              gap: "8px",
              flexWrap: "wrap",
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              padding: "2px 6px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: "500",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "#22d3ee",
              padding: "0",
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "#94a3b8",
              borderRadius: "6px",
              padding: "0 4px",
              cursor: "pointer",
              ":hover": {
                backgroundColor: "#ef4444",
                color: "white",
              },
            }),
            placeholder: (base) => ({
              ...base,
              color: "#64748b",
              fontSize: "14px",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#161b22",
              border: "1px solid #374151",
              borderRadius: "12px",
              marginTop: "8px",
              overflow: "hidden",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? "#1e40af"
                : state.isFocused
                ? "#1f2937"
                : "#161b22",
              color: state.isSelected ? "#fff" : "#e2e8f0",
              padding: "10px 16px",
              fontSize: "14px",
              ":active": { backgroundColor: "#1e40af" },
            }),
          }}
          classNamePrefix="react-select"
        />
      </div>
    </div>
  );
}
