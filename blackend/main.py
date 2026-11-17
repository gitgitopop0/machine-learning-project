import json
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Annotated

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import db
from ml.predict import predict

ANIMALS = json.loads(
    (Path(__file__).resolve().parent / "data" / "animals.json").read_text(encoding="utf-8")
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    db.init_db()
    yield


app = FastAPI(title="Animal Personality API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    answers: list[Annotated[int, Field(ge=1, le=5)]] = Field(min_length=10, max_length=10)


class ConnectionManager:
    def __init__(self):
        self.active: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)

    def disconnect(self, ws: WebSocket):
        if ws in self.active:
            self.active.remove(ws)

    async def broadcast(self, message: dict):
        for ws in list(self.active):
            try:
                await ws.send_json(message)
            except Exception:
                self.disconnect(ws)


manager = ConnectionManager()


def enrich(row: dict) -> dict:
    return {**row, "info": ANIMALS[row["animal"]]}


@app.post("/predict")
async def predict_endpoint(req: PredictRequest):
    animal, confidence, scores = predict(req.answers)
    row = db.insert_result(req.answers, scores, animal, confidence)
    result = enrich(row)
    await manager.broadcast({"type": "result", "data": result})
    return result


@app.get("/latest")
def latest():
    row = db.get_latest()
    return enrich(row) if row else None


@app.get("/stats")
def stats():
    return db.get_stats()


@app.websocket("/ws/result")
async def ws_result(ws: WebSocket):
    await manager.connect(ws)
    row = db.get_latest()
    await ws.send_json({"type": "result", "data": enrich(row)} if row else {"type": "empty"})
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(ws)