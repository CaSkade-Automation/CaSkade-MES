import { Test, TestingModule } from '@nestjs/testing';
import { PlcMappingController } from './plc-mapping.controller';

describe('PlcMappingController', () => {
    let controller: PlcMappingController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PlcMappingController],
        }).compile();

        controller = module.get<PlcMappingController>(PlcMappingController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
