import { IncomingMessage } from "http";
import WebSocket, { ServerOptions, WebSocketServer } from "ws";

export const webSocketServerConfiguration = {
    port: 8081,
} as const;

export function webSocketServerOnConnection(socket: WebSocket, request: IncomingMessage) {
    console.log(' 🤝 New connection from ', request.url)

    socket.on("error", handleError);
    socket.on("message", handleMessage)

    sendMessageOnInterval(socket, ` 💻 -> 🙍 message content`, 3000);
}

function sendMessageOnInterval(socket: WebSocket, message: string, interval: number) {
    let i = 0;
    setInterval(() => {
        socket.send(`[${new Date().toLocaleString()}] ${message} `, (err?: Error | undefined) => {
            if (err) {
                console.log(err)
            } else {
                console.log(message)
            }
        })
    }, interval);
}

function handleError(err: Error) {
    console.error(err);
}

function handleMessage(data: WebSocket.RawData, isBinary: boolean) {
    console.log(' 📫 Received message: ', data)
}