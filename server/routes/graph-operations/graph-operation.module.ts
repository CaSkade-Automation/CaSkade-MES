import { Module } from "@nestjs/common";
import { GraphOperationController } from './graph-operation.controller';

@Module({
  imports: [],
  controllers: [GraphOperationController],
  providers: [],
})
export class GraphOperationModule {}
