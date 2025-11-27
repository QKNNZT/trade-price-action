// tradeOptions.js
export const sessions = [
  { value: "Asian", label: "Asian" },
  { value: "London", label: "London" },
  { value: "New York", label: "New York" },
];

export const timeframes = [
  { value: "M15", label: "M15" },
  { value: "H1", label: "H1" },
  { value: "H4", label: "H4" },
  { value: "Daily", label: "Daily" },
];

export const confluenceOptions = [
  "Order Block", "FVG", "Liquidity Grab", "BOS",
  "CHoCH", "Breaker", "Rejection", "Imbalance",
  "Market Structure Shift",
].map(v => ({ value: v, label: v }));

export const mistakeOptions = [
  "Vào sớm", "FOMO", "Revenge", "Quá size",
  "Không chờ confirmation", "Đu trend",
  "Cắt lời sớm", "Để lỗ chạy",
].map(v => ({ value: v, label: v }));

export const psychOptions = [
  { label: "FOMO", value: "FOMO" },
  { label: "Revenge", value: "Revenge" },
  { label: "Hesitation", value: "Hesitation" },
  { label: "Overconfidence", value: "Overconfidence" },
  { label: "Fear", value: "Fear" },
  { label: "Greed", value: "Greed" },
  { label: "Perfect Execution", value: "Perfect Execution" },
];