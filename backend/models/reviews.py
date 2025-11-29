# models/reviews.py
CREATE_REVIEWS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS reviews(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period_type TEXT NOT NULL,   -- 'month' hoặc 'week'
    period_key  TEXT NOT NULL,   -- ví dụ: '2025-03' hoặc '2025-03-10' (ngày bắt đầu tuần)
    from_date   TEXT,
    to_date     TEXT,
    good_points TEXT,
    improvement_points TEXT,
    created_at  TEXT,
    updated_at  TEXT,
    UNIQUE(period_type, period_key)
);
"""


def dict_review(r):
    return {
        "id": r[0],
        "period_type": r[1],
        "period_key": r[2],
        "from_date": r[3],
        "to_date": r[4],
        "good_points": r[5] or "",
        "improvement_points": r[6] or "",
        "created_at": r[7],
        "updated_at": r[8],
    }
