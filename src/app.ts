import { IncomingMessage, createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { messages } from "./messages";
import express, { Express, Request, Response } from "express";
import { Server } from "http";
import { httpServerConfiguration, webSocketServerConfiguration } from "./config/config";

export default class App {
    webSocketServer: WebSocketServer;
    expressApp: Express;
    httpServer: Server;

    constructor() {
        this.expressApp = express();
        this.configureRoutes();

        this.httpServer = createServer(this.expressApp);
        this.webSocketServer = new WebSocketServer(this.getConfigurationOfWebSocketServer(this.httpServer));
    }

    private configureRoutes() {
        this.expressApp.get("/", (req: Request, res: Response) => {
            res.send("Hello, World!");
        });
    }

    private getConfigurationOfWebSocketServer(httpServer: Server): WebSocket.ServerOptions {
        return {
            ... webSocketServerConfiguration,
            server: httpServer,
        }
    }

    start() {
        this.webSocketServer.on('connection', this.handleOnConnection.bind(this));
        this.webSocketServer.on('error', (err: Error) => {
            console.error(err);
        });
        this.webSocketServer.on('close', () => {
            console.log(' 📵 WebSocket server closed.');
        });

        this.httpServer.listen(httpServerConfiguration.port);

        console.log(' 🚀 HttpWebSocket server is running on port', httpServerConfiguration.port);
    }

    // remoteAddresses: string[] = []; 
    private handleOnConnection(webSocket: WebSocket, request: IncomingMessage) {
        
        console.log(' 🤝 New connection.');

        //!ns: host both apps to see if working
        // if(this.remoteAddresses.length > 1){
        //     webSocket.close();
        // }
        // console.log("remote address: ")
        // console.log(request.socket.remoteAddress);
        // console.log("\norigin: ")
        // console.log(request.headers.origin);

        this.configureOnMessage(webSocket, this.webSocketServer);
        this.configureOnClose(webSocket);
        this.configureOnError(webSocket);
    }

    private configureOnMessage(webSocket: WebSocket, webSocketServer: WebSocketServer) {
        webSocket.on("message", (data: WebSocket.RawData, isBinary: boolean) => {
            // console.log(' 📫 Received message: ', data.toString());
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