import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";

import { createGameServer } from "./game";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const port = process.env.PORT ?? 3000;

createGameServer(wss);
server.listen(port);
