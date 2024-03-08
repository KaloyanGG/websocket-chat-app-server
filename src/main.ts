import { webSocketServerConfiguration } from "./config/webSocketServerConfig";
import App from "./app";

const app = new App(webSocketServerConfiguration);
app.start();


