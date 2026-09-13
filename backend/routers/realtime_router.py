"""
Real-Time Telemetry and Event Broadcasting Router (backend/routers/realtime_router.py).
Provides WebSocket and Server-Sent Events (SSE) connections for live cross-client updates.
"""
import asyncio
import json
from typing import List
from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/api", tags=["Real-Time"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        dead_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                dead_connections.append(connection)
        for dc in dead_connections:
            self.disconnect(dc)

manager = ConnectionManager()

# Global in-memory event stream for SSE
recent_events: List[dict] = [
    {
        "id": "e-seed-1",
        "type": "TEST_COMPLETED",
        "userName": "Priya Patel",
        "userEmail": "priya.patel@ielts.com",
        "skill": "Reading",
        "band": 8.0,
        "message": "achieved Band 8.0 on Roman Aqueducts Reading Test",
        "timestamp": datetime.utcnow().isoformat()
    },
    {
        "id": "e-seed-2",
        "type": "WRITING_EVALUATED",
        "userName": "Marcus Zhao",
        "userEmail": "marcus.zhao@ielts.com",
        "skill": "Writing",
        "band": 7.0,
        "message": "submitted Task 2 Essay with Band 7.0 Task Response",
        "timestamp": datetime.utcnow().isoformat()
    }
]

@router.websocket("/ws/realtime")
async def websocket_realtime_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial handshake and recent events
        await websocket.send_json({
            "type": "CONNECTION_ESTABLISHED",
            "message": "Connected to IELTS AI Coach Real-Time Telemetry Bus",
            "recent_events": recent_events[-5:]
        })
        while True:
            # Client can ping or broadcast client-side events
            data = await websocket.receive_text()
            try:
                event_data = json.loads(data)
                event_data["timestamp"] = datetime.utcnow().isoformat()
                recent_events.append(event_data)
                if len(recent_events) > 50:
                    recent_events.pop(0)
                await manager.broadcast(event_data)
            except json.JSONDecodeError:
                await websocket.send_json({"type": "PONG", "timestamp": datetime.utcnow().isoformat()})
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@router.get("/realtime/events")
async def sse_realtime_events():
    async def event_generator():
        last_index = len(recent_events)
        yield f"data: {json.dumps({'type': 'CONNECTED', 'message': 'SSE connected'})}\n\n"
        while True:
            await asyncio.sleep(1)
            if len(recent_events) > last_index:
                for ev in recent_events[last_index:]:
                    yield f"data: {json.dumps(ev)}\n\n"
                last_index = len(recent_events)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
