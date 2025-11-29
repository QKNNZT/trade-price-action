// components/tradeform/TradeForm.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-hot-toast";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);
  const symbolInputRef = useRef(null);

  const position = usePositionSize(form, riskPct);

  // Auto set today nếu chưa có date
  useEffect(() => {
    if (!form.date) {
      const today = new Date().toISOString().split("T")[0];
      setForm((prev) => ({ ...prev, date: today }));
    }
  }, [form.date, setForm]);

  // Auto focus Symbol sau reset
  useEffect(() => {
    if (!form.symbol && symbolInputRef.current) {
      symbolInputRef.current.focus();
    }
  }, [form.symbol]);

  // Scroll lên đầu form sau khi reset
  useEffect(() => {
    if (form.date && !form.symbol) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [form.date, form.symbol]);

  const updateForm = (updates) =>
    setForm((prev) => ({ ...prev, ...updates }));

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

  // RESET FORM
  const resetForm = () => {
    const today = new Date().toISOString().split("T")[0];
    setForm({
      date: today,
      symbol: "",
      direction: "",
      entry: "",
      sl: "",
      tp: "",
      capital: "",
      setup: "",
      timeframe: "",
      session: "",
      confluence: [],
      market_bias: "",
      structure: "",
      entry_model: [],
      management: "",
      mistakes: [],
      grade: "",
      review: "",
      entry_reason: "",
      chart_before: null,
      chart_after: null,
    });
    setRiskPct(1);
  };

  // SUBMIT HANDLER
  const handleAddTrade = async (e) => {
    e?.preventDefault();
    if (isSubmitting) return;

    const errors = validateTradeForm(form, position);
    if (errors.length > 0) {
      toast.error(
        <div className="text-left">
          <strong>Lỗi nhập liệu:</strong>
          <ul className="mt-1">
            {errors.map((err, i) => (
              <li key={i}>• {err}</li>
            ))}
          </ul>
        </div>
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const trade = {
        ...form,
        tp: form.tp || "",
        rr: position.actualRR > 0 ? position.actualRR : null,
      };

      await addTrade(trade); // async await

      toast.success("Trade đã được thêm thành công!");
      resetForm();
    } catch (err) {
      toast.error("Lỗi: " + (err.message || "Không thể thêm trade"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // FORM VALIDATION
  const isFormValid =
    form.date &&
    form.symbol &&
    form.direction &&
    form.entry &&
    form.sl &&
    form.capital &&
    position.isValid &&
    form.chart_before; // BẮT BUỘC HÌNH

  return (
    <form
      ref={formRef}
      onSubmit={handleAddTrade}
      className="bg-[#0d1117] text-white p-8 rounded-2xl shadow-2xl mb-10 border border-[#1f2937]"
    >
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
        symbolInputRef={symbolInputRef} // truyền ref
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
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-xl py-6 rounded-xl shadow-xl hover:scale-105 transition flex items-center justify-center gap-3 transform-gpu ${
            !isFormValid || isSubmitting
              ? "opacity-40 cursor-not-allowed"
              : "hover:shadow-2xl"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
              <span>Đang thêm...</span>
            </>
          ) : (
            <>
              <FiUpload size={24} />
              ADD TRADE → AUTO CALC
            </>
          )}
        </button>
      </div>
    </form>
  );
}