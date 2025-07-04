import { Test, TestingModule } from '@nestjs/testing';
import { ConstraintService } from './constraint.service';

describe('ConstraintService', () => {
    let service: ConstraintService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConstraintService],
        }).compile();

        service = module.get<ConstraintService>(ConstraintService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
