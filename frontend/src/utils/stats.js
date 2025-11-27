// ---- Calculate Win/Loss/BE ----
export const calculateWinLossBe = (trades) => {
  const wins = trades.filter(t => t.profit > 0).length;
  const losses = trades.filter(t => t.profit < 0).length;
  const be = trades.filter(t => t.profit === 0).length;
  return { wins, losses, be };
};

// ---- Equity Curve ----
export const calculateEquityCurve = (trades) => {
  let equity = 0;
  return trades.map(t => {
    equity += t.profit;
    return equity;
  });
};

// ---- Monthly Summary ----
export const calculateMonthlyProfit = (trades) => {
  const result = {};
  trades.forEach(t => {
    const month = t.date?.slice(0, 7);
    if (!result[month]) result[month] = 0;
    result[month] += t.profit;
  });
  return result;
};

// ---- RR Histogram ----
export const calculateRRHistogram = (trades) => {
  const map = {};
  trades.forEach(t => {
    const bucket = (Math.round(t.rr * 2) / 2).toFixed(1);
    if (!map[bucket]) map[bucket] = 0;
    map[bucket]++;
  });
  return map;
};

// ---- Profit Histogram ----
export const calculateProfitHistogram = (trades) => {
  const map = {};
  trades.forEach(t => {
    const bucket = Math.round(t.profit / 10) * 10; 
    if (!map[bucket]) map[bucket] = 0;
    map[bucket]++;
  });
  return map;
};

// ---- Expectancy ----
export const calculateExpectancy = (trades) => {
  const wins = trades.filter(t => t.profit > 0);
  const losses = trades.filter(t => t.profit < 0);

  const winRate = wins.length / trades.length;
  const lossRate = losses.length / trades.length;

  const avgWin = wins.reduce((s,t)=>s+t.profit,0) / (wins.length || 1);
  const avgLoss = Math.abs(losses.reduce((s,t)=>s+t.profit,0)) / (losses.length || 1);

  return (winRate * avgWin) - (lossRate * avgLoss);
};

// ---- Profit Factor ----
export const calculateProfitFactor = (trades) => {
  const wins = trades.filter(t => t.profit > 0).reduce((s,t)=>s+t.profit,0);
  const losses = Math.abs(trades.filter(t => t.profit < 0).reduce((s,t)=>s+t.profit,0));
  return wins / (losses || 1);
};

// ---- Max Drawdown ----
export const calculateMaxDrawdown = (curve) => {
  let peak = -Infinity;
  let maxDD = 0;
  curve.forEach(e => {
    peak = Math.max(peak, e);
    maxDD = Math.max(maxDD, peak - e);
  });
  return maxDD;
};

// ---- Sharpe Ratio ----
export const calculateSharpe = (trades) => {
  const returns = trades.map(t => t.profit_pct);
  const avg = returns.reduce((s,v)=>s+v,0) / returns.length;
  const variance = returns.reduce((s,v)=>s+(v-avg)**2,0) / returns.length;
  const std = Math.sqrt(variance);
  return avg / (std || 1);
};
