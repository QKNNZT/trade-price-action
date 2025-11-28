# routes/stats.py
from flask import Blueprint, request, jsonify

from db import get_connection
from models.trades import dict_trade
from utils.trade_stats import (
    compute_overview_stats,
    compute_equity_curve,
    compute_grouped_stats,
    compute_monthly_pnl,
    compute_mistakes_counts,
)

stats_bp = Blueprint("stats", __name__, url_prefix="/api/stats")


def _build_filters_from_request(args):
    """
    Dùng chung cho tất cả stats endpoint.
    Hỗ trợ query string:
      - symbol
      - timeframe
      - session
      - setup
      - from (date >=)
      - to (date <=)
    """
    symbol = args.get("symbol")
    timeframe = args.get("timeframe")
    session = args.get("session")
    setup = args.get("setup")
    date_from = args.get("from")
    date_to = args.get("to")

    query = "SELECT * FROM trades"
    conditions = []
    params = []

    if symbol:
        conditions.append("symbol = ?")
        params.append(symbol)
    if timeframe:
        conditions.append("timeframe = ?")
        params.append(timeframe)
    if session:
        conditions.append("session = ?")
        params.append(session)
    if setup:
        conditions.append("setup = ?")
        params.append(setup)
    if date_from:
        conditions.append("date >= ?")
        params.append(date_from)
    if date_to:
        conditions.append("date <= ?")
        params.append(date_to)

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    # Với stats & equity curve: nên ORDER BY date, id ASC
    query += " ORDER BY date ASC, id ASC"

    return query, params


def _fetch_trades_with_filters(args):
    query, params = _build_filters_from_request(args)
    conn = get_connection()
    c = conn.cursor()
    c.execute(query, tuple(params))
    rows = c.fetchall()
    conn.close()
    trades = [dict_trade(r) for r in rows]
    return trades


# === OVERVIEW STATS ===
@stats_bp.get("/overview")
def stats_overview():
    """
    Tổng quan:
      - winrate, expectancy, net_r, max_drawdown, v.v.
    Hỗ trợ filter như /trades.
    """
    trades = _fetch_trades_with_filters(request.args)
    stats = compute_overview_stats(trades)
    return jsonify(stats), 200


# === EQUITY CURVE ===
@stats_bp.get("/equity-curve")
def stats_equity_curve():
    """
    Equity curve theo R, dùng vẽ chart:
      [
        { id, date, symbol, r, equity_r },
        ...
      ]
    """
    trades = _fetch_trades_with_filters(request.args)
    curve = compute_equity_curve(trades)
    return jsonify(curve), 200


# === BY SETUP ===
@stats_bp.get("/by-setup")
def stats_by_setup():
    """
    Stats theo từng setup:
      [
        {
          "key": "OB-H4",
          "label": "OB-H4",
          "stats": { ... overview ... }
        },
        ...
      ]
    """
    trades = _fetch_trades_with_filters(request.args)
    grouped = compute_grouped_stats(trades, group_key="setup")
    return jsonify(grouped), 200


# === BY SESSION ===
@stats_bp.get("/by-session")
def stats_by_session():
    """
    Stats theo từng session (Asia / London / NewYork ...).
    """
    trades = _fetch_trades_with_filters(request.args)
    grouped = compute_grouped_stats(trades, group_key="session")
    return jsonify(grouped), 200


# === BY TIMEFRAME ===
@stats_bp.get("/by-timeframe")
def stats_by_timeframe():
    """
    Stats theo timeframe (M15, H1, H4, D1...).
    """
    trades = _fetch_trades_with_filters(request.args)
    grouped = compute_grouped_stats(trades, group_key="timeframe")
    return jsonify(grouped), 200
# === MONTHLY PNL ===
@stats_bp.get("/monthly-pnl")
def stats_monthly_pnl():
    """
    P&L theo tháng (YYYY-MM), dùng cho chart MonthlyPnL.
    """
    trades = _fetch_trades_with_filters(request.args)
    monthly = compute_monthly_pnl(trades)
    return jsonify(monthly), 200


# === MISTAKES ANALYSIS ===
@stats_bp.get("/mistakes")
def stats_mistakes():
    """
    Đếm tần suất mistakes, dùng cho MistakesAnalysis (doughnut chart).
    Output dạng:
      { "FOMO": 10, "No SL": 3, ... }
    """
    trades = _fetch_trades_with_filters(request.args)
    mistakes_counts = compute_mistakes_counts(trades)
    return jsonify(mistakes_counts), 200
