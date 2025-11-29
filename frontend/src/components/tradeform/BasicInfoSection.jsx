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
  symbolInputRef,   // <-- nhận ref
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

      {/* DATE */}
      <div>
        <label className="text-xs font-semibold text-gray-300">Date</label>
        <input
          type="date"
          lang="vi"
          className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-[#161b22] text-white"
          value={form.date || ""}
          onChange={(e) => updateForm({ date: e.target.value })}
        />
        {/* ... thông báo lỗi */}
      </div>

      {/* SYMBOL – REF ĐÚNG Ở ĐÂY */}
      <div>
        <label className="text-xs font-semibold text-gray-300">Symbol</label>
        <CreatableSelect
          ref={symbolInputRef}               // <-- focus vào Symbol
          styles={darkSelect}
          options={symbolOptions}
          value={form.symbol ? { value: form.symbol, label: form.symbol } : null}
          onChange={(opt) => updateForm({ symbol: opt?.value || "" })}
          placeholder="EUR/USD, XAU/USD..."
        />
        {/* ... thông báo lỗi */}
      </div>

      {/* SETUP */}
      <div>
        <label className="text-xs font-semibold text-gray-300">Setup</label>
        <CreatableSelect
          styles={darkSelect}
          options={setupOptions}
          value={form.setup ? { value: form.setup, label: form.setup } : null}
          onChange={onSetupSelect}
          placeholder="Chọn setup..."
        />
      </div>

      {/* DIRECTION – THÊM type="button" */}
      <div>
        <label className="text-xs font-semibold text-gray-300 block mb-2">
          Direction
        </label>
        <div className="flex gap-3">
          <button
            type="button"                     // NGĂN SUBMIT
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
            type="button"                     // NGĂN SUBMIT
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
        {/* ... thông báo lỗi */}
      </div>
    </div>
  );
}