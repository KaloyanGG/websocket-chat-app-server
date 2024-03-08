import WebSocket from "ws";

export const webSocketServerConfiguration: WebSocket.ServerOptions = {
    port: 8081,
    // clientTracking: true by default
} as const;