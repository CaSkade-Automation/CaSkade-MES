import { Module } from "@nestjs/common";
import { GraphRepositoryController } from "./graph-repository.controller";

@Module({
  imports: [],
  controllers: [GraphRepositoryController],
  providers: [],
})
export class GraphRepositoryModule {}
