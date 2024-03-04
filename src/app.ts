import { WebSocketServer } from "ws";
import { webSocketServerConfiguration, webSocketServerOnConnection } from "./config/webSocketServerConfig";

const wss = new WebSocketServer(webSocketServerConfiguration);

wss.on('connection', webSocketServerOnConnection);

wss.on('close', () => console.log(' 👋 bye bye'));

wss.on('error', (err) => console.error(err));

console.log(' 🚀 WebSocket server is running on port', webSocketServerConfiguration.port);

