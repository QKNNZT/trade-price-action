import { useEffect, useState } from "react";
import TradeForm from "../components/tradeform/TradeForm";
import TradeTable from "../components/TradeTable";
import { API_BASE_URL } from "../config/api";

export default function TradeLog() {
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

  // Tái sử dụng 1 hàm fetch
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

  // TÍNH TOTAL PROFIT
  const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="mx-auto">
        {/* HEADER */}
        <h1 className="text-4xl font-black text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-lg">
          Trade Log Pro
        </h1>

        {/* FORM */}
        <div className="mb-12">
          <TradeForm form={form} setForm={setForm} addTrade={addTrade} />
        </div>

        {/* TABLE */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/10">
          <TradeTable
            trades={trades}
            confirmDelete={confirmDelete}
            updateExit={updateExit}
            totalProfit={totalProfit}
            onTradeUpdated={handleTradeUpdated}
          />
        </div>

        {/* DELETE DIALOG */}
        {showDialog && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
              <h2 className="text-xl font-bold text-red-400 mb-4 text-center">
                Xác nhận xóa lệnh?
              </h2>
              <p className="text-gray-300 text-center mb-6">
                Hành động này{" "}
                <span className="text-red-400 font-bold">
                  không thể hoàn tác
                </span>
                .
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowDialog(false)}
                  className="px-6 py-2.5 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition"
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
