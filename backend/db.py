import sqlite3
import os
from config import DB_PATH
from models.trades import CREATE_TRADES_TABLE_SQL
from models.setups import CREATE_SETUPS_TABLE_SQL

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    return conn

def init_db():
    create_new = not os.path.exists(DB_PATH)
    conn = get_connection()
    cur = conn.cursor()

    if create_new:
        cur.execute(CREATE_TRADES_TABLE_SQL)
        cur.execute(CREATE_SETUPS_TABLE_SQL)
        print("Database created with pro fields!")

    conn.commit()
    conn.close()
