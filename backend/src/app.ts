import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";

import { createManager } from "./manager";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const port = process.env.PORT ?? 3000;

createManager(wss);
server.listen(port);
