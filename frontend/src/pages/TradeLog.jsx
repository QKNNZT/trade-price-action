import { useEffect, useState } from "react";
import TradeForm from "../components/tradeform/TradeForm";
import TradeTable from "../components/TradeTable";
import { API_BASE_URL } from "../config/api";

export default function TradeLog({ theme = "dark" }) {
  const isDark = theme === "dark";
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState({
    date: "",
    symbol: "",
    setup: "",
    direction: "",
    entry: "",
    sl: "",
    tp: "",
    capital: "",
    session: "",
    timeframe: "",
    confluence: [],
    entry_model: [],
    psychological_tags: [],
    entry_reason: "",
    lessons: "",
    htf_bias: "",
    trend_direction: "",
    structure_event: "",
    partial_tp: "",
    be_trigger: "",
    scale_mode: "",
  });

  const [deleteId, setDeleteId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const loadTrades = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/trades`);
      if (res.ok) {
        const data = await res.json();
        setTrades(data);
      }
    } catch (err) {
      console.error("Failed to load trades:", err);
    }
  };

  useEffect(() => {
    loadTrades();
  }, []);

  // ADD TRADE
  const addTrade = async () => {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === "chart_before" && form[key] instanceof File) {
        formData.append("chart_before", form[key]);
      } else if (Array.isArray(form[key])) {
        formData.append(key, JSON.stringify(form[key].map((o) => o.value)));
      } else {
        formData.append(key, form[key] || "");
      }
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/trades`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setForm({
          date: "",
          symbol: "",
          setup: "",
          direction: "",
          entry: "",
          sl: "",
          tp: "",
          capital: "",
          session: "",
          timeframe: "",
          confluence: [],
          entry_model: [],
          psychological_tags: [],
          entry_reason: "",
          lessons: "",
          htf_bias: "",
          trend_direction: "",
          structure_event: "",
          partial_tp: "",
          be_trigger: "",
          scale_mode: "",
        });
        loadTrades();
      } else {
        alert("Thêm lệnh thất bại!");
      }
    } catch (err) {
      alert("Lỗi kết nối!");
    }
  };

  // UPDATE EXIT
  const updateExit = async (id, exitPrice) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/update_exit/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exit: exitPrice }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTrades((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
      } else {
        alert("Cập nhật exit thất bại!");
      }
    } catch (err) {
      alert("Lỗi kết nối!");
    }
  };

  // DELETE TRADE
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDialog(true);
  };

  const deleteTrade = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/trades/${deleteId}`, {
        method: "DELETE",
      });
      setShowDialog(false);
      loadTrades();
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  // REVIEW MODAL UPDATE
  const handleTradeUpdated = (updatedTrade) => {
    setTrades((prev) =>
      prev.map((t) => (t.id === updatedTrade.id ? updatedTrade : t))
    );
  };

  const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-[#0a0d14] to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      } px-4 sm:px-6 py-6 transition-colors duration-300`}
    >
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <header className="text-center mb-8">
          <h1
            className={`text-4xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Trade Log Pro
          </h1>
          <p
            className={`mt-2 text-lg ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Theo dõi, phân tích và cải thiện từng lệnh
          </p>
        </header>

        {/* FORM + TABLE */}
        <div className="space-y-8">
          <TradeForm
            form={form}
            setForm={setForm}
            addTrade={addTrade}
            theme={theme}
          />

          <div
            className={`rounded-3xl border ${
              isDark
                ? "border-gray-700 bg-gray-800/90 backdrop-blur-md"
                : "border-gray-200 bg-white/90 backdrop-blur-md"
            } p-6 shadow-2xl overflow-hidden`}
          >
            <TradeTable
              trades={trades}
              confirmDelete={confirmDelete}
              updateExit={updateExit}
              totalProfit={totalProfit}
              onTradeUpdated={handleTradeUpdated}
              theme={theme}
            />
          </div>
        </div>

        {/* DELETE DIALOG */}
        {showDialog && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className={`rounded-2xl p-8 max-w-sm w-full shadow-2xl border ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              <h2 className="text-xl font-bold text-red-500 mb-4 text-center">
                Xác nhận xóa lệnh?
              </h2>
              <p className="text-center mb-6">
                Hành động này{" "}
                <span className="text-red-500 font-bold">
                  không thể hoàn tác
                </span>
                .
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowDialog(false)}
                  className={`px-6 py-2.5 rounded-xl font-medium transition ${
                    isDark
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Hủy
                </button>
                <button
                  onClick={deleteTrade}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-bold hover:scale-105 transition"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
