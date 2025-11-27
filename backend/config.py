# config.py
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INSTANCE_DIR = os.path.join(BASE_DIR, "instance")
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

# Tạo thư mục tự động
os.makedirs(INSTANCE_DIR, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

DB_PATH = os.path.join(INSTANCE_DIR, "trade_manager.db")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}