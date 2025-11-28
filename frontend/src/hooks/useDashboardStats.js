import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

function formatDate(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getDateRange(filter) {
  const today = new Date();
  const end = formatDate(today);
  let start = null;

  if (filter === "Last 30D") {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    start = formatDate(d);
  } else if (filter === "Last 6M") {
    const d = new Date();
    d.setMonth(d.getMonth() - 6);
    start = formatDate(d);
  } else if (filter === "YTD") {
    const d = new Date(today.getFullYear(), 0, 1);
    start = formatDate(d);
  } else if (filter === "All Time") {
    start = null;
  }

  return { from: start, to: end };
}

export default function useDashboardStats(filter) {
  const [overview, setOverview] = useState(null);
  const [equityCurve, setEquityCurve] = useState([]);
  const [bySetup, setBySetup] = useState([]);
  const [bySession, setBySession] = useState([]);
  const [byTimeframe, setByTimeframe] = useState([]);
  const [monthlyPnl, setMonthlyPnl] = useState([]);
  const [mistakes, setMistakes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const { from, to } = getDateRange(filter);

    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to && filter !== "All Time") params.append("to", to);
    const query = params.toString() ? `?${params.toString()}` : "";

    async function fetchStats() {
      setLoading(true);
      setError(null);

      try {
        const [
          overviewRes,
          equityRes,
          setupRes,
          sessionRes,
          tfRes,
          monthlyRes,
          mistakesRes,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/api/stats/overview${query}`, {
            signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/api/stats/equity-curve${query}`, {
            signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/api/stats/by-setup${query}`, {
            signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/api/stats/by-session${query}`, {
            signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/api/stats/by-timeframe${query}`, {
            signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/api/stats/monthly-pnl${query}`, {
            signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/api/stats/mistakes${query}`, {
            signal: controller.signal,
          }),
        ]);

        if (!overviewRes.ok) throw new Error("Failed to load overview stats");

        const [
          overviewData,
          equityData,
          setupData,
          sessionData,
          tfData,
          monthlyData,
          mistakesData,
        ] = await Promise.all([
          overviewRes.json(),
          equityRes.json(),
          setupRes.json(),
          sessionRes.json(),
          tfRes.json(),
          monthlyRes.json(),
          mistakesRes.json(),
        ]);

        setOverview(overviewData);
        setEquityCurve(equityData || []);
        setBySetup(setupData || []);
        setBySession(sessionData || []);
        setByTimeframe(tfData || []);
        setMonthlyPnl(monthlyData || []);
        setMistakes(mistakesData || {});
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Dashboard stats error:", err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchStats();

    return () => controller.abort();
  }, [filter]);

  return {
    overview,
    equityCurve,
    bySetup,
    bySession,
    byTimeframe,
    monthlyPnl,
    mistakes,
    loading,
    error,
  };
}
