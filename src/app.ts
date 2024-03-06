import { WebSocketServer } from "ws";
import { webSocketServerConfiguration, webSocketServerOnConnection } from "./config/webSocketServerConfig";

const wss = new WebSocketServer(webSocketServerConfiguration);

wss.on('connection', (wS, req) => webSocketServerOnConnection(wS, req, wss));

wss.on('close', () => console.log(' 👋 bye bye'));

wss.on('error', (err) => console.error(err));

console.log(' 🚀 WebSocket server is running on port', webSocketServerConfiguration.port);

