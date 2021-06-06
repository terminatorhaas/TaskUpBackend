import { Test, TestingModule } from '@nestjs/testing';
import { EreignisService } from './ereignis.service';

describe('EreignisService', () => {
  let service: EreignisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EreignisService],
    }).compile();

    service = module.get<EreignisService>(EreignisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
