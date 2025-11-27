CREATE_SETUPS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS setups(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    version TEXT,
    instruments TEXT,
    timeframes TEXT,
    direction TEXT,
    context TEXT,
    entry_rules TEXT,
    sl_tp_rules TEXT,
    management TEXT,
    invalidation TEXT,
    mistakes TEXT,
    notes TEXT,
    example_image TEXT,
    universal_checklist TEXT,
    setup_checklist TEXT
)
"""

def dict_setup(r):
    return {
        "id": r[0],
        "name": r[1],
        "version": r[2],
        "instruments": r[3] or "",
        "timeframes": r[4] or "",
        "direction": r[5] or "",
        "context": r[6] or "",
        "entry_rules": r[7] or "",
        "sl_tp_rules": r[8] or "",
        "management": r[9] or "",
        "invalidation": r[10] or "",
        "mistakes": r[11] or "",
        "notes": r[12] or "",
        "example_image": r[13] or None,
        "universal_checklist": r[14] or "",
        "setup_checklist": r[15] or ""
    }
