import { Test, TestingModule } from '@nestjs/testing';
import { ConstraintController } from './constraint.controller';

describe('ConstraintController', () => {
    let controller: ConstraintController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ConstraintController],
        }).compile();

        controller = module.get<ConstraintController>(ConstraintController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
