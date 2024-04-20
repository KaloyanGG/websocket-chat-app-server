// @ts-nocheck
import { ClientRequest, IncomingMessage, createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { messages } from "./db/messages";
import express, { Express, Request, Response } from "express";
import { Server } from "http";
import { httpServerConfiguration, webSocketServerConfiguration } from "./config/config";
import winston, { Logger } from "winston";

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'logFile.log', })
    ]
});
function messageWithDate(message: string) {
    return new Date().toLocaleString() + " " + message;
}
export default class App {
    webSocketServer: WebSocketServer;
    expressApp: Express;
    httpServer: Server;

    constructor() {
        this.expressApp = express();

        // this.expressApp.use((req, res, next) => {
        //     // Set CSP headers
        //     res.setHeader("Content-Security-Policy", "connect-src 'self' wss://geodeya.com; default-src 'none'");
        //     next();
        //   });

        this.configureRoutes();

        this.httpServer = createServer(this.expressApp);
        this.webSocketServer = new WebSocketServer(this.getConfigurationOfWebSocketServer(this.httpServer));
    }

    private configureRoutes() {
        this.expressApp.get("/koko/techo", (req: Request, res: Response) => {
            console.log(messageWithDate("... Health check from console"))
            res.send("<h1>hui</h1>");
        });
    }

    private getConfigurationOfWebSocketServer(httpServer: Server): WebSocket.ServerOptions {
        return {
            ...webSocketServerConfiguration,
            server: httpServer,
        }
    }

    start() {
        this.webSocketServer.on('connection', this.handleOnConnection.bind(this));
        this.webSocketServer.on('error', (err: Error) => {
            console.error(messageWithDate(err as any));
        });
        this.webSocketServer.on('close', () => {
            console.log(messageWithDate(' 📵 WebSocket server closed.'));
        });

        this.httpServer.listen(httpServerConfiguration.port);

        console.log(' 🚀 HttpWebSocket server is running on port', httpServerConfiguration.port);
    }

    private handleOnConnection(webSocket: WebSocket, request: IncomingMessage) {

        setInterval(() => {
            webSocket.send('👋 Hello from server' + new Date());
        }, 3000);

        console.log(' 🤝 New connection.');
        try {
            // if(this.remoteAddresses.length > 1){
            //     webSocket.close();
            // }
            // console.log("remote address: ")
            // console.log(request.socket.remoteAddress);
            // console.log("\norigin: ")
            // console.log(request.headers.origin);
            webSocket.on('unexpected-response', (request: ClientRequest, response: IncomingMessage) => {
                console.log(".... unexpected-response ...")
                console.log(request);
                console.log(response);
            });
            webSocket.on('open', () => {
                console.log(".... open ...")
            })

            this.configureOnMessage(webSocket, this.webSocketServer);
            this.configureOnClose(webSocket);
            this.configureOnError(webSocket);
        } catch (err) {
            console.log(err);
            logger.log("error", err);
        }
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
        webSocket.on("close", (code: number, reason: Buffer) => {
            console.log(new Date().toLocaleString());
            console.log(` ⛔ Connection closed with code ${code} and reason ${reason}.`);
            console.log(` 📵 Connection closed.`);
        });
    }

    private configureOnError(webSocket: WebSocket) {
        webSocket.on("error", (err: Error) => {
            console.log(' ❌ An error occurred.' + err.message)
            console.error(err);
        });
    }


}