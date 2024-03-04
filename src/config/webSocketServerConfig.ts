import { IncomingMessage } from "http";
import WebSocket, { ServerOptions, WebSocketServer } from "ws";
import { messages } from "../../messages";
import { v4 } from "uuid";

export const webSocketServerConfiguration: WebSocket.ServerOptions = {
    port: 8081,
    // clientTracking: true by default
} as const;

const connections: Map<WebSocket, string> = new Map();

export function webSocketServerOnConnection(webSocket: WebSocket, request: IncomingMessage) {
    console.log(' 🤝 New connection.')

    const id = v4();
    connections.set(webSocket, id);

    webSocket.on("error", handleError);
    // webSocket.on("message", (data, isBinary) => handleMessage(data, isBinary, id, webSocket));
    webSocket.on("message", (data, isBinary) => handleMessage(data, isBinary, webSocket));
    
    // const int = sendMessageOnInterval(webSocket, ` 💻 -> 🙍 message content`, 5000);

    webSocket.on("close", () => handleClose(webSocket));

}

function sendMessageOnInterval(webSocket: WebSocket, message: string, interval: number) {
    let i = 0;
    return setInterval(() => {
        webSocket.send(JSON.stringify({
            message: `${new Date().toLocaleString()} - ${message}`,
        }), (err?: Error | undefined) => {
            if (err) {
                console.log(err)
            } else {
                console.log(message)
            }
        });
    }, interval);
}

function handleError(err: Error) {
    console.error(err);
}

function handleClose(webSocket: WebSocket, int?: NodeJS.Timeout) {
    console.log(` 📵 Connection closed.`);
    connections.delete(webSocket);
    int && clearInterval(int);
}

function handleMessage(data: WebSocket.RawData, isBinary: boolean, webSocket: WebSocket) {
    console.log(' 📫 Received message: ', data.toString())
    const object = JSON.parse(data.toString());
    messages.push({
        content: object.content,
        sender: object.user,
        time: new Date().toLocaleString(),
    });

    webSocket.send(JSON.stringify(messages));

}

// function handleMessage(data: WebSocket.RawData, isBinary: boolean, id: string, webSocket: WebSocket) {
//     console.log(' 📫 Received message: ', data.toString())
//     messages.push({
//         content: data.toString(),
//         sender: id,
//         time: new Date().toLocaleString(),
//     });

//     webSocket.send(JSON.stringify(messages));

// }