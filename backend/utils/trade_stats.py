# utils/trade_stats.py
from typing import List, Dict, Any
import json


RISK_PERCENT_DEFAULT = 0.01  # 1% risk mỗi lệnh


def _safe_float(value, default=0.0):
    try:
        if value is None:
            return default
        return float(value)
    except Exception:
        return default


def compute_r_multiple(trade: Dict[str, Any], risk_percent: float = RISK_PERCENT_DEFAULT) -> float:
    """
    Tính R-multiple của 1 lệnh:
      R = profit / (capital * risk_percent)

    Giả định:
      - risk mỗi lệnh = risk_percent * capital (mặc định 1% vốn)
    """
    capital = _safe_float(trade.get("capital"), 0.0)
    profit = _safe_float(trade.get("profit"), 0.0)

    if capital <= 0 or risk_percent <= 0:
        return 0.0

    risk_amount = capital * risk_percent
    if risk_amount == 0:
        return 0.0

    return profit / risk_amount


def compute_equity_curve(trades: List[Dict[str, Any]], risk_percent: float = RISK_PERCENT_DEFAULT):
    """
    Trả về equity curve theo R:
      [
        { "id": ..., "date": "2024-01-01", "symbol": "EURUSD", "r": 1.0, "equity_r": 1.0 },
        ...
      ]

    - Chỉ tính cho lệnh đã có profit (tức là đã close).
    - Sắp xếp theo date, id để equity đi đúng thời gian.
    """
    closed_trades = [t for t in trades if t.get("profit") is not None]
    closed_trades = sorted(
        closed_trades,
        key=lambda t: ((t.get("date") or ""), t.get("id") or 0),
    )

    curve = []
    cum_r = 0.0

    for t in closed_trades:
        r = compute_r_multiple(t, risk_percent)
        cum_r += r
        curve.append({
            "id": t["id"],
            "date": t.get("date"),
            "symbol": t.get("symbol"),
            "r": round(r, 2),
            "equity_r": round(cum_r, 2),
        })

    return curve


def compute_max_drawdown_from_curve(curve: List[Dict[str, Any]]) -> float:
    """
    Tính max drawdown tính theo R từ equity curve.
    """
    peak = float("-inf")
    max_dd = 0.0

    for point in curve:
        equity = _safe_float(point.get("equity_r"), 0.0)
        if equity > peak:
            peak = equity
        dd = peak - equity
        if dd > max_dd:
            max_dd = dd

    return round(max_dd, 2)


