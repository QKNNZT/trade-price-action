CREATE_TRADES_TABLE_SQL = """
CREATE TABLE trades(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    symbol TEXT,
    setup TEXT,
    direction TEXT,
    entry REAL,
    sl REAL,
    tp REAL,
    exit REAL,
    capital REAL,
    rr REAL,
    profit REAL,
    profit_pct REAL,
    note TEXT,
    session TEXT,
    timeframe TEXT,
    confluence TEXT,
    grade INTEGER,
    mistakes TEXT,
    entry_reason TEXT,
    exit_reason TEXT,

     -- 🔥 PRO ADDITIONS BELOW:
    htf_bias TEXT,
    trend_direction TEXT,
    structure_event TEXT,

    entry_model TEXT,

    partial_tp TEXT,
    be_trigger TEXT,
    scale_mode TEXT,

    chart_before TEXT,
    chart_after TEXT,

    psychological_tags TEXT,
    lessons TEXT
)
"""

def dict_trade(r):
    return {
        "id": r[0], "date": r[1], "symbol": r[2], "setup": r[3], "direction": r[4],
        "entry": r[5], "sl": r[6], "tp": r[7], "exit": r[8], "capital": r[9],
        "rr": r[10], "profit": r[11], "profit_pct": r[12], "note": r[13],
        "session": r[14], "timeframe": r[15], "confluence": r[16], "grade": r[17],
        "mistakes": r[18], "entry_reason": r[19], "exit_reason": r[20],
        "htf_bias": r[21], "trend_direction": r[22], "structure_event": r[23],
        "entry_model": r[24], "partial_tp": r[25], "be_trigger": r[26],
        "scale_mode": r[27], "chart_before": r[28], "chart_after": r[29],
        "psychological_tags": r[30], "lessons": r[31],
    }
