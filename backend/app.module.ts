import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ModuleModule } from './routes/production-modules/module.module';
import { SocketModule } from './socket-gateway/socket.module';
import { GraphDbConnectionModule } from './util/GraphDbConnection.module';
import { GraphRepositoryModule } from './routes/graph-repositories/graph-repository.module';
import { GraphOperationModule } from './routes/graph-operations/graph-operation.module';
import { CapabilityModule } from './routes/capabilities/capability.module';
import { SkillModule } from './routes/skills/skill.module';
import { SkillExecutionModule } from './routes/skill-execution/skill-execution.module';
import { MtpMappingModule } from './routes/mappings/mtp-mapping.module';
import { OpcUaStateMonitorModule } from './util/opc-ua-state-monitor.module';


@Module({
    imports: [
        GraphDbConnectionModule,
        MtpMappingModule,
        SocketModule,
        ModuleModule,
        CapabilityModule,
        SkillModule,
        GraphRepositoryModule,
        GraphOperationModule,
        SkillExecutionModule,
        MtpMappingModule,
        OpcUaStateMonitorModule
    ],
    controllers: [AppController],
    providers: [],
    exports: [
        GraphDbConnectionModule,
        SocketModule
    ]
})
export class AppModule {}
