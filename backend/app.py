# app.py
from flask import Flask
from flask_cors import CORS

from config import UPLOAD_FOLDER
from db import init_db
from routes.trades import trades_bp
from routes.playbook import playbook_bp
from routes.stats import stats_bp  

def create_app():
    app = Flask(__name__)

    # CORS: áp dụng cho toàn bộ /api/*
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    # Nếu bạn muốn chặt chẽ hơn:
    # CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000"]}})

    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

    # Init DB (tạo file + bảng nếu chưa có)
    init_db()

    # Register blueprints
    app.register_blueprint(trades_bp)
    app.register_blueprint(playbook_bp)
    app.register_blueprint(stats_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
