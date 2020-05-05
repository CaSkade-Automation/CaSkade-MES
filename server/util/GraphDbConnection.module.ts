import { Global, Module } from "@nestjs/common";
import { GraphDbConnectionService } from "./GraphDbConnection.service";

@Global()
@Module({
    providers: [
        GraphDbConnectionService,
    ],
    exports: [
        GraphDbConnectionService
    ],
})
export class GraphDbConnectionModule {}