def compute_overview_stats(
    trades: List[Dict[str, Any]],
    risk_percent: float = RISK_PERCENT_DEFAULT,
) -> Dict[str, Any]:
    """
    Tính các chỉ số tổng quan:
      - total_trades, win_trades, loss_trades, breakeven_trades
      - winrate (%)
      - net_profit ($), avg_profit ($)
      - net_profit_pct (%), avg_profit_pct (%)
      - net_r, avg_r
      - expectancy_r, expectancy_profit ($/trade)
      - profit_factor (có thể là None nếu 'vô cực')
      - max_drawdown_r
    """
    # Không có trade nào
    if not trades:
        return {
            "total_trades": 0,
            "win_trades": 0,
            "loss_trades": 0,
            "breakeven_trades": 0,
            "winrate": 0.0,
            "net_profit": 0.0,
            "avg_profit": 0.0,
            "net_profit_pct": 0.0,
            "avg_profit_pct": 0.0,
            "net_r": 0.0,
            "avg_r": 0.0,
            "expectancy_r": 0.0,
            "expectancy_profit": 0.0,
            "profit_factor": 0.0,
            "max_drawdown_r": 0.0,
        }

    # Chỉ tính với những lệnh đã đóng (có profit)
    closed = [t for t in trades if t.get("profit") is not None]
    if not closed:
        return {
            "total_trades": 0,
            "win_trades": 0,
            "loss_trades": 0,
            "breakeven_trades": 0,
            "winrate": 0.0,
            "net_profit": 0.0,
            "avg_profit": 0.0,
            "net_profit_pct": 0.0,
            "avg_profit_pct": 0.0,
            "net_r": 0.0,
            "avg_r": 0.0,
            "expectancy_r": 0.0,
            "expectancy_profit": 0.0,
            "profit_factor": 0.0,
            "max_drawdown_r": 0.0,
        }

    r_values: List[float] = []
    profits: List[float] = []
    pct_values: List[float] = []

    for t in closed:
        r = compute_r_multiple(t, risk_percent)
        p = _safe_float(t.get("profit"), 0.0)
        pct = _safe_float(t.get("profit_pct"), 0.0)

        r_values.append(r)
        profits.append(p)
        pct_values.append(pct)

    total_trades = len(r_values)
    win_trades = len([r for r in r_values if r > 0])
    loss_trades = len([r for r in r_values if r < 0])
    breakeven_trades = len([r for r in r_values if r == 0])

    winrate = (win_trades / total_trades) * 100 if total_trades > 0 else 0.0

    net_profit = sum(profits)
    avg_profit = net_profit / total_trades if total_trades > 0 else 0.0

    net_profit_pct = sum(pct_values)
    avg_profit_pct = net_profit_pct / total_trades if total_trades > 0 else 0.0

    net_r = sum(r_values)
    avg_r = net_r / total_trades if total_trades > 0 else 0.0

    # Expectancy theo R
    p_win = win_trades / total_trades if total_trades > 0 else 0.0
    p_loss = loss_trades / total_trades if total_trades > 0 else 0.0

    avg_win_r = (
        sum(r for r in r_values if r > 0) / win_trades if win_trades > 0 else 0.0
    )
    avg_loss_r = (
        abs(sum(r for r in r_values if r < 0)) / loss_trades if loss_trades > 0 else 0.0
    )

    expectancy_r = p_win * avg_win_r - p_loss * avg_loss_r

    # Expectancy theo $ / trade
    expectancy_profit = net_profit / total_trades if total_trades > 0 else 0.0

    # Profit factor: nếu không có loss nhưng có profit -> "vô cực" => để None (null trong JSON)
    gross_profit = sum(p for p in profits if p > 0)
    gross_loss = abs(sum(p for p in profits if p < 0))

    if gross_loss > 0:
        profit_factor = gross_profit / gross_loss
    elif gross_profit > 0:
        profit_factor = None  # biểu diễn PF = ∞
    else:
        profit_factor = 0.0

    # Max drawdown theo R từ equity curve
    curve = compute_equity_curve(trades, risk_percent)
    max_dd_r = compute_max_drawdown_from_curve(curve)

    # Chuẩn bị giá trị trả về JSON
    if profit_factor is None:
        profit_factor_json = None  # sẽ thành null trong JSON
    else:
        profit_factor_json = round(profit_factor, 2)

    return {
        "total_trades": total_trades,
        "win_trades": win_trades,
        "loss_trades": loss_trades,
        "breakeven_trades": breakeven_trades,
        "winrate": round(winrate, 2),
        "net_profit": round(net_profit, 2),
        "avg_profit": round(avg_profit, 2),
        "net_profit_pct": round(net_profit_pct, 2),
        "avg_profit_pct": round(avg_profit_pct, 2),
        "net_r": round(net_r, 2),
        "avg_r": round(avg_r, 2),
        "expectancy_r": round(expectancy_r, 3),
        "expectancy_profit": round(expectancy_profit, 2),
        "profit_factor": profit_factor_json,  # KHÔNG còn Infinity
        "max_drawdown_r": max_dd_r,
    }


def compute_grouped_stats(
    trades: List[Dict[str, Any]],
    group_key: str,
    risk_percent: float = RISK_PERCENT_DEFAULT,
) -> List[Dict[str, Any]]:
    """
    Group trades theo 1 key (vd: 'setup', 'session', 'timeframe') và tính stats cho từng nhóm.

    Output:
      [
        { "key": "London", "label": "London", "stats": {... như overview ...} },
        ...
      ]
    """
    groups = {}
    for t in trades:
        key = t.get(group_key) or "UNKNOWN"
        groups.setdefault(key, []).append(t)

    result = []
    for key, group_trades in groups.items():
        stats = compute_overview_stats(group_trades, risk_percent)
        result.append({
            "key": key,
            "label": key,
            "stats": stats,
        })

    # Sắp xếp nhóm theo net_r giảm dần (setup/sess tốt nhất lên đầu)
    result.sort(key=lambda g: g["stats"].get("net_r", 0.0), reverse=True)
    return result
