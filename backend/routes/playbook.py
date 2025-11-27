from flask import Blueprint, jsonify, request
from db import get_connection
from models.setups import dict_setup

playbook_bp = Blueprint("playbook", __name__, url_prefix="/api/playbook")

@playbook_bp.get("/setups")
def get_setups():
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM setups ORDER BY id ASC")
    rows = c.fetchall()
    conn.close()
    return jsonify([dict_setup(r) for r in rows])

@playbook_bp.get("/setups/<int:setup_id>")
def get_setup_detail(setup_id):
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM setups WHERE id=?", (setup_id,))
    row = c.fetchone()
    conn.close()
    if not row:
        return jsonify({"error": "Setup not found"}), 404
    return jsonify(dict_setup(row))

@playbook_bp.post("/setups")
def add_setup():
    data = request.get_json(force=True)

    instruments = ",".join(data.get("instruments", []))
    timeframes = ",".join(data.get("timeframes", []))

    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        INSERT INTO setups(
            name, version, instruments, timeframes, direction,
            context, entry_rules, sl_tp_rules, management,
            invalidation, mistakes, notes, example_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get("name", ""),
        data.get("version", ""),
        instruments,
        timeframes,
        data.get("direction", ""),
        data.get("context", ""),
        data.get("entry_rules", ""),
        data.get("sl_tp_rules", ""),
        data.get("management", ""),
        data.get("invalidation", ""),
        data.get("mistakes", ""),
        data.get("notes", ""),
        data.get("example_image", None),
    ))
    conn.commit()
    new_id = c.lastrowid
    conn.close()

    return jsonify({"message": "setup added", "id": new_id}), 201
