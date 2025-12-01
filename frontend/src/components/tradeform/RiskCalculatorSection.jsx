// components/tradeform/RiskCalculatorSection.jsx

export default function RiskCalculatorSection({
  form,
  updateForm,
  riskPct,
  setRiskPct,
  position,
  theme = "dark",
}) {
  const isDirectionSelected = !!form.direction;
  const isDark = theme === "dark";

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

  // ──────────────────────────────────────────────────────────────
  // THEME CLASSES
  // ──────────────────────────────────────────────────────────────
  const cardBase = "p-8 rounded-2xl border shadow-inner mb-8";
  const cardTheme = isDark
    ? "bg-[#111827] border-gray-700"
    : "bg-white border-gray-200 shadow-md";
  const cardClass = `${cardBase} ${cardTheme}`;

  const titleClass = `text-xl font-bold mb-6 text-center ${
    isDark ? "text-blue-300" : "text-blue-600"
  }`;

  const disabledClass = !isDirectionSelected
    ? "opacity-60 cursor-not-allowed"
    : "";

  // ENTRY input
  const entryInputClass = [
    "mt-1 w-full rounded-lg px-4 py-3 font-mono text-lg border focus:outline-none focus:ring-1 transition",
    isDark
      ? "bg-[#0f172a] border-blue-600 text-blue-300 focus:border-blue-400 focus:ring-blue-400/40"
      : "bg-white border-blue-300 text-blue-700 focus:border-blue-500 focus:ring-blue-500/30 shadow-sm",
    disabledClass,
  ].join(" ");

  // SL input
  const slBase =
    "mt-1 w-full rounded-lg px-4 py-3 font-mono text-lg focus:outline-none focus:ring-1 transition border";
  const slTheme = isDark
    ? slInvalid
      ? "bg-[#0f172a] border-red-500 text-red-300 focus:border-red-400 focus:ring-red-400/40"
      : "bg-[#0f172a] border-red-600 text-red-300 focus:border-red-400 focus:ring-red-400/40"
    : slInvalid
    ? "bg-white border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500/30 shadow-sm"
    : "bg-white border-red-300 text-red-600 focus:border-red-400 focus:ring-red-400/30 shadow-sm";
  const slInputClass = [slBase, slTheme, disabledClass].join(" ");

  // TP input
  const tpBase =
    "mt-1 w-full rounded-lg px-4 py-3 font-mono text-lg focus:outline-none focus:ring-1 transition border";
  const tpTheme = isDark
    ? tpInvalid
      ? "bg-[#0f172a] border-red-500 text-red-300 focus:border-red-400 focus:ring-red-400/40"
      : "bg-[#0f172a] border-green-600 text-green-300 focus:border-green-400 focus:ring-green-400/40"
    : tpInvalid
    ? "bg-white border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500/30 shadow-sm"
    : "bg-white border-green-400 text-green-700 focus:border-green-500 focus:ring-green-500/30 shadow-sm";
  const tpInputClass = [tpBase, tpTheme, disabledClass].join(" ");

  // Risk % select
  const riskSelectClass = [
    "w-full border rounded-xl px-4 py-4 text-lg shadow focus:outline-none",
    isDark
      ? "border-purple-500 bg-[#0f172a] text-purple-300 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/40"
      : "border-purple-300 bg-white text-purple-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30",
  ].join(" ");

  const labelEntryClass = `text-xs font-semibold ${
    isDark ? "text-blue-400" : "text-blue-600"
  }`;
  const labelSlClass = `text-xs font-semibold ${
    isDark ? "text-red-400" : "text-red-500"
  }`;
  const labelTpClass = `text-xs ${
    isDark ? "text-gray-400" : "text-gray-600"
  }`;
  const labelRiskClass = `text-xs font-bold ${
    isDark ? "text-purple-400" : "text-purple-600"
  }`;

  const errorTextClass = `text-xs mt-1 flex items-center gap-1 ${
    isDark ? "text-red-400" : "text-red-500"
  }`;

  const errorDotClass = `w-1 h-1 rounded-full ${
    isDark ? "bg-red-400" : "bg-red-500"
  }`;

  // Position summary box
  const summaryCardBase =
    "mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-2xl border text-center";
  const summaryCardTheme = isDark
    ? "bg-[#0f172a] border-gray-700 shadow-xl"
    : "bg-slate-50 border-gray-200 shadow-lg";
  const summaryCardClass = `${summaryCardBase} ${summaryCardTheme}`;

  const summaryLabelClass = `text-xs ${
    isDark ? "text-gray-400" : "text-gray-500"
  }`;

  const riskAmountClass = `text-2xl font-black ${
    isDark ? "text-red-400" : "text-red-500"
  }`;
  const lotSizeClass = `text-2xl font-black ${
    isDark ? "text-blue-400" : "text-blue-600"
  }`;
  const stopTextClass = `text-[11px] mt-1 ${
    isDark ? "text-gray-500" : "text-gray-500"
  }`;
  const lotNoteClass = `text-xs mt-2 font-medium ${
    isDark ? "text-orange-400" : "text-orange-500"
  }`;
  const rrTextClass = `text-2xl font-black ${
    isDark ? "text-purple-400" : "text-purple-600"
  }`;

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div className={cardClass}>
      <h3 className={titleClass}>Risk &amp; Position Calculator (Auto)</h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ENTRY */}
        <div>
          <label className={labelEntryClass}>Entry Price</label>
          <input
            type="number"
            step="0.00001"
            placeholder="1.08500"
            className={entryInputClass}
            value={form.entry || ""}
            onChange={handlePriceChange("entry")}
            disabled={!isDirectionSelected}
          />
        </div>

        {/* SL */}
        <div>
          <label className={labelSlClass}>Stop Loss</label>
          <input
            type="number"
            step="0.00001"
            placeholder="1.08000"
            className={slInputClass}
            value={form.sl || ""}
            onChange={handlePriceChange("sl")}
            disabled={!isDirectionSelected}
          />
          {slError && (
            <p className={errorTextClass}>
              <span className={errorDotClass} />
              {slError}
            </p>
          )}
        </div>

        {/* TP */}
        <div>
          <label className={labelTpClass}>Take Profit (TP)</label>
          <input
            type="number"
            step="0.00001"
            className={tpInputClass}
            value={form.tp || ""}
            onChange={handlePriceChange("tp")}
            disabled={!isDirectionSelected}
          />
          {tpError && (
            <p className={errorTextClass}>
              <span className={errorDotClass} />
              {tpError}
            </p>
          )}
        </div>

        {/* RISK % */}
        <div>
          <label className={labelRiskClass}>Risk %</label>
          <select
            className={riskSelectClass}
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
        <div className={summaryCardClass}>
          <div>
            <div className={summaryLabelClass}>Risk Amount</div>
            <div className={riskAmountClass}>
              ${position.riskAmount.toLocaleString()}
            </div>
          </div>

          <div>
            <div className={summaryLabelClass}>Lot Size</div>
            <div className={lotSizeClass}>{position.lotSize}</div>
            {position.stopTicks > 0 && (
              <div className={stopTextClass}>
                Stop: {position.stopTicks} {position.unitLabel}
              </div>
            )}
            {position.lotNote && (
              <div className={lotNoteClass}>{position.lotNote}</div>
            )}
          </div>

          <div>
            <div className={summaryLabelClass}>Actual R:R</div>
            <div className={rrTextClass}>
              {form.tp ? `1:${position.actualRR.toFixed(2)}` : "—"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
