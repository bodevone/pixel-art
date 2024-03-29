const WebSocket = require("ws");
const http = require("http");
const express = require("express");
const { Redis } = require("ioredis");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var canvasDimensions = {"maxX": 200, "maxY": 200};

const redis = new Redis(process.env.REDIS_URL);

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

app.get("/", (req, res) => {
  res.send('Hello World!');
})

wss.on('connection', (ws) => {

  ws.on('message', async (message) => {

    message = JSON.parse(message)
    const userCount = wss.clients.size;

    if (message.action === "connect") {

      const canvas = await new Promise((resolve, reject) => {
        redis.hgetall("canvas", (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      canvas["maxX"] = canvasDimensions["maxX"];
      canvas["maxY"] = canvasDimensions["maxY"];

      ws.send(JSON.stringify({"action": "connect", "userCount": userCount, "canvas": canvas}));

      broadcast(JSON.stringify({"action": "join", "userCount": userCount}));

    } else if (message.action === "changeColor") {

      const posX = message.posX;
      const posY = message.posY;
      const color = message.color;
      const key = posX + "-" + posY;

      await redis.hset("canvas", key, color);

      broadcast(JSON.stringify({"action": "changeColor", "color": color, "posX": posX, "posY": posY}));

    } else if (message.action === "disconect") {

      broadcast(JSON.stringify({"action": "disconnect", "userCount": userCount}));

    }
  });

  ws.on("close", () => {
    broadcast(JSON.stringify({"action": "disconnect", "userCount": wss.clients.size}));
  });
  
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {});
