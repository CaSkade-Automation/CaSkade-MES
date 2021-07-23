import { Test, TestingModule } from '@nestjs/testing';
import { PlcMappingService } from './plc-mapping.service';

describe('PlcMappingService', () => {
  let service: PlcMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlcMappingService],
    }).compile();

    service = module.get<PlcMappingService>(PlcMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
