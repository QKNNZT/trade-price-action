// src/pages/Statistics.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { format } from 'date-fns';
import { TrendingUp, Target, Flame, BarChart3 } from 'lucide-react';
import { API_BASE_URL } from "../config/api";

export default function Statistics() {
    const [trades, setTrades] = useState([]);
    const [filter, setFilter] = useState('all');

    // Load dữ liệu một lần
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/trades`)
            .then(r => r.json())
            .then(data => {
                setTrades(data.filter(t => t.type !== 'backtest'));
            })
            .catch(err => console.error("Load trades failed:", err));
    }, []);

    // Lọc trades theo năm
    const liveTrades = useMemo(() => {
        if (filter === 'all') return trades;
        return trades.filter(t => t.date?.startsWith(filter));
    }, [trades, filter]);

    // Tất cả tính toán chỉ chạy lại khi liveTrades thay đổi
    const stats = useMemo(() => {
        const totalTrades = liveTrades.length;
        if (totalTrades === 0) {
            return {
                totalTrades: 0,
                wins: 0,
                losses: 0,
                winrate: 0,
                totalProfit: 0,
                totalPct: 0,
                avgRR: 0,
                expectancy: 0,
                profitFactor: '∞',
                setupStats: {},
                bestSetup: null,
                worstSetup: null,
            };
        }

        const wins = liveTrades.filter(t => t.profit > 0);
        const losses = liveTrades.filter(t => t.profit < 0);

        const winCount = wins.length;
        const lossCount = losses.length;

        const totalProfit = liveTrades.reduce((s, t) => s + (t.profit || 0), 0);
        const totalPct = liveTrades.reduce((s, t) => s + (t.profit_pct || 0), 0);

        const grossProfit = wins.reduce((s, t) => s + t.profit, 0);
        const grossLoss = Math.abs(losses.reduce((s, t) => s + t.profit, 0));

        const avgRR = winCount > 0
            ? wins.reduce((s, t) => s + (t.rr || 0), 0) / winCount
            : 0;

        const profitFactor = grossLoss === 0 ? '∞' : (grossProfit / grossLoss).toFixed(2);

        // Thống kê theo setup
        const setupStats = liveTrades.reduce((acc, t) => {
            const key = t.setup || 'Unknown';
            if (!acc[key]) acc[key] = { win: 0, loss: 0, profit: 0, trades: 0 };
            acc[key].trades++;
            acc[key].profit += t.profit || 0;
            if (t.profit > 0) acc[key].win++;
            else if (t.profit < 0) acc[key].loss++;
            return acc;
        }, {});

        const setups = Object.entries(setupStats);

        const bestSetup = setups.length > 0
            ? setups.reduce((a, b) => (a[1].profit > b[1].profit ? a : b))
            : null;

        const worstSetup = setups.length > 0
            ? setups.reduce((a, b) => (a[1].profit < b[1].profit ? a : b))
            : null;

        return {
            totalTrades,
            wins: winCount,
            losses: lossCount,
            winrate: ((winCount / totalTrades) * 100).toFixed(1),
            totalProfit,
            totalPct,
            avgRR: avgRR.toFixed(2),
            expectancy: (totalProfit / totalTrades).toFixed(2),
            profitFactor,
            setupStats,
            bestSetup,
            worstSetup,
        };
    }, [liveTrades]);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="px-6 pt-6 pb-20">

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-5xl font-bold flex items-center gap-4">
                            <BarChart3 className="w-14 h-14 text-cyan-500" />
                            Statistics Dashboard
                        </h1>
                        <p className="text-2xl text-gray-300 mt-4 font-light">
                            Toàn bộ sự thật về trading của bạn – <span className="text-cyan-400 font-bold">Không cảm xúc, chỉ số liệu</span>
                        </p>
                    </div>
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="px-8 py-4 bg-gray-800 rounded-2xl text-xl font-semibold border border-gray-700"
                    >
                        <option value="all">Tất cả thời gian</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        {/* Có thể tự động generate các năm nếu cần */}
                    </select>
                </div>

                {/* 4 Big Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-800 rounded-3xl p-8 shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.04] hover:shadow-[0px_0px_25px_rgba(16,185,129,0.5)] hover:brightness-110">
                        <div className="text-6xl font-bold">${stats.totalProfit.toFixed(0)}</div>
                        <div className="text-green-200 text-xl mt-2 flex items-center gap-3">
                            <TrendingUp className="w-8 h-8" /> Net Profit
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-3xl p-8 shadow-2xl">
                        <div className="text-6xl font-bold">{stats.winrate}%</div>
                        <div className="text-purple-200 text-xl mt-xl mt-2">Win Rate</div>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-600 to-blue-800 rounded-3xl p-8 shadow-2xl">
                        <div className="text-6xl font-bold">1:{stats.avgRR}</div>
                        <div className="text-cyan-200 text-xl mt-2 flex items-center gap-3">
                            <Target className="w-8 h-8" /> Avg R:R
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-600 to-orange-700 rounded-3xl p-8 shadow-2xl">
                        <div className="text-6xl font-bold">{stats.expectancy}</div>
                        <div className="text-yellow-200 text-xl mt-2">Expectancy ($/trade)</div>
                    </div>
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                        <div className="text-4xl font-bold text-green-400">{stats.wins}</div>
                        <div className="text-gray-400">Win Trades</div>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                        <div className="text-4xl font-bold text-red-400">{stats.losses}</div>
                        <div className="text-gray-400">Loss Trades</div>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                        <div className="text-4xl font-bold text-cyan-400">{stats.profitFactor}</div>
                        <div className="text-gray-400">Profit Factor</div>
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                        <div className="text-4xl font-bold text-orange-400">{stats.totalTrades}</div>
                        <div className="text-gray-400">Total Trades</div>
                    </div>
                </div>

                {/* Best & Worst Setup */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Best Setup */}
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-8">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
                            <Flame className="w-10 h-10" /> Setup Mạnh Nhất
                        </h2>
                        {stats.bestSetup ? (
                            <>
                                <div className="text-5xl font-bold">{stats.bestSetup[0]}</div>
                                <div className="text-2xl mt-4">
                                    Lợi nhuận: <span className="text-green-300">+${stats.bestSetup[1].profit.toFixed(0)}</span>
                                </div>
                                <div className="text-xl text-gray-300">
                                    Winrate: {stats.bestSetup[1].trades > 0
                                        ? ((stats.bestSetup[1].win / stats.bestSetup[1].trades) * 100).toFixed(0)
                                        : 0}%
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-400">Chưa có dữ liệu</p>
                        )}
                    </div>

                    {/* Worst Setup */}
                    <div className="bg-gradient-to-br from-rose-600 to-red-800 rounded-3xl p-8">
                        <h2 className="text-3xl font-bold mb-6">Setup Cần Loại Bỏ / Cải Thiện</h2>
                        {stats.worstSetup ? (
                            <div className="text-5xl font-bold">{stats.worstSetup[0]}</div>
                        ) : (
                            <p className="text-gray-400">Chưa có</p>
                        )}
                    </div>
                </div>

                {/* Quote */}
                <div className="text-center py-12 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 rounded-3xl">
                    <p className="text-4xl font-bold italic leading-relaxed">
                        "Bạn không cần 10 setup để giàu.<br />
                        Bạn chỉ cần 2 setup thực sự có edge – và kỷ luật sắt đá."
                    </p>
                    <p className="text-2xl text-gray-300 mt-8">— Statistics Dashboard 2025</p>
                </div>
            </div>
        </div>
    );
}