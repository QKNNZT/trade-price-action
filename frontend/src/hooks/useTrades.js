import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

export default function useTrades() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/trades`)
      .then(r => r.json())
      .then(setTrades);
  }, []);

  return trades;
}