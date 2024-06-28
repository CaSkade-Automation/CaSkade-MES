import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CapabilityModule } from '../../capabilities/capability.module';
import { LlmGenerationController } from './llm-generation.controller';
import { LlmGenerationService } from './llm-generation.service';

@Module({
    imports: [
    HttpModule,
    CapabilityModule,
    ],
    controllers: [LlmGenerationController],
    providers: [LlmGenerationService]
    })
export class LlmGenerationModule { }
