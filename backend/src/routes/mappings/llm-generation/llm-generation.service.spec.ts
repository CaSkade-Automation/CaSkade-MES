import { Test, TestingModule } from '@nestjs/testing';
import { LlmGenerationService } from './llm-generation.service';

describe('LlmGenerationService', () => {
    let service: LlmGenerationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LlmGenerationService],
        }).compile();

        service = module.get<LlmGenerationService>(LlmGenerationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
