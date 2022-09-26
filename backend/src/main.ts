import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { BroadcastListener } from './BroadcastListener';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap(): Promise<void> {
    const port = 9090;
    const logger = new Logger("Main");
    const app = await NestFactory.create(AppModule);

    // Setup standardized WS adapter for socket communication instead of socket.io
    app.useWebSocketAdapter(new WsAdapter(app));

    app.setGlobalPrefix('api');
    await app.listen(process.env.PORT || port);
    const broadcastListener = new BroadcastListener();
    logger.log(`Backend now listening on port ${port}`);
}
bootstrap();
