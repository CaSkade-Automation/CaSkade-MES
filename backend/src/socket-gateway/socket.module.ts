import { Module, Global } from '@nestjs/common';
import { CapabilitySocket } from './capability-socket';
import { ModuleSocket } from './module-socket';
import { SkillSocket } from './skill-socket';

@Global()
@Module({
    providers: [
        ModuleSocket,
        CapabilitySocket,
        SkillSocket
    ],
    exports: [
        ModuleSocket,
        CapabilitySocket,
        SkillSocket
    ]
})
export class SocketModule {}
