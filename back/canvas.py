import uuid
from typing import Dict

from aiohttp import web


class Canvas:
    DIMENSIONS = (200, 200)

    def __init__(self, app: web.Application):
        self.app = app
        self.user_id = None

    async def connect_user(self, ws: web.WebSocketResponse) -> None:
        user_id = str(uuid.uuid4())
        self.user_id = user_id
        user_count = len(self.app["connections"]) + 1
        await ws.send_json({
            "action": "connect", "user_id": user_id,
            "user_count": user_count, "canvas": self.app["canvas"],
        })
        await self.broadcast(data={"action": "join", "user_count": user_count})
        self.app["connections"][user_id] = ws

    async def change_color(self, pos_x: int, pos_y: int, color: str) -> None:
        pos_id = f"{pos_x}:{pos_y}"
        self.app["canvas"][pos_id] = color
        await self.broadcast(data={
            "action": "change_color", "color": color,
            "pos_x": pos_x, "pos_y": pos_y,
        })

    async def disconnect_user(self, user_id: str, ws: web.WebSocketResponse) -> None:
        del self.app["connections"][user_id]
        user_count = len(self.app["connections"])
        await ws.close()
        await self.broadcast(data={"action": "disconnect", "user_count": user_count})

    async def broadcast(self, data: Dict) -> None:
        for ws in self.app["connections"].values():
            await ws.send_json(data)
