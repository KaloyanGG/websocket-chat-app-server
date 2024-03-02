import { IncomingMessage } from "http";
import WebSocket, { WebSocketServer } from "ws";
import {webSocketServerConfiguration, webSocketServerOnConnection } from "./config/webSocketServerConfig";

const wss = new WebSocketServer(webSocketServerConfiguration);

wss.on('connection', webSocketServerOnConnection);

wss.on('close', ()=> console.log(' 👋 bye bye'))

wss.on('error', (err) => console.error(err))