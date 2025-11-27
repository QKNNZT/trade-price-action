// src/hooks/useTimeFilter.js
import { useState } from "react";

const filters = {
  "All Time": () => true,
  "Last 30D": (trade) => Date.now() - new Date(trade.date) <= 30 * 24 * 60 * 60 * 1000,
  "Last 6M": (trade) => Date.now() - new Date(trade.date) <= 180 * 24 * 60 * 60 * 1000,
  "YTD": (trade) => new Date(trade.date).getFullYear() === new Date().getFullYear(),
};

export default function useTimeFilter(initial = "All Time") {
  const [filter, setFilter] = useState(initial);

  const applyFilter = (trades) => {
    if (filter === "All Time") return trades;
    const predicate = filters[filter];
    return predicate ? trades.filter(predicate) : trades;
  };

  return { filter, setFilter, applyFilter };
}