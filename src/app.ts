import App, { logger } from "./application";

try {
    const app = new App();
    app.start();
} catch (e) {
    logger.log('error', e);
}