import { Test, TestingModule } from '@nestjs/testing';
import { InteressenService } from './interessen.service';

describe('Interessen.ServiceService', () => {
  let service: InteressenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InteressenService],
    }).compile();

    service = module.get<InteressenService>(InteressenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
