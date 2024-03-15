import { ServerOptions } from "ws";

export const webSocketServerConfiguration: ServerOptions = {
    // port: 8081,

    // True by default:
    clientTracking: true,
} as const;

export const httpServerConfiguration = {
    port: process.env.PORT || 3000,
}



