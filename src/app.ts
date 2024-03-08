import { IncomingMessage } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { messages } from "../messages";
import { webSocketServerConfiguration } from "./config/webSocketServerConfig";

// class WSConn {
//     ws: WebSocket;
//     webSocketServer: WebSocketServer;

//     constructor(ws: WebSocket, wss: WebSocketServer) {
//         this.ws = ws;
//         this.webSocketServer = wss;
//         this.ws.on("message", this.handleMessage.bind(this));
//     }

//     handleMessage(data: WebSocket.RawData, isBinary: boolean) {
//         console.log(' 📫 Received message: ', data.toString());
//         const object = JSON.parse(data.toString());

//         if (object.initial) {
//             this.ws.send(JSON.stringify(messages));
//             return;
//         }

//         messages.push({
//             content: object.content,
//             sender: object.user,
//             time: new Date().toLocaleString(),
//         });

//         const JSONStringMessages = JSON.stringify(messages);

//         this.webSocketServer.clients.forEach(client => client.send(JSONStringMessages))
//     }
// }

export default class App {
    webSocketServer: WebSocketServer;

    constructor(webSocketServerConfiguration: WebSocket.ServerOptions) {
        this.webSocketServer = new WebSocketServer(webSocketServerConfiguration);
    }

    start() {
        this.webSocketServer.on('connection', this.handleOnConnection.bind(this));
        this.webSocketServer.on('error', (err: Error) => {
            console.error(err);
        });
        this.webSocketServer.on('close', () => {
            console.log(' 📵 WebSocket server closed.');
        });

        console.log(' 🚀 WebSocket server is running on port', webSocketServerConfiguration.port);
    }

    private handleOnConnection(webSocket: WebSocket, request: IncomingMessage) {
        console.log(' 🤝 New connection.')
        this.configureOnMessage(webSocket, this.webSocketServer);
        this.configureOnClose(webSocket);
        this.configureOnError(webSocket);
    }

    private configureOnMessage(webSocket: WebSocket, webSocketServer: WebSocketServer) {
        webSocket.on("message", (data, isBinary) => {
            console.log(' 📫 Received message: ', data.toString());
            const object = JSON.parse(data.toString());

            if (object.initial) {
                webSocket.send(JSON.stringify(messages));
                return;
            }

            messages.push({
                content: object.content,
                sender: object.user,
                time: new Date().toLocaleString(),
            });

            const JSONStringMessages = JSON.stringify(messages);

            webSocketServer.clients.forEach(client => client.send(JSONStringMessages))
        });
    }

    private configureOnClose(webSocket: WebSocket) {
        webSocket.on("close", () => {
            console.log(` 📵 Connection closed.`);
        });
    }

    private configureOnError(webSocket: WebSocket) {
        webSocket.on("error", (err: Error) => {
            console.error(err);
        });
    }


}