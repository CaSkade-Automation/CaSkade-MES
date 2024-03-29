import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ModuleModule } from './routes/production-modules/module.module';
import { GraphRepositoryModule } from './routes/graph-repositories/graph-repository.module';
import { GraphOperationModule } from './routes/graph-operations/graph-operation.module';
import { CapabilityModule } from './routes/capabilities/capability.module';
import { SkillModule } from './routes/skills/skill.module';
import { SkillExecutionModule } from './routes/skill-execution/skill-execution.module';
import { MtpMappingModule } from './routes/mappings/mtp-mapping/mtp-mapping.module';
import { PlcMappingModule } from './routes/mappings/plc-mapping/plc-mapping.module';
import { OpcUaModule } from './util/opcua.module';
import { GraphDbConnectionModule } from './util/GraphDbConnection.module';
import { SocketModule } from './socket-gateway/socket.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration/config';


@Module({
    imports: [
    ConfigModule.forRoot({
        isGlobal: true,
        load: [configuration],
        }),
    ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'frontend-dist'),
        }),
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
    PlcMappingModule,
    OpcUaModule
    ],
    controllers: [AppController],
    providers: [],
    exports: [
    GraphDbConnectionModule,
    SocketModule
    ]
    })
export class AppModule {}
