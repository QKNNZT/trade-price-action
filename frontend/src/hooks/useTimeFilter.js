// src/hooks/useTimeFilter.js
import { useMemo, useState } from "react";

/**
 * Chuyển filter ("All Time", "Last 30D", "Last 6M", "YTD")
 * -> range ngày { from, to } dạng "YYYY-MM-DD"
 */
export function getDateRangeFromFilter(filter) {
  const today = new Date();
  const end = today;
  let start = null;

  switch (filter) {
    case "Last 30D": {
      const d = new Date(end);
      d.setDate(d.getDate() - 30);
      start = d;
      break;
    }
    case "Last 6M": {
      const d = new Date(end);
      d.setMonth(d.getMonth() - 6);
      start = d;
      break;
    }
    case "YTD": {
      const d = new Date(end.getFullYear(), 0, 1);
      start = d;
      break;
    }
    case "All Time":
    default:
      // Không filter
      return { from: null, to: null };
  }

  const toStr = end.toISOString().slice(0, 10); // YYYY-MM-DD
  const fromStr = start ? start.toISOString().slice(0, 10) : null;
  return { from: fromStr, to: toStr };
}

/**
 * Hook filter theo thời gian cho danh sách trades trên frontend
 */
export default function useTimeFilter(defaultFilter = "All Time") {
  const [filter, setFilter] = useState(defaultFilter);

  const dateRange = useMemo(
    () => getDateRangeFromFilter(filter),
    [filter]
  );

  function applyFilter(trades) {
    if (!trades || !trades.length) return [];

    const { from, to } = dateRange;

    // Không filter -> trả nguyên
    if (!from && !to) return trades;

    return trades.filter((t) => {
      if (!t.date) return false;
      const d = new Date(t.date);
      if (Number.isNaN(d.getTime())) return false;

      if (from) {
        const fromDate = new Date(from);
        if (d < fromDate) return false;
      }
      if (to) {
        const toDate = new Date(to);
        // cho tới hết ngày "to"
        toDate.setHours(23, 59, 59, 999);
        if (d > toDate) return false;
      }
      return true;
    });
  }

  return { filter, setFilter, applyFilter, dateRange };
}
