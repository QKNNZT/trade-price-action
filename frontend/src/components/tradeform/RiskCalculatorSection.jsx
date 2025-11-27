// components/tradeform/RiskCalculatorSection.jsx

export default function RiskCalculatorSection({
  form,
  updateForm,
  riskPct,
  setRiskPct,
  position,
}) {
  const isDirectionSelected = !!form.direction;

  const handlePriceChange = (field) => (e) => {
    const val = e.target.value;

    // Chưa chọn Long/Short → không cho nhập
    if (!isDirectionSelected) return;

    // Cho phép xóa ô
    if (val === "") {
      updateForm({ [field]: "" });
      return;
    }

    const num = parseFloat(val);
    if (!(num > 0)) return; // chỉ nhận số dương

    // Cho nhập bình thường, không chặn
    updateForm({ [field]: val });
  };

  // ====== REAL-TIME VALIDATION CHO SL / TP ======
  const entryNum = parseFloat(form.entry);
  const slNum = parseFloat(form.sl);
  const tpNum = parseFloat(form.tp);
  const dir = form.direction;

  let slError = "";
  let tpError = "";

  // SL error theo direction
  if (dir && entryNum > 0 && slNum > 0) {
    if (dir === "Long" && slNum >= entryNum) {
      slError = "Với lệnh Long: SL phải nhỏ hơn Entry";
    }
    if (dir === "Short" && slNum <= entryNum) {
      slError = "Với lệnh Short: SL phải lớn hơn Entry";
    }
  }

  // TP error theo direction (chỉ check nếu TP có nhập)
  if (dir && entryNum > 0 && tpNum > 0) {
    if (dir === "Long" && tpNum <= entryNum) {
      tpError = "Với lệnh Long: TP phải lớn hơn Entry";
    }
    if (dir === "Short" && tpNum >= entryNum) {
      tpError = "Với lệnh Short: TP phải nhỏ hơn Entry";
    }
  }

  const slInvalid = !!slError;
  const tpInvalid = !!tpError;

  return (
    <div className="bg-[#111827] p-8 rounded-2xl border border-gray-700 shadow-inner mb-8">
      <h3 className="text-xl font-bold text-blue-300 mb-6 text-center">
        Risk & Position Calculator (Auto)
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ENTRY */}
        <div>
          <label className="text-xs text-blue-400 font-semibold">
            Entry Price
          </label>
          <input
            type="number"
            step="0.00001"
            placeholder="1.08500"
            className={`mt-1 w-full bg-[#0f172a] border border-blue-600 rounded-lg px-4 py-3 text-blue-300 font-mono text-lg focus:border-blue-400 transition ${
              !isDirectionSelected ? "opacity-60 cursor-not-allowed" : ""
            }`}
            value={form.entry || ""}
            onChange={handlePriceChange("entry")}
            disabled={!isDirectionSelected}
          />
        </div>

        {/* SL */}
        <div>
          <label className="text-xs text-red-400 font-semibold">
            Stop Loss
          </label>
          <input
            type="number"
            step="0.00001"
            placeholder="1.08000"
            className={`mt-1 w-full bg-[#0f172a] rounded-lg px-4 py-3 text-red-300 font-mono text-lg focus:border-red-400 transition border ${
              slInvalid ? "border-red-500" : "border-red-600"
            } ${!isDirectionSelected ? "opacity-60 cursor-not-allowed" : ""}`}
            value={form.sl || ""}
            onChange={handlePriceChange("sl")}
            disabled={!isDirectionSelected}
          />
          {slError && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-400 rounded-full" />
              {slError}
            </p>
          )}
        </div>

        {/* TP */}
        <div>
          <label className="text-xs text-gray-400">Take Profit (TP)</label>
          <input
            type="number"
            step="0.00001"
            className={`mt-1 w-full bg-[#0f172a] rounded-lg px-4 py-3 font-mono text-lg focus:border-green-400 transition border ${
              tpInvalid ? "border-red-500 text-red-300" : "border-green-600 text-green-300"
            } ${!isDirectionSelected ? "opacity-60 cursor-not-allowed" : ""}`}
            value={form.tp || ""}
            onChange={handlePriceChange("tp")}
            disabled={!isDirectionSelected}
          />
          {tpError && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-400 rounded-full" />
              {tpError}
            </p>
          )}
        </div>

        {/* RISK % */}
        <div>
          <label className="text-xs font-bold text-purple-400">Risk %</label>
          <select
            className="w-full border border-purple-500 rounded-xl px-4 py-4 text-lg bg-[#0f172a] text-purple-300 shadow"
            value={riskPct}
            onChange={(e) => setRiskPct(parseFloat(e.target.value))}
          >
            <option value="0.5">0.5%</option>
            <option value="1">1%</option>
            <option value="1.5">1.5%</option>
            <option value="2">2%</option>
          </select>
        </div>
      </div>

      {position.isValid && (
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6 bg-[#0f172a] p-6 rounded-2xl border border-gray-700 text-center shadow-xl">
          <div>
            <div className="text-xs text-gray-400">Risk Amount</div>
            <div className="text-2xl font-black text-red-400">
              ${position.riskAmount.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-400">Lot Size</div>
            <div className="text-2xl font-black text-blue-400">
              {position.lotSize}
            </div>
            {position.stopTicks > 0 && (
              <div className="text-[11px] text-gray-500 mt-1">
                Stop: {position.stopTicks} {position.unitLabel}
              </div>
            )}
            {position.lotNote && (
              <div className="text-xs text-orange-400 mt-2 font-medium">
                {position.lotNote}
              </div>
            )}
          </div>

          <div>
            <div className="text-xs text-gray-400">Actual R:R</div>
            <div className="text-2xl font-black text-purple-400">
              {form.tp ? `1:${position.actualRR.toFixed(2)}` : "—"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
