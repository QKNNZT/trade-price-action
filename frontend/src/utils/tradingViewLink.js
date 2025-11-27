// src/utils/tradingViewLink.js

// Chuẩn hoá symbol từ log:
// "EUR/USD"  -> "EURUSD"
// "xauusd"   -> "XAUUSD"
// "btc/usdt" -> "BTCUSDT"
function normalizeSymbol(rawSymbol) {
  return (rawSymbol || "")
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9]/g, ""); // xoá /, -, _, khoảng trắng...
}

// Map symbol trong log → symbol trên TradingView
export function getTradingViewSymbol(symbol) {
  const sym = normalizeSymbol(symbol);
  if (!sym) return "";

  // Crypto: BTCUSDT, ETHUSDT...
  if (sym.endsWith("USDT")) {
    return `BINANCE:${sym}`; // ví dụ: BINANCE:BTCUSDT
  }

  // Vàng
  if (sym === "XAUUSD") {
    return "OANDA:XAUUSD";
  }

  // Forex majors: EURUSD, GBPUSD, ...
  // Tuỳ bạn hay dùng broker nào trên TradingView, ở đây dùng OANDA
  return `OANDA:${sym}`; // có thể đổi thành `FX:${sym}` nếu thích
}

export function getTradingViewUrl(symbol) {
  const tvSymbol = getTradingViewSymbol(symbol);
  if (!tvSymbol) return "https://www.tradingview.com/chart/";

  const base = "https://www.tradingview.com/chart/";
  return `${base}?symbol=${encodeURIComponent(tvSymbol)}`;
}

export function openInTradingView(symbol) {
  const url = getTradingViewUrl(symbol);
  window.open(url, "_blank", "noopener,noreferrer");
}
