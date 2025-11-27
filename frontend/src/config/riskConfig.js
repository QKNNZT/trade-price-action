// src/config/riskConfig.js
// CẬP NHẬT 2025 – CHUẨN PROP FIRM & RETAIL BROKER

export const DEFAULT_SYMBOL_CONFIG = {
  tickSize: 0.0001, // 1 pip cho FX chuẩn
  tickValue: 10, // 1 lot = $10 / pip
  minLot: 0.01,
  lotStep: 0.01,
  unitLabel: "pips",
};

// Bảng config chi tiết theo symbol đã chuẩn hoá
export const SYMBOL_CONFIG = {
  // ─────── MAJOR FX ───────
  // Dùng PIP (0.0001), không dùng pipette
  "EUR/USD": {
    tickSize: 0.0001,
    tickValue: 10,
    minLot: 0.01,
    lotStep: 0.01,
    unitLabel: "pips",
  },
  "GBP/USD": {
    tickSize: 0.0001,
    tickValue: 10,
    minLot: 0.01,
    lotStep: 0.01,
    unitLabel: "pips",
  },
  "AUD/USD": {
    tickSize: 0.0001,
    tickValue: 10,
    minLot: 0.01,
    lotStep: 0.01,
    unitLabel: "pips",
  },
  "USD/CAD": {
    tickSize: 0.0001,
    tickValue: 10,
    minLot: 0.01,
    lotStep: 0.01,
    unitLabel: "pips",
  },
  "NZD/USD": {
    tickSize: 0.0001,
    tickValue: 10,
    minLot: 0.01,
    lotStep: 0.01,
    unitLabel: "pips",
  },

  // JPY – pip = 0.01
  "USD/JPY": {
    tickSize: 0.01,
    tickValue: 9.5, // ~ $9.5 / pip cho 1 lot
    minLot: 0.01,
    lotStep: 0.01,
    unitLabel: "pips",
  },

  // ─────── GOLD ───────
  // Giả định: 1 lot = $1 / 0.01$ (1 point)
  "XAU/USD": {
    tickSize: 0.01,
    tickValue: 1,
    minLot: 0.01,
    lotStep: 0.01,
    unitLabel: "points",
  },
  XAUUSD: {
    tickSize: 0.01,
    tickValue: 1,
    minLot: 0.01,
    lotStep: 0.01,
    unitLabel: "points",
  },

  // ─────── INDICES ───────
  // Giả định: 1 lot = $1 / point
  US30: {
    tickSize: 1,
    tickValue: 1,
    minLot: 0.01,
    lotStep: 0.01,
    unitLabel: "points",
  },
  DJ30: {
    tickSize: 1,
    tickValue: 1,
    minLot: 0.01,
    lotStep: 0.01,
    unitLabel: "points",
  },
  DOW: {
    tickSize: 1,
    tickValue: 1,
    minLot: 0.01,
    lotStep: 0.01,
    unitLabel: "points",
  },

  NAS100: {
    tickSize: 1,
    tickValue: 1,
    minLot: 0.01,
    lotStep: 0.01,
    unitLabel: "points",
  },
  US100: {
    tickSize: 1,
    tickValue: 1,
    minLot: 0.01,
    lotStep: 0.01,
    unitLabel: "points",
  },

  // ─────── CRYPTO ───────
  // Giả định: 1 lot = 1 BTC, 1$ move = $1 PnL
  "BTC/USD": {
    tickSize: 1,
    tickValue: 1,
    minLot: 0.01,
    lotStep: 0.01,
    unitLabel: "points",
  },
  BTCUSD: {
    tickSize: 1,
    tickValue: 1,
    minLot: 0.01,
    lotStep: 0.01,
    unitLabel: "points",
  },
};

/**
 * Lấy config chuẩn cho symbol (hỗ trợ mọi cách viết)
 */
export function getSymbolMeta(symbolRaw) {
  if (!symbolRaw) return DEFAULT_SYMBOL_CONFIG;

  const normalized = symbolRaw
    .toString()
    .trim()
    .toUpperCase()
    .replace(/[\s\/\-_]/g, "") // xóa space, /, -, _
    .replace("XAUUSD", "XAU/USD")
    .replace("BTCUSD", "BTC/USD")
    .replace("US100", "NAS100")
    .replace("DJ30", "US30")
    .replace("DOW", "US30")
    .replace(/([A-Z]{3})([A-Z]{3})/, "$1/$2"); // EURUSD -> EUR/USD

  return SYMBOL_CONFIG[normalized] || DEFAULT_SYMBOL_CONFIG;
}
