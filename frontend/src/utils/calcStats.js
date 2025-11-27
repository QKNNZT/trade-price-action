export function calcBasicStats(trades) {
  const totalTrades = trades.length;
  const wins = trades.filter(t => t.profit > 0).length;
  const losses = trades.filter(t => t.profit < 0).length;
  const winrate = ((wins / totalTrades) * 100).toFixed(1);
  const totalProfit = trades.reduce((a, t) => a + t.profit, 0).toFixed(2);
  const avgR = trades.reduce((a, t) => a + (t.rr || 0), 0) / totalTrades || 0;

  return { totalTrades, wins, losses, winrate, totalProfit, avgR };
}

export function calcEquityCurve(trades) {
  return [...trades]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, t, i) => [...acc, (acc[i - 1] || 0) + t.profit], []);
}

export function calcStatsBySetup(trades) {
  return trades.reduce((acc, t) => {
    const setup = t.setup || "Unknown";

    if (!acc[setup]) {
      acc[setup] = {
        trades: 0,
        win: 0,
        loss: 0,
        profit: 0,
        rr: 0,
      };
    }

    acc[setup].trades++;

    if (t.profit > 0) acc[setup].win++;
    else if (t.profit < 0) acc[setup].loss++;

    acc[setup].profit += t.profit;
    acc[setup].rr += Number(t.rr) || 0;

    return acc;
  }, {});
}


export function groupBy(trades, key) {
  return trades.reduce((acc, t) => {
    const val = t[key] || "N/A";
    if (!acc[val]) acc[val] = { win: 0, total: 0, profit: 0 };
    acc[val].total++;
    if (t.profit > 0) acc[val].win++;
    acc[val].profit += t.profit;
    return acc;
  }, {});
}

export function calcMistakes(trades) {
  return trades.flatMap(t => JSON.parse(t.mistakes || "[]"))
    .reduce((a, m) => ({ ...a, [m]: (a[m] || 0) + 1 }), {});
}

// src/untils/calcStats.js  ← thêm 2 hàm này vào cuối file

export function calcMonthlyPnL(trades) {
  const monthly = {};

  trades.forEach((t) => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM

    if (!monthly[key]) monthly[key] = 0;
    monthly[key] += t.profit;
  });

  // Sort theo thời gian
  return Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, profit]) => ({
      month,
      profit: Number(profit.toFixed(2)),
    }));
}

export function calcDrawdown(equityCurve) {
  let peak = -Infinity;
  let maxDD = 0;

  const drawdowns = equityCurve.map((equity) => {
    peak = Math.max(peak, equity);
    const dd = ((peak - equity) / peak) * 100;
    maxDD = Math.max(maxDD, dd);
    return Number(dd.toFixed(2));
  });

  return {
    drawdowns,           // mảng % drawdown từng trade
    maxDrawdown: Number(maxDD.toFixed(1)), // % drawdown lớn nhất
  };
}

// src/untils/calcStats.js  ← thêm vào cuối file

export function calcExpectancy(trades) {
  if (!trades.length) return 0;

  const wins = trades.filter(t => t.profit > 0);
  const losses = trades.filter(t => t.profit < 0);

  const avgWin = wins.length ? wins.reduce((sum, t) => sum + t.profit, 0) / wins.length : 0;
  const avgLoss = losses.length ? Math.abs(losses.reduce((sum, t) => sum + t.profit, 0) / losses.length) : 0;

  const winrate = trades.length ? wins.length / trades.length : 0;

  return Number((winrate * avgWin - (1 - winrate) * avgLoss).toFixed(2));
}

export function calcProfitFactor(trades) {
  if (!trades.length) return 0;

  const grossProfit = trades.filter(t => t.profit > 0).reduce((sum, t) => sum + t.profit, 0);
  const grossLoss = Math.abs(trades.filter(t => t.profit < 0).reduce((sum, t) => sum + t.profit, 0));

  return grossLoss === 0 ? Infinity : Number((grossProfit / grossLoss).toFixed(2));
}