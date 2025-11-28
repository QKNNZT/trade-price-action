# routes/trades.py
from flask import Blueprint, request, jsonify, send_from_directory
import json
import os

from config import UPLOAD_FOLDER
from db import get_connection
from models.trades import dict_trade
from utils.files import save_upload
from utils.json_helpers import to_json_list
from utils.risk import calculate_profit_and_pct

trades_bp = Blueprint("trades", __name__, url_prefix="/api")


# === GET ALL / FILTERED TRADES ===
@trades_bp.get("/trades")
def get_trades():
    """
    Trả về list trades.
    Hỗ trợ filter basic qua query string (tùy chọn):
      - symbol
      - timeframe
      - session
      - setup
      - from (date >=)
      - to (date <=)
    Ví dụ:
      /api/trades?symbol=EURUSD&session=London&from=2024-01-01&to=2024-12-31
    """
    symbol = request.args.get("symbol")
    timeframe = request.args.get("timeframe")
    session = request.args.get("session")
    setup = request.args.get("setup")
    date_from = request.args.get("from")
    date_to = request.args.get("to")

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

    query += " ORDER BY date DESC, id DESC"

    conn = get_connection()
    c = conn.cursor()
    c.execute(query, tuple(params))
    rows = c.fetchall()
    conn.close()

    return jsonify([dict_trade(r) for r in rows]), 200


