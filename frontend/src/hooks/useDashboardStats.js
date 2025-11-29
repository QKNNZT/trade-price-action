// src/hooks/useDashboardStats.js
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import { getDateRangeFromFilter } from "./useTimeFilter";

export default function useDashboardStats(timeFilter, extraFilters = {}) {
  const [overview, setOverview] = useState(null);
  const [equityCurve, setEquityCurve] = useState([]);
  const [bySetup, setBySetup] = useState([]);
  const [bySession, setBySession] = useState([]);
  const [byTimeframe, setByTimeframe] = useState([]);
  const [byGrade, setByGrade] = useState([]);
  const [monthlyPnl, setMonthlyPnl] = useState([]);
  const [mistakes, setMistakes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const { from, to } = getDateRangeFromFilter(timeFilter);
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);

    const { symbol, setup, session, timeframe } = extraFilters || {};
    if (symbol && symbol !== "All") params.append("symbol", symbol);
    if (setup && setup !== "All") params.append("setup", setup);
    if (session && session !== "All") params.append("session", session);
    if (timeframe && timeframe !== "All") params.append("timeframe", timeframe);

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
          gradeRes,
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
          fetch(`${API_BASE_URL}/api/stats/by-grade${query}`, {
            signal: controller.signal,
          }),
        ]);

        if (!overviewRes.ok) {
          throw new Error("Failed to load overview stats");
        }

        const [
          overviewData,
          equityData,
          setupData,
          sessionData,
          tfData,
          monthlyData,
          mistakesData,
          gradeData,
        ] = await Promise.all([
          overviewRes.json(),
          equityRes.json(),
          setupRes.json(),
          sessionRes.json(),
          tfRes.json(),
          monthlyRes.json(),
          mistakesRes.json(),
          gradeRes.json(),
        ]);

        setOverview(overviewData);
        setEquityCurve(equityData || []);
        setBySetup(setupData || []);
        setBySession(sessionData || []);
        setByTimeframe(tfData || []);
        setMonthlyPnl(monthlyData || []);
        setMistakes(mistakesData || {});
        setByGrade(gradeData || []);
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
  }, [
    timeFilter,
    extraFilters.symbol,
    extraFilters.setup,
    extraFilters.session,
    extraFilters.timeframe,
  ]);

  return {
    overview,
    equityCurve,
    bySetup,
    bySession,
    byTimeframe,
    byGrade,
    monthlyPnl,
    mistakes,
    loading,
    error,
  };
}
