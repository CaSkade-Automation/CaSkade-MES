import { Global, Module } from "@nestjs/common";
import { OpcUaStateMonitorService } from "./opc-ua-state-monitor.service";
import { LocalHttpRequestConfigService } from "./LocalHttpRequestConfigService";
import { GraphDbConnectionModule } from "./GraphDbConnection.module";
import { HttpModule } from "@nestjs/axios";

@Global()
@Module({
    imports:[
        HttpModule.registerAsync({
            useClass: LocalHttpRequestConfigService,
        }),
        GraphDbConnectionModule
    ],
    providers: [
        OpcUaStateMonitorService,
    ],
    exports: [
        OpcUaStateMonitorService
    ],
})
export class OpcUaStateMonitorModule {}
