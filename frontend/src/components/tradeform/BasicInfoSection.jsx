// components/tradeform/BasicInfoSection.jsx
import CreatableSelect from "react-select/creatable";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { darkSelect } from "./SelectStyles";

export default function BasicInfoSection({
  form,
  updateForm,
  symbolOptions,
  setupOptions,
  onSetupSelect,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div>
        <label className="text-xs font-semibold text-gray-300">Date</label>
        <input
          type="date"
          lang="vi"
          className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-[#161b22] text-white"
          value={form.date || ""}
          onChange={(e) => updateForm({ date: e.target.value })}
        />
        {!form.date && (
          <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
            Bắt buộc
          </p>
        )}
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-300">Symbol</label>
        <CreatableSelect
          styles={darkSelect}
          options={symbolOptions}
          value={
            form.symbol ? { value: form.symbol, label: form.symbol } : null
          }
          onChange={(opt) => updateForm({ symbol: opt?.value || "" })}
          placeholder="EUR/USD, XAU/USD..."
        />
        {!form.symbol && (
          <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
            Bắt buộc
          </p>
        )}
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-300">Setup</label>
        <CreatableSelect
          styles={darkSelect}
          options={setupOptions}
          value={form.setup ? { value: form.setup, label: form.setup } : null}
          onChange={onSetupSelect}
          placeholder="Chọn setup theo Playbook..."
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-300 block mb-2">
          Direction
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => updateForm({ direction: "Long" })}
            className={`flex-1 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
              form.direction === "Long"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                : "bg-[#161b22] text-gray-400 border border-gray-700 hover:border-emerald-500"
            }`}
          >
            <FiTrendingUp size={18} /> LONG
          </button>
          <button
            onClick={() => updateForm({ direction: "Short" })}
            className={`flex-1 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
              form.direction === "Short"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                : "bg-[#161b22] text-gray-400 border border-gray-700 hover:border-red-500"
            }`}
          >
            <FiTrendingDown size={18} /> SHORT
          </button>
        </div>
        {!form.direction && (
          <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
            Chọn Long hoặc Short
          </p>
        )}
      </div>
    </div>
  );
}
