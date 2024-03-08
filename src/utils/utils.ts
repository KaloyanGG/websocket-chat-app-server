import WebSocket from "ws";

export function sendMessageOnInterval(webSocket: WebSocket, message: string, interval: number) {
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