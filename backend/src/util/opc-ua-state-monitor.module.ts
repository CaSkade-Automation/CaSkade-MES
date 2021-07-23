import { Global, HttpModule, Module } from "@nestjs/common";
import { OpcUaStateMonitorService } from "./opc-ua-state-monitor.service";
import { LocalHttpRequestConfigService } from "./LocalHttpRequestConfigService";
import { GraphDbConnectionModule } from "./GraphDbConnection.module";

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
