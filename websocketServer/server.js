const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var canvas = {"maxX": 200, "maxY": 200};

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

  ws.on('message', (message) => {

    message = JSON.parse(message)
    const userCount = wss.clients.size;

    if (message.action === "connect") {

      ws.send(JSON.stringify({"action": "connect", "userCount": userCount, "canvas": canvas}));

      broadcast(JSON.stringify({"action": "join", "userCount": userCount}));

    } else if (message.action === "changeColor") {

      const posX = message.posX;
      const posY = message.posY;
      const color = message.color;
      const key = posX + "-" + posY;
      canvas[key] = color;

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
