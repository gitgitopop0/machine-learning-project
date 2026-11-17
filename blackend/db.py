
import json
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "data" / "app.db"


def _connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with _connect() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS results (
              id          INTEGER PRIMARY KEY AUTOINCREMENT,
              created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime')),
              answers     TEXT NOT NULL,
              scores      TEXT NOT NULL,
              animal      TEXT NOT NULL,
              confidence  REAL NOT NULL
            )
            """
        )


def _row_to_dict(row):
    return {
        "id": row["id"],
        "created_at": row["created_at"],
        "answers": json.loads(row["answers"]),
        "scores": json.loads(row["scores"]),
        "animal": row["animal"],
        "confidence": row["confidence"],
    }


def insert_result(answers, scores, animal, confidence):
    conn = _connect()
    try:
        with conn:
            cur = conn.execute(
                "INSERT INTO results (answers, scores, animal, confidence) VALUES (?, ?, ?, ?)",
                (json.dumps(answers), json.dumps(scores), animal, confidence),
            )
        row = conn.execute("SELECT * FROM results WHERE id = ?", (cur.lastrowid,)).fetchone()
        return _row_to_dict(row)
    finally:
        conn.close()


def get_latest():
    conn = _connect()
    try:
        row = conn.execute("SELECT * FROM results ORDER BY id DESC LIMIT 1").fetchone()
        return _row_to_dict(row) if row else None
    finally:
        conn.close()


def get_stats():
    conn = _connect()
    try:
        total = conn.execute("SELECT COUNT(*) FROM results").fetchone()[0]
        rows = conn.execute(
            "SELECT animal, COUNT(*) AS n FROM results GROUP BY animal ORDER BY n DESC"
        ).fetchall()
        return {"total": total, "by_animal": {r["animal"]: r["n"] for r in rows}}
    finally:
        conn.close()