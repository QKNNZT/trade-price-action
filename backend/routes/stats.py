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
    compute_review_package,
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
    """
    Lấy trades từ DB với các filter:
      - from, to (date)
      - symbol
      - setup
      - session
      - timeframe
    Trả về list[dict_trade]
    """
    conn = get_connection()
    cur = conn.cursor()

    query = "SELECT * FROM trades WHERE 1=1"
    params = []

    date_from = args.get("from")
    date_to = args.get("to")
    symbol = args.get("symbol")
    setup = args.get("setup")
    session = args.get("session")
    timeframe = args.get("timeframe")

    if date_from:
        query += " AND date >= ?"
        params.append(date_from)
    if date_to:
        query += " AND date <= ?"
        params.append(date_to)
    if symbol:
        query += " AND symbol = ?"
        params.append(symbol)
    if setup:
        query += " AND setup = ?"
        params.append(setup)
    if session:
        query += " AND session = ?"
        params.append(session)
    if timeframe:
        query += " AND timeframe = ?"
        params.append(timeframe)

    # Có thể bỏ backtest tại đây nếu bạn có cột type:
    # query += " AND (type IS NULL OR type != 'backtest')"

    query += " ORDER BY date ASC, id ASC"

    cur.execute(query, params)
    rows = cur.fetchall()
    conn.close()

    return [dict_trade(r) for r in rows]


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

# === REVIEW (TUẦN / THÁNG / CUSTOM) ===
@stats_bp.get("/review")
def stats_review():
    """
    Review cho một khoảng thời gian:
      - /stats/review?from=YYYY-MM-DD&to=YYYY-MM-DD
    Trả về:
      - current: { overview, best_trade, worst_trade, win_streak }
      - previous: cùng cấu trúc nhưng cho kỳ trước (nếu tính được)
      - range: from/to + prev_from/prev_to
      - setup_stats: performance theo setup trong kỳ hiện tại
    """
    args = request.args
    date_from = args.get("from")
    date_to = args.get("to")

    # trades kỳ hiện tại
    trades_current = _fetch_trades_with_filters(args)
    current = compute_review_package(trades_current)

    previous = None
    prev_from_str = None
    prev_to_str = None

    # tính kỳ trước nếu có from/to
    if date_from and date_to:
        try:
            fmt = "%Y-%m-%d"
            start = datetime.strptime(date_from, fmt)
            end = datetime.strptime(date_to, fmt)
            days = (end - start).days + 1

            prev_end = start - timedelta(days=1)
            prev_start = prev_end - timedelta(days=days - 1)

            prev_from_str = prev_start.strftime(fmt)
            prev_to_str = prev_end.strftime(fmt)

            base_filters = {
                "symbol": args.get("symbol"),
                "setup": args.get("setup"),
                "session": args.get("session"),
                "timeframe": args.get("timeframe"),
            }
            prev_args = {
                "from": prev_from_str,
                "to": prev_to_str,
                **{k: v for k, v in base_filters.items() if v},
            }

            trades_previous = _fetch_trades_with_filters(prev_args)
            previous = compute_review_package(trades_previous)
        except Exception:
            previous = None

    setup_stats = compute_grouped_stats(trades_current, group_key="setup")

    return jsonify(
        {
            "current": current,
            "previous": previous,
            "range": {
                "from": date_from,
                "to": date_to,
                "prev_from": prev_from_str,
                "prev_to": prev_to_str,
            },
            "setup_stats": setup_stats,
        }
    ), 200


@stats_bp.get("/by-grade")
def stats_by_grade():
    """
    Group theo grade (A/B/C...) để xem quality process.
    """
    trades = _fetch_trades_with_filters(request.args)
    grouped = compute_grouped_stats(trades, "grade")  # dùng positional, không dùng key=
    return jsonify(grouped), 200