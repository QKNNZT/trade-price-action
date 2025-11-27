import React, { useState } from "react";
import { CheckCircle2, XCircle, Image as ImageIcon } from "lucide-react";
import { SETUP_TYPES, RESULT_TYPES } from "./constants";
import { format } from "date-fns";

export default function TradeForm({ onClose, onSave }) {
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

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl max-w-3xl w-full p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Thêm lệnh Backtest</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XCircle className="w-8 h-8" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            <div>
              <label className="block mb-2">Ngày</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-2">Cặp tiền</label>
              <select
                value={form.symbol}
                onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg"
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

            <div>
              <label className="block mb-2">Khung thời gian</label>
              <select
                value={form.timeframe}
                onChange={(e) =>
                  setForm({ ...form, timeframe: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-700 rounded-lg"
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

            <div>
              <label className="block mb-2">Setup</label>
              <select
                value={form.setup}
                onChange={(e) => setForm({ ...form, setup: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg"
              >
                {SETUP_TYPES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">Hướng</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setForm({ ...form, direction: "long" })}
                  className={`flex-1 py-3 rounded-lg font-semibold ${
                    form.direction === "long" ? "bg-green-600" : "bg-gray-700"
                  }`}
                >
                  LONG
                </button>

                <button
                  onClick={() => setForm({ ...form, direction: "short" })}
                  className={`flex-1 py-3 rounded-lg font-semibold ${
                    form.direction === "short" ? "bg-red-600" : "bg-gray-700"
                  }`}
                >
                  SHORT
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <input
                placeholder="Entry"
                value={form.entry}
                onChange={(e) => setForm({ ...form, entry: e.target.value })}
                className="px-4 py-3 bg-gray-700 rounded-lg"
              />
              <input
                placeholder="SL"
                value={form.sl}
                onChange={(e) => setForm({ ...form, sl: e.target.value })}
                className="px-4 py-3 bg-gray-700 rounded-lg"
              />
              <input
                placeholder="TP"
                value={form.tp}
                onChange={(e) => setForm({ ...form, tp: e.target.value })}
                className="px-4 py-3 bg-gray-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-2">R:R</label>
              <select
                value={form.rr}
                onChange={(e) => setForm({ ...form, rr: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg"
              >
                {[1, 1.5, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{`1:${r}`}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">Kết quả</label>
              <div className="flex gap-3">
                {RESULT_TYPES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setForm({ ...form, result: r.value })}
                    className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 ${
                      form.result === r.value
                        ? r.value === "win"
                          ? "bg-green-600"
                          : r.value === "loss"
                          ? "bg-red-600"
                          : "bg-yellow-600"
                        : "bg-gray-700"
                    }`}
                  >
                    <r.icon className="w-5 h-5" />
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            <div>
              <label className="block mb-2">Ghi chú</label>
              <textarea
                rows={6}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-2">Ảnh chart</label>

              {form.screenshot ? (
                <div className="relative">
                  <img
                    src={form.screenshot}
                    className="w-full rounded-xl border border-gray-600"
                  />
                  <button
                    onClick={() => setForm({ ...form, screenshot: null })}
                    className="absolute top-2 right-2 bg-red-600 p-2 rounded-lg"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                  <ImageIcon className="w-16 h-16 mx-auto text-gray-500 mb-2" />
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
                          setForm({ ...form, screenshot: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button
                    onClick={() => document.getElementById("imgUpload").click()}
                    className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Upload ảnh
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-700 rounded-lg"
          >
            Hủy
          </button>

          <button
            onClick={saveTrade}
            disabled={!form.entry || !form.sl}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-6 h-6" />
            Lưu lệnh
          </button>
        </div>
      </div>
    </div>
  );
}
