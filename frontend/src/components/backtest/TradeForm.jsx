import React, { useState } from "react";
import { CheckCircle2, XCircle, Image as ImageIcon } from "lucide-react";
import { SETUP_TYPES, RESULT_TYPES } from "./constants";
import { format } from "date-fns";

export default function TradeForm({ onClose, onSave, theme = "dark" }) {
  const isDark = theme === "dark";

  const [form, setForm] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    symbol: "EURUSD",
    timeframe: "H1",
    setup: "pinbar",
    direction: "long",
    entry: "",
    sl: "",
    tp: "",
    result: "win",
    rr: "2",
    confluence: [],
    notes: "",
    screenshot: null,
  });

  const saveTrade = () => {
    const trade = {
      id: Date.now(),
      ...form,
      profit:
        form.result === "win"
          ? parseFloat(form.rr)
          : form.result === "be"
          ? 0
          : -1,
      date: new Date(form.date),
    };

    onSave(trade);
    onClose();
  };

  // ──────────────────────────────────────────────────────────────
  // THEME CLASSES
  // ──────────────────────────────────────────────────────────────
  const modalBg =
    "fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4";

  const panelClass = [
    // thêm max-h & flex-col để body scroll bên trong
    "rounded-2xl max-w-3xl w-full shadow-2xl border flex flex-col max-h-[90vh]",
    isDark
      ? "bg-slate-900 border-slate-700 text-slate-100"
      : "bg-white border-slate-200 text-slate-900",
  ].join(" ");

  const headingClass = "text-2xl md:text-3xl font-bold";

  const closeBtnClass = [
    "transition",
    isDark
      ? "text-slate-400 hover:text-slate-100"
      : "text-slate-400 hover:text-slate-700",
  ].join(" ");

  const labelClass = `block mb-2 text-sm font-medium ${
    isDark ? "text-slate-200" : "text-slate-700"
  }`;

  const inputBase =
    "w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-1 transition";
  const inputTheme = isDark
    ? "bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
    : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500";
  const inputClass = `${inputBase} ${inputTheme}`;

  const textareaClass = `${inputBase} ${
    isDark
      ? "bg-slate-800 border border-slate-700 text-slate-100"
      : "bg-white border border-slate-300 text-slate-900"
  } resize-none`;

  const segmentBtnBase =
    "flex-1 py-3 rounded-lg font-semibold text-sm transition border";
  const longActive = isDark
    ? "bg-emerald-600 text-white border-transparent shadow-lg shadow-emerald-600/30"
    : "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/30";
  const shortActive = isDark
    ? "bg-red-600 text-white border-transparent shadow-lg shadow-red-600/30"
    : "bg-red-500 text-white border-red-500 shadow-md shadow-red-500/30";
  const dirInactive = isDark
    ? "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500"
    : "bg-slate-100 text-slate-700 border-slate-300 hover:border-slate-400";

  const resultInactive = isDark
    ? "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500"
    : "bg-slate-100 text-slate-700 border-slate-300 hover:border-slate-400";

  const uploadAreaClass = [
    "border-2 border-dashed rounded-lg p-8 text-center",
    isDark
      ? "border-slate-600 bg-slate-900/60"
      : "border-slate-300 bg-slate-50",
  ].join(" ");

  const uploadBtnClass = [
    "px-6 py-3 rounded-lg text-sm font-semibold transition",
    "bg-blue-600 hover:bg-blue-700 text-white",
  ].join(" ");

  const cancelActionClass = [
    "px-8 py-3 rounded-lg text-sm font-semibold transition border",
    isDark
      ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
      : "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200",
  ].join(" ");

  const saveBtnClass = [
    "px-8 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 transition bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed",
    "hover:from-blue-500 hover:to-purple-500",
  ].join(" ");

  const screenshotImgClass = [
    "w-full rounded-xl border",
    isDark ? "border-slate-600" : "border-slate-300",
  ].join(" ");

  const screenshotRemoveBtnClass = [
    "absolute top-2 right-2 p-2 rounded-lg transition",
    isDark
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-red-500 hover:bg-red-600 text-white",
  ].join(" ");

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div className={modalBg}>
      <div className={panelClass}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-6 pt-6">
          <h2 className={headingClass}>Thêm lệnh Backtest</h2>
          <button onClick={onClose} className={closeBtnClass}>
            <XCircle className="w-7 h-7" />
          </button>
        </div>

        {/* BODY – scroll bên trong nếu cao quá */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* LEFT COLUMN */}
            <div className="space-y-5">
              {/* Ngày */}
              <div>
                <label className={labelClass}>Ngày</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Cặp tiền */}
              <div>
                <label className={labelClass}>Cặp tiền</label>
                <select
                  value={form.symbol}
                  onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                  className={inputClass}
                >
                  {[
                    "EUR/USD",
                    "GBP/USD",
                    "USD/JPY",
                    "AUD/USD",
                    "USD/CAD",
                    "NZD/USD",
                    "XAU/USD",
                    "BTC/USD",
                  ].map((pair) => (
                    <option key={pair} value={pair}>
                      {pair}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timeframe */}
              <div>
                <label className={labelClass}>Khung thời gian</label>
                <select
                  value={form.timeframe}
                  onChange={(e) =>
                    setForm({ ...form, timeframe: e.target.value })
                  }
                  className={inputClass}
                >
                  <option>M1</option>
                  <option>M5</option>
                  <option>M15</option>
                  <option>M30</option>
                  <option>H1</option>
                  <option>H4</option>
                  <option>D1</option>
                </select>
              </div>

              {/* Setup */}
              <div>
                <label className={labelClass}>Setup</label>
                <select
                  value={form.setup}
                  onChange={(e) => setForm({ ...form, setup: e.target.value })}
                  className={inputClass}
                >
                  {SETUP_TYPES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Direction */}
              <div>
                <label className={labelClass}>Hướng</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, direction: "long" })}
                    className={`${segmentBtnBase} ${
                      form.direction === "long" ? longActive : dirInactive
                    }`}
                  >
                    LONG
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, direction: "short" })}
                    className={`${segmentBtnBase} ${
                      form.direction === "short" ? shortActive : dirInactive
                    }`}
                  >
                    SHORT
                  </button>
                </div>
              </div>

              {/* Entry / SL / TP */}
              <div className="grid grid-cols-3 gap-3">
                <input
                  placeholder="Entry"
                  value={form.entry}
                  onChange={(e) => setForm({ ...form, entry: e.target.value })}
                  className={inputClass}
                />
                <input
                  placeholder="SL"
                  value={form.sl}
                  onChange={(e) => setForm({ ...form, sl: e.target.value })}
                  className={inputClass}
                />
                <input
                  placeholder="TP"
                  value={form.tp}
                  onChange={(e) => setForm({ ...form, tp: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* R:R */}
              <div>
                <label className={labelClass}>R:R</label>
                <select
                  value={form.rr}
                  onChange={(e) => setForm({ ...form, rr: e.target.value })}
                  className={inputClass}
                >
                  {[1, 1.5, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>{`1:${r}`}</option>
                  ))}
                </select>
              </div>

              {/* KẾT QUẢ - AI 2025 PRO STYLE */}
              <div>
                <label className={labelClass}>Kết quả</label>
                <div className="flex justify-center gap-3 mt-3">
                  {RESULT_TYPES.map((r) => {
                    const isActive = form.result === r.value;

                    const baseClass = `
        min-w-28 px-4 py-3 rounded-xl flex items-center justify-center gap-2
        font-semibold text-sm transition-all duration-200 shadow-md
        hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/30
      `;

                    let bgGradient = "";
                    let textColor = "";
                    let ringColor = "";

                    if (r.value === "win") {
                      bgGradient =
                        "bg-gradient-to-r from-emerald-500 to-emerald-600";
                      textColor = "text-white";
                      ringColor = "ring-emerald-400/40";
                    } else if (r.value === "loss") {
                      bgGradient = "bg-gradient-to-r from-rose-500 to-rose-600";
                      textColor = "text-white";
                      ringColor = "ring-rose-400/40";
                    } else {
                      bgGradient = isDark
                        ? "bg-gradient-to-r from-amber-500 to-amber-600"
                        : "bg-gradient-to-r from-amber-400 to-amber-500";
                      textColor = isDark ? "text-gray-900" : "text-gray-800";
                      ringColor = "ring-amber-400/40";
                    }

                    const inactiveClass = isDark
                      ? "bg-slate-800/80 hover:bg-slate-700 text-slate-400 border border-slate-700"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300";

                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setForm({ ...form, result: r.value })}
                        className={[
                          baseClass,
                          isActive
                            ? `${bgGradient} ${textColor} ring- ring-offset-2 ${ringColor} shadow-lg`
                            : inactiveClass,
                        ].join(" ")}
                      >
                        <r.icon
                          className={`w-5 h-5 ${isActive ? textColor : ""}`}
                        />
                        <span>{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-5">
              {/* Notes */}
              <div>
                <label className={labelClass}>Ghi chú</label>
                <textarea
                  rows={6}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className={textareaClass}
                />
              </div>

              {/* Screenshot */}
              <div>
                <label className={labelClass}>Ảnh chart</label>

                {form.screenshot ? (
                  <div className="relative">
                    <img src={form.screenshot} className={screenshotImgClass} />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, screenshot: null })}
                      className={screenshotRemoveBtnClass}
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className={uploadAreaClass}>
                    <ImageIcon
                      className={`w-16 h-16 mx-auto mb-2 ${
                        isDark ? "text-slate-500" : "text-slate-400"
                      }`}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      id="imgUpload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () =>
                            setForm({
                              ...form,
                              screenshot: reader.result,
                            });
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("imgUpload")?.click()
                      }
                      className={uploadBtnClass}
                    >
                      Upload ảnh
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS – luôn dính đáy panel */}
        <div className="flex justify-end gap-4 px-6 py-4 border-t border-slate-800/40 flex-shrink-0">
          <button onClick={onClose} className={cancelActionClass}>
            Hủy
          </button>

          <button
            onClick={saveTrade}
            disabled={!form.entry || !form.sl}
            className={saveBtnClass}
          >
            <CheckCircle2 className="w-5 h-5" />
            Lưu lệnh
          </button>
        </div>
      </div>
    </div>
  );
}
