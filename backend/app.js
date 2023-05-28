const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");

const app = express();
const server = http.createServer(app);

const ws = new WebSocketServer({ server });

ws.on("error", console.error);

ws.on("message", (data) => {
  console.log("received: %s", data);
});

ws.send("something");

const port = process.env.PORT || 3000;
server.listen(port);
