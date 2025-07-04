import { Test, TestingModule } from '@nestjs/testing';
import { LlmGenerationController } from './llm-generation.controller';

describe('LlmGenerationController', () => {
    let controller: LlmGenerationController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LlmGenerationController],
        }).compile();

        controller = module.get<LlmGenerationController>(LlmGenerationController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
