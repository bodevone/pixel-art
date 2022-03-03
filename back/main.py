import os

from aiohttp import web

from canvas import Canvas
from views import index

HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', 8080))


async def init_app() -> web.Application:
    app = web.Application()

    app["connections"] = {}
    app["usernames"] = {}
    app["canvas"] = {
        "dimension_x": Canvas.DIMENSIONS[0],
        "dimension_y": Canvas.DIMENSIONS[1],
    }

    app.on_shutdown.append(shutdown)

    app.router.add_get('/', index)

    return app


async def shutdown(app: web.Application) -> None:
    for ws in list(app['connections'].values()):
        await ws.close()
    app['connections'].clear()


def main() -> None:
    app = init_app()
    web.run_app(
        app,
        host=HOST,
        port=PORT,
    )


if __name__ == "__main__":
    main()
