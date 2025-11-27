# routes/trades.py
from flask import Blueprint, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import json
import os
from config import DB_PATH, UPLOAD_FOLDER, ALLOWED_EXTENSIONS
from db import get_connection
from models.trades import dict_trade
from utils.files import save_upload

trades_bp = Blueprint("trades", __name__, url_prefix="/api")
CORS(trades_bp, origins=["http://localhost:3000"])  # BẬT CORS

# === GET ALL TRADES ===
@trades_bp.get("/trades")
def get_trades():
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM trades ORDER BY date DESC, id DESC")
    rows = c.fetchall()
    conn.close()
    return jsonify([dict_trade(r) for r in rows]), 200

# === ADD TRADE ===
@trades_bp.post("/trades")
def add_trade():
    data = request.form
    files = request.files

    # Upload chart_before
    chart_before = save_upload(files.get("chart_before")) if "chart_before" in files else None

    # Xử lý array → JSON string
    def to_json_list(value):
        if not value:
            return "[]"
        try:
            arr = json.loads(value)
            if isinstance(arr, list):
                return json.dumps(arr)
        except:
            pass
        return json.dumps([v.strip() for v in value.split(",") if v.strip()])

    confluence = to_json_list(data.get("confluence"))
    entry_model = to_json_list(data.get("entry_model"))
    psychological_tags = to_json_list(data.get("psychological_tags"))

    # Số
    entry = float(data.get("entry") or 0)
    sl = float(data.get("sl") or 0)
    tp = float(data.get("tp") or 0)
    capital = float(data.get("capital") or 0)

    # Tính RR
    rr = abs((tp - entry) / (entry - sl)) if entry != sl and sl != 0 else 0

    # Insert
    conn = get_connection()
    c = conn.cursor()
    try:
        c.execute("""
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
        """, (
            data.get("date"), data.get("symbol"), data.get("setup"), data.get("direction"),
            entry, sl, tp, 0, capital, rr, 0, 0,
            data.get("note", ""), data.get("session", ""), data.get("timeframe", ""),
            confluence, None, "[]",
            data.get("entry_reason", ""), "",
            data.get("htf_bias", ""), data.get("trend_direction", ""), data.get("structure_event", ""),
            entry_model,
            data.get("partial_tp", ""), data.get("be_trigger", ""), data.get("scale_mode", ""),
            chart_before, None,
            psychological_tags,
            data.get("lessons", "")
        ))
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
        c.execute("UPDATE trades SET chart_after = ? WHERE id = ?", (filename, trade_id))
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
        c.execute("SELECT chart_before, chart_after FROM trades WHERE id = ?", (id,))
        row = c.fetchone()
        if not row:
            return jsonify({"error": "Trade not found"}), 404

        chart_before, chart_after = row

        # XÓA FILE AN TOÀN
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

        # XÓA TRADE
        c.execute("DELETE FROM trades WHERE id = ?", (id,))
        if c.rowcount == 0:
            return jsonify({"error": "Trade not deleted"}), 500

        conn.commit()
        return jsonify({
            "message": "Trade deleted",
            "deleted_id": id,
            "files_removed": {"chart_before": before_ok, "chart_after": after_ok}
        }), 200

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
        c.execute("""
            SELECT entry, direction, capital, sl, tp FROM trades WHERE id = ?
        """, (id,))
        row = c.fetchone()
        if not row:
            return jsonify({"error": "Trade not found"}), 404

        entry, direction, capital, sl, tp = row
        capital = capital or 0

        # Tính số pip từ entry đến exit
        pip_diff = abs(exit_price - entry) * 10000  # 4-digit broker

        # Tính lot size từ risk 1%
        risk_percent = 0.01
        risk_amount = capital * risk_percent
        stop_pips = abs(entry - sl) * 10000
        lot_size = risk_amount / (stop_pips * 10)  # 1 pip = $10 cho 1 lot

        # Tính profit theo $
        profit = pip_diff * lot_size * 10
        if direction == "Short":
            profit = -profit if exit_price > entry else profit
        else:
            profit = profit if exit_price > entry else -profit

        profit_pct = (profit / capital) * 100 if capital > 0 else 0

        # Cập nhật DB
        c.execute("""
            UPDATE trades 
            SET exit = ?, profit = ?, profit_pct = ?
            WHERE id = ?
        """, (exit_price, round(profit, 2), round(profit_pct, 2), id))
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

    # Xử lý array
    mistakes = json.dumps(data.get("mistakes", [])) if isinstance(data.get("mistakes"), list) else "[]"
    psych_tags = json.dumps(data.get("psychological_tags", [])) if isinstance(data.get("psychological_tags"), list) else "[]"

    conn = get_connection()
    c = conn.cursor()
    try:
        c.execute("""
            UPDATE trades SET
                grade = ?, mistakes = ?, exit_reason = ?,
                note = ?, psychological_tags = ?, lessons = ?
            WHERE id = ?
        """, (grade, mistakes, exit_reason, note, psych_tags, lessons, id))
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