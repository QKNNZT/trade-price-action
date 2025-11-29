# routes/reviews.py
from flask import Blueprint, request, jsonify
from datetime import datetime
from db import get_connection
from models.reviews import dict_review

reviews_bp = Blueprint("reviews", __name__, url_prefix="/api/reviews")


@reviews_bp.get("")
def get_review():
    period_type = request.args.get("period_type")
    period_key = request.args.get("period_key")

    if not period_type or not period_key:
        return jsonify({"error": "period_type and period_key are required"}), 400

    conn = get_connection()
    c = conn.cursor()
    c.execute(
        """
        SELECT * FROM reviews
        WHERE period_type = ? AND period_key = ?
        LIMIT 1
    """,
        (period_type, period_key),
    )
    row = c.fetchone()
    conn.close()

    if not row:
        return jsonify({"error": "Not found"}), 404

    return jsonify(dict_review(row)), 200


@reviews_bp.post("")
def save_review():
    data = request.get_json() or {}

    period_type = data.get("period_type")
    period_key = data.get("period_key")
    from_date = data.get("from_date")
    to_date = data.get("to_date")
    good_points = data.get("good_points", "")
    improvement_points = data.get("improvement_points", "")

    if not period_type or not period_key:
        return jsonify({"error": "period_type and period_key are required"}), 400

    conn = get_connection()
    c = conn.cursor()

    try:
        c.execute(
            """
            SELECT id FROM reviews
            WHERE period_type = ? AND period_key = ?
        """,
            (period_type, period_key),
        )
        row = c.fetchone()
        now = datetime.utcnow().isoformat()

        if row:
            review_id = row[0]
            c.execute(
                """
                UPDATE reviews
                SET from_date = ?, to_date = ?,
                    good_points = ?, improvement_points = ?,
                    updated_at = ?
                WHERE id = ?
            """,
                (from_date, to_date, good_points, improvement_points, now, review_id),
            )
        else:
            c.execute(
                """
                INSERT INTO reviews(
                    period_type, period_key, from_date, to_date,
                    good_points, improvement_points, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
                (
                    period_type,
                    period_key,
                    from_date,
                    to_date,
                    good_points,
                    improvement_points,
                    now,
                    now,
                ),
            )
            review_id = c.lastrowid

        conn.commit()
        c.execute("SELECT * FROM reviews WHERE id = ?", (review_id,))
        saved = c.fetchone()
        return jsonify(dict_review(saved)), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
