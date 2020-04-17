import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ModuleModule } from 'routes/modules/module.module';
import { SocketService } from 'services/socket.service';

@Module({
  imports: [ModuleModule],
  controllers: [AppController],
  providers: [SocketService],
})
export class AppModule {}
