// src/utils/calcStats.js
// Chỉ giữ lại calcDrawdown cho DrawdownChart + StatsCards

export function calcDrawdown(equityCurve) {
  // equityCurve: mảng số (equity theo R hoặc $)

  if (!equityCurve || equityCurve.length === 0) {
    return { drawdowns: [], maxDrawdown: 0 };
  }

  const drawdowns = [];
  let peak = Number(equityCurve[0]) || 0;
  let maxDD = 0;

  for (let i = 0; i < equityCurve.length; i++) {
    const equity = Number(equityCurve[i]) || 0;

    if (equity > peak) {
      peak = equity;
    }

    let dd = 0;
    if (peak > 0) {
      dd = ((peak - equity) / peak) * 100; // % drawdown
    }

    if (!Number.isFinite(dd)) {
      dd = 0;
    }

    dd = Number(dd.toFixed(2));
    drawdowns.push(dd);

    if (dd > maxDD) {
      maxDD = dd;
    }
  }

  return {
    drawdowns,
    maxDrawdown: Number(maxDD.toFixed(1)),
  };
}
