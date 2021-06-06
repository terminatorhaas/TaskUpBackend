import { Test, TestingModule } from '@nestjs/testing';
import { KalenderService } from './kalender.service';

describe('KalenderService', () => {
  let service: KalenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KalenderService],
    }).compile();

    service = module.get<KalenderService>(KalenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
