import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { BroadcastListener } from './BroadCastListener';

async function bootstrap(): Promise<void> {
    const port = 9090;
    const logger = new Logger("Main");
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    await app.listen(port);
    const broadcastListener = new BroadcastListener();
    logger.log(`Backend now listening on port ${port}`);
}
bootstrap();
