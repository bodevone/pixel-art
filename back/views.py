import json

import aiohttp
from aiohttp import web

from canvas import Canvas


async def index(request: web.Request) -> web.WebSocketResponse:
    canvas = Canvas(app=request.app)
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    async for msg in ws:
        if msg.type == aiohttp.WSMsgType.TEXT:
            data = json.loads(msg.data)
            action = data["action"]
            if action == "connect":
                await canvas.connect_user(ws=ws)
            elif action == "change_color":
                await canvas.change_color(pos_x=data["pos_x"], pos_y=data["pos_y"], color=data["color"])
            elif action == "disconnect":
                await canvas.disconnect_user(user_id=data["user_id"], ws=ws)
    await canvas.disconnect_user(user_id=canvas.user_id, ws=ws)
    return ws