def compute_monthly_pnl(trades: List[Dict[str, Any]]):
    """
    Group theo tháng (YYYY-MM), tính tổng profit theo $.
    Output dạng:
      [
        {"month": "2024-01", "profit": 123.45},
        {"month": "2024-02", "profit": -56.78},
        ...
      ]
    """
    groups = {}

    for t in trades:
        date_str = t.get("date")
        if not date_str:
            continue

        # Giả định date dạng "YYYY-MM-DD" -> lấy "YYYY-MM"
        month_key = str(date_str)[:7]
        profit = _safe_float(t.get("profit"), 0.0)

        groups[month_key] = groups.get(month_key, 0.0) + profit

    result = [
        {"month": month, "profit": round(pnl, 2)}
        for month, pnl in groups.items()
    ]

    # Sắp xếp theo tháng
    result.sort(key=lambda x: x["month"])
    return result


def compute_mistakes_counts(trades: List[Dict[str, Any]]):
    """
    Đếm số lần xuất hiện của mỗi mistake.
    Cột trades.mistakes là TEXT chứa JSON list, ví dụ: '["FOMO","No SL"]'

    Output:
      {
        "FOMO": 10,
        "No SL": 3,
        ...
      }
    """
    counts = {}

    for t in trades:
        raw = t.get("mistakes")
        if not raw:
            continue

        try:
            arr = json.loads(raw)
        except Exception:
            continue

        if not isinstance(arr, list):
            continue

        for m in arr:
            label = str(m).strip()
            if not label:
                continue
            counts[label] = counts.get(label, 0) + 1

    return counts

def _closed_trades(trades: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Chỉ lấy trade đã đóng (có profit)."""
    return [t for t in trades if t.get("profit") is not None]


def _summarize_trade(t: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Rút gọn trade để trả về API review."""
    if not t:
        return None
    return {
        "id": t.get("id"),
        "date": t.get("date"),
        "symbol": t.get("symbol"),
        "setup": t.get("setup"),
        "direction": t.get("direction"),
        "session": t.get("session"),
        "timeframe": t.get("timeframe"),
        "profit": round(_safe_float(t.get("profit"), 0.0), 2),
        "profit_pct": round(_safe_float(t.get("profit_pct"), 0.0), 2),
        "rr": round(_safe_float(t.get("rr"), 0.0), 2),
    }


def compute_best_trade(trades: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    closed = _closed_trades(trades)
    if not closed:
        return None
    best = max(closed, key=lambda t: _safe_float(t.get("profit"), 0.0))
    return _summarize_trade(best)


def compute_worst_trade(trades: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    closed = [t for t in _closed_trades(trades) if _safe_float(t.get("profit"), 0.0) < 0]
    if not closed:
        return None
    worst = min(closed, key=lambda t: _safe_float(t.get("profit"), 0.0))
    return _summarize_trade(worst)


def compute_win_streak(trades: List[Dict[str, Any]]) -> int:
    """
    Chuỗi thắng liên tiếp dài nhất (tính theo profit > 0),
    sort theo date tăng dần.
    """
    closed = sorted(_closed_trades(trades), key=lambda t: t.get("date") or "")
    current = 0
    best = 0
    for t in closed:
        profit = _safe_float(t.get("profit"), 0.0)
        if profit > 0:
            current += 1
            best = max(best, current)
        elif profit < 0:
            current = 0
        # hòa (0) thì không reset, không + streak
    return best


def compute_review_package(trades: List[Dict[str, Any]], risk_percent: float = RISK_PERCENT_DEFAULT) -> Dict[str, Any]:
    """
    Gói dữ liệu cho trang Review (tuần / tháng):
      - overview: dùng lại compute_overview_stats
      - best_trade
      - worst_trade
      - win_streak
    """
    overview = compute_overview_stats(trades, risk_percent)
    best = compute_best_trade(trades)
    worst = compute_worst_trade(trades)
    streak = compute_win_streak(trades)

    return {
        "overview": overview,
        "best_trade": best,
        "worst_trade": worst,
        "win_streak": streak,
    }
