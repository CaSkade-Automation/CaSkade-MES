import { Module } from '@nestjs/common';
import { ModuleController } from './module.controller';

@Module({
  controllers: [ModuleController],
  providers: [],
})
export class ModuleModule {}
