// components/tradeform/TradeForm.jsx
import { useState, useEffect, useMemo } from "react";
import { FiUpload } from "react-icons/fi";

import { PLAYBOOK_SETUPS } from "../../config/playbookSetups";
import usePositionSize from "./hooks/usePositionSize";
import { validateTradeForm } from "./utils/validateTradeForm";

import BasicInfoSection from "./BasicInfoSection";
import RiskCalculatorSection from "./RiskCalculatorSection";
import ContextSection from "./ContextSection";
import MarketStructureSection from "./MarketStructureSection";
import EntryModelSection from "./EntryModelSection";
import TradeManagementSection from "./TradeManagementSection";
import ChartUploadSection from "./ChartUploadSection";

export default function TradeForm({ form, setForm, addTrade }) {
  const [riskPct, setRiskPct] = useState(1);

  // Tính position size với hook riêng
  const position = usePositionSize(form, riskPct);

  // Auto set today nếu chưa có date
  useEffect(() => {
    if (!form.date) {
      setForm((prev) => ({
        ...prev,
        date: new Date().toISOString().split("T")[0],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateForm = (updates) =>
    setForm((prev) => ({
      ...prev,
      ...updates,
    }));

  // Options từ Playbook
  const symbolOptions = useMemo(() => {
    const symbols = Array.from(
      new Set(PLAYBOOK_SETUPS.flatMap((s) => s.instruments || []))
    );
    return symbols.map((sym) => ({ value: sym, label: sym }));
  }, []);

  const setupOptions = useMemo(
    () =>
      PLAYBOOK_SETUPS.map((s) => ({
        value: s.name,
        label: `${s.name} (v${s.Version})`,
      })),
    []
  );

  const handleMultiChange = (field) => (selected) => {
    const values = selected
      ? selected.map((o) => ({ label: o.label, value: o.value }))
      : [];
    updateForm({ [field]: values });
  };

  const handleSetupSelect = (option) => {
    const setupName = option?.value || "";
    const selected = PLAYBOOK_SETUPS.find((s) => s.name === setupName);

    updateForm({
      setup: setupName,
      symbol: selected?.instruments?.[0] || form.symbol || "",
      timeframe: selected?.timeframes?.[0] || form.timeframe || "",
    });
  };

  const handleAddTrade = () => {
    const errors = validateTradeForm(form, position);

    if (errors.length > 0) {
      alert("Lỗi nhập liệu:\n\n" + errors.join("\n"));
      return;
    }

    const trade = {
      ...form,
      tp: form.tp || "",
      rr: position.actualRR > 0 ? position.actualRR : null,
    };

    addTrade(trade);
  };

  const isFormValid =
    form.date &&
    form.symbol &&
    form.direction &&
    form.entry &&
    form.sl &&
    form.capital &&
    position.isValid;

  return (
    <div className="bg-[#0d1117] text-white p-8 rounded-2xl shadow-2xl mb-10 border border-[#1f2937]">
      <h2 className="text-3xl font-bold mb-8 text-center drop-shadow-lg">
        Add New Trade{" "}
        <span className="text-blue-400">→ Auto Calculate Everything</span>
      </h2>

      {/* ROW 1: Date / Symbol / Setup / Direction */}
      <BasicInfoSection
        form={form}
        updateForm={updateForm}
        symbolOptions={symbolOptions}
        setupOptions={setupOptions}
        onSetupSelect={handleSetupSelect}
      />

      {/* AUTO CALCULATOR */}
      <RiskCalculatorSection
        form={form}
        updateForm={updateForm}
        riskPct={riskPct}
        setRiskPct={setRiskPct}
        position={position}
      />

      {/* CAPITAL + SESSION + TIMEFRAME + CONFLUENCE */}
      <ContextSection
        form={form}
        updateForm={updateForm}
        handleMultiChange={handleMultiChange}
      />

      {/* MARKET STRUCTURE */}
      <MarketStructureSection form={form} updateForm={updateForm} />

      {/* ENTRY MODEL */}
      <EntryModelSection form={form} handleMultiChange={handleMultiChange} />

      {/* TRADE MANAGEMENT */}
      <TradeManagementSection form={form} updateForm={updateForm} />

      {/* CHART + ENTRY REASON */}
      <ChartUploadSection form={form} updateForm={updateForm} />

      {/* ADD BUTTON */}
      <div className="mt-10">
        <button
          onClick={handleAddTrade}
          // disabled={!isFormValid || !form.chart_before}
          disabled={!isFormValid}
          className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-xl py-6 rounded-xl shadow-xl hover:scale-105 transition flex items-center justify-center gap-3 ${
            !isFormValid ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          <FiUpload size={24} />
          ADD TRADE → AUTO CALC
        </button>
      </div>
    </div>
  );
}