# === ADD TRADE ===
@trades_bp.post("/trades")
def add_trade():
    data = request.form
    files = request.files

    # Upload chart_before
    chart_before = (
        save_upload(files.get("chart_before")) if "chart_before" in files else None
    )

    # Chuẩn hóa các field dạng list
    confluence = to_json_list(data.get("confluence"))
    entry_model = to_json_list(data.get("entry_model"))
    psychological_tags = to_json_list(data.get("psychological_tags"))

    # Số
    entry = float(data.get("entry") or 0)
    sl = float(data.get("sl") or 0)
    tp = float(data.get("tp") or 0)
    capital = float(data.get("capital") or 0)

    # Tính RR (risk:reward)
    rr = abs((tp - entry) / (entry - sl)) if entry != sl and sl != 0 else 0

    conn = get_connection()
    c = conn.cursor()
    try:
        c.execute(
            """
            INSERT INTO trades (
                date, symbol, setup, direction,
                entry, sl, tp, exit, capital, rr, profit, profit_pct,
                note, session, timeframe,
                confluence, grade, mistakes, entry_reason, exit_reason,
                htf_bias, trend_direction, structure_event,
                entry_model, partial_tp, be_trigger, scale_mode,
                chart_before, chart_after,
                psychological_tags, lessons
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
            (
                data.get("date"),
                data.get("symbol"),
                data.get("setup"),
                data.get("direction"),
                entry,
                sl,
                tp,
                0,  # exit
                capital,
                rr,
                0,  # profit
                0,  # profit_pct
                data.get("note", ""),
                data.get("session", ""),
                data.get("timeframe", ""),
                confluence,
                None,  # grade
                "[]",  # mistakes
                data.get("entry_reason", ""),
                "",
                data.get("htf_bias", ""),
                data.get("trend_direction", ""),
                data.get("structure_event", ""),
                entry_model,
                data.get("partial_tp", ""),
                data.get("be_trigger", ""),
                data.get("scale_mode", ""),
                chart_before,
                None,  # chart_after
                psychological_tags,
                data.get("lessons", ""),
            ),
        )
        conn.commit()
        return jsonify({"message": "Trade added"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


# === UPLOAD CHART AFTER ===
@trades_bp.post("/trades/<int:trade_id>/chart-after")
def upload_chart_after(trade_id):
    if "chart_after" not in request.files:
        return jsonify({"error": "No file"}), 400

    file = request.files["chart_after"]
    filename = save_upload(file)
    if not filename:
        return jsonify({"error": "Upload failed"}), 500

    conn = get_connection()
    c = conn.cursor()
    try:
        c.execute(
            "UPDATE trades SET chart_after = ? WHERE id = ?", (filename, trade_id)
        )
        conn.commit()
        c.execute("SELECT * FROM trades WHERE id = ?", (trade_id,))
        row = c.fetchone()
        return jsonify(dict_trade(row)), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


# === DELETE TRADE ===
@trades_bp.delete("/trades/<int:id>")
def delete_trade(id):
    conn = get_connection()
    c = conn.cursor()
    try:
        c.execute(
            "SELECT chart_before, chart_after FROM trades WHERE id = ?", (id,)
        )
        row = c.fetchone()
        if not row:
            return jsonify({"error": "Trade not found"}), 404

        chart_before, chart_after = row

        def safe_remove(filename):
            if not filename:
                return False
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            try:
                if os.path.exists(filepath):
                    os.remove(filepath)
                    return True
            except Exception as e:
                print(f"[DELETE] Cannot remove {filename}: {e}")
            return False

        before_ok = safe_remove(chart_before)
        after_ok = safe_remove(chart_after)

        c.execute("DELETE FROM trades WHERE id = ?", (id,))
        if c.rowcount == 0:
            return jsonify({"error": "Trade not deleted"}), 500

        conn.commit()
        return (
            jsonify(
                {
                    "message": "Trade deleted",
                    "deleted_id": id,
                    "files_removed": {
                        "chart_before": before_ok,
                        "chart_after": after_ok,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        conn.rollback()
        print(f"[DELETE ERROR] {e}")
        return jsonify({"error": "Server error"}), 500
    finally:
        conn.close()


# === UPDATE EXIT ===
@trades_bp.post("/update_exit/<int:id>")
def update_exit(id):
    data = request.json or {}
    exit_price = float(data.get("exit", 0))

    conn = get_connection()
    c = conn.cursor()
    try:
        c.execute(
            """
            SELECT entry, direction, capital, sl, tp
            FROM trades WHERE id = ?
        """,
            (id,),
        )
        row = c.fetchone()
        if not row:
            return jsonify({"error": "Trade not found"}), 404

        entry, direction, capital, sl, tp = row

        profit, profit_pct = calculate_profit_and_pct(
            exit_price=exit_price,
            entry=entry,
            direction=direction,
            capital=capital,
            sl=sl,
            tp=tp,
            risk_percent=0.01,       # có thể chuyển sang config
            pip_multiplier=10000,    # 4-digit broker
            pip_value_per_lot=10.0,  # $/pip cho 1 lot
        )

        c.execute(
            """
            UPDATE trades
            SET exit = ?, profit = ?, profit_pct = ?
            WHERE id = ?
        """,
            (exit_price, profit, profit_pct, id),
        )
        conn.commit()

        c.execute("SELECT * FROM trades WHERE id = ?", (id,))
        updated = c.fetchone()
        return jsonify(dict_trade(updated)), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


# === SERVE UPLOADS ===
@trades_bp.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# === UPDATE REVIEW ===
@trades_bp.patch("/trades/<int:id>")
def update_trade_review(id):
    data = request.get_json() or {}
    grade = data.get("grade")
    exit_reason = data.get("exit_reason", "")
    note = data.get("note", "")
    lessons = data.get("lessons", "")

    mistakes = data.get("mistakes", [])
    psych_tags = data.get("psychological_tags", [])

    # Normalize list -> JSON string
    mistakes_json = json.dumps(mistakes) if isinstance(mistakes, list) else "[]"
    psych_tags_json = (
        json.dumps(psych_tags) if isinstance(psych_tags, list) else "[]"
    )

    conn = get_connection()
    c = conn.cursor()
    try:
        c.execute(
            """
            UPDATE trades SET
                grade = ?, mistakes = ?, exit_reason = ?,
                note = ?, psychological_tags = ?, lessons = ?
            WHERE id = ?
        """,
            (
                grade,
                mistakes_json,
                exit_reason,
                note,
                psych_tags_json,
                lessons,
                id,
            ),
        )
        conn.commit()

        c.execute("SELECT * FROM trades WHERE id = ?", (id,))
        row = c.fetchone()
        if not row:
            return jsonify({"error": "Not found"}), 404
        return jsonify(dict_trade(row)), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
