// src/pages/Monthly.jsx
import React, { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { TrendingUp, TrendingDown, Calendar, Target, AlertTriangle, Award, Flame } from 'lucide-react';
import { API_BASE_URL } from "../config/api";

export default function Monthly() {
  const [trades, setTrades] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/trades`)
      .then(r => r.json())
      .then(data => {
        // Chỉ lấy lệnh LIVE (không lấy backtest)
        setTrades(data.filter(t => t.type !== 'backtest'));
      });
  }, []);

  // Lọc theo tháng được chọn
  const monthTrades = trades.filter(t => {
    if (!t.date) return false;
    const tradeMonth = t.date.substring(0, 7); // yyyy-MM
    return tradeMonth === selectedMonth;
  });

  const totalProfit = monthTrades.reduce((s, t) => s + (t.profit || 0), 0);
  const totalPct = monthTrades.reduce((s, t) => s + (t.profit_pct || 0), 0);
  const winrate = monthTrades.length > 0
    ? (monthTrades.filter(t => t.profit > 0).length / monthTrades.length * 100).toFixed(1)
    : 0;
  const avgRR = monthTrades.length > 0
    ? (monthTrades.reduce((s, t) => s + (t.rr || 0), 0) / monthTrades.filter(t => t.profit > 0).length || 1).toFixed(2)
    : 0;

  const bestTrade = monthTrades
    .filter(t => t.profit > 0)
    .reduce((best, t) =>
      !best || t.profit > best.profit ? t : best, null);
  const worstTrade = monthTrades
    .filter(t => t.profit < 0)  // chỉ xét các lệnh lỗ
    .reduce((worst, t) =>
      !worst || t.profit < worst.profit ? t : worst, null);
  const streak = (() => {
    let current = 0, best = 0;
    for (const t of [...monthTrades].sort((a, b) => new Date(a.date) - new Date(b.date))) {
      if (t.profit > 0) {
        current++;
        best = Math.max(best, current);
      } else if (t.profit < 0) {
        current = 0;
      }
    }
    return best;
  })();

  // Generate last 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return format(date, 'yyyy-MM');
  }).reverse();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-4">
              <Calendar className="w-12 h-12 text-yellow-500" />
              Monthly Review
            </h1>
            <p className="text-2xl text-gray-300 mt-3 font-medium tracking-wide">
              Đánh giá hiệu suất hàng tháng – <span className="text-yellow-500 font-bold">Nơi bạn thực sự tiến bộ</span>
            </p>
          </div>

          {/* Chọn tháng */}
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="px-6 py-3 bg-gray-800 rounded-xl text-lg font-semibold border border-gray-700 focus:border-yellow-500 outline-none"
          >
            {months.map(m => (
              <option key={m} value={m}>
                {format(new Date(m + '-01'), 'MMMM yyyy')}
              </option>
            ))}
          </select>
        </div>

        {/* Big Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 shadow-xl">
            <div className="text-5xl font-bold">{totalProfit.toFixed(1)}</div>
            <div className="text-green-200 mt-2 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" /> Net Profit ($)
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-xl">
            <div className="text-5xl font-bold">{totalPct.toFixed(1)}%</div>
            <div className="text-blue-200 mt-2">Return %</div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-xl">
            <div className="text-5xl font-bold">{winrate}%</div>
            <div className="text-purple-200 mt-2">Win Rate</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-6 shadow-xl">
            <div className="text-5xl font-bold">1:{avgRR}</div>
            <div className="text-yellow-200 mt-2 flex items-center gap-2">
              <Target className="w-6 h-6" /> Avg R:R
            </div>
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-green-400">Best Trade</h3>
              <Award className="w-8 h-8 text-green-400" />
            </div>
            {bestTrade ? (
              <div>
                <div className="text-3xl font-bold text-green-400">+{bestTrade.profit?.toFixed(1)}</div>
                <div className="text-gray-400">{bestTrade.symbol} • {bestTrade.setup}</div>
                <div className="text-sm text-gray-500 mt-2">{format(new Date(bestTrade.date), 'dd/MM')}</div>
              </div>
            ) : <p className="text-gray-500">Chưa có</p>}
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-red-400">Worst Trade</h3>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            {worstTrade ? (
              <div>
                <div className="text-3xl font-bold text-red-400">{worstTrade.profit?.toFixed(1)}</div>
                <div className="text-gray-400">{worstTrade.symbol} • {worstTrade.setup}</div>
                <div className="text-sm text-gray-500 mt-2">{format(new Date(worstTrade.date), 'dd/MM')}</div>
              </div>
            ) : <p className="text-gray-500">Chưa có</p>}
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Win Streak</h3>
              <Flame className="w-10 h-10" />
            </div>
            <div className="text-5xl font-bold">{streak}</div>
            <div className="text-orange-200">lệnh thắng liên tiếp</div>
          </div>
        </div>

        {/* Lessons & Action Plan */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Đã làm tốt tháng này</h2>
            <ul className="space-y-3 text-lg">
              <li>• Tuân thủ kế hoạch giao dịch</li>
              <li>• Không revenge trade</li>
              <li>• Giữ R:R ≥ 1:2</li>
              <li>• Không trade news</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-rose-600 to-purple-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Cần cải thiện tháng sau</h2>
            <ul className="space-y-3 text-lg">
              <li>• Tránh FOMO vào cuối phiên NY</li>
              <li>• Không đu trend khi không có confirmation</li>
              <li>• Ghi nhật ký đầy đủ hơn</li>
              <li>• Tập trung vào 2 setup mạnh nhất</li>
            </ul>
          </div>
        </div>

        {/* Quote truyền cảm hứng */}
        <div className="mt-12 text-center py-8 bg-gradient-to-r from-purple-900 to-blue-900 rounded-3xl">
          <p className="text-3xl font-bold italic">
            “Amateurs practice until they get it right.
          </p>
          <p className="text-3xl font-bold italic mt-4">
            Professionals practice until they can't get it wrong.”
          </p>
          <p className="text-xl text-gray-300 mt-6">— Mark Minervini</p>
        </div>
      </div>
    </div>
  );
}