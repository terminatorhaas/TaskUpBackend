import { Test, TestingModule } from '@nestjs/testing';
import { AktivitaetenService } from './aktivitaeten.service';

describe('AktivitaetenService', () => {
  let service: AktivitaetenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AktivitaetenService],
    }).compile();

    service = module.get<AktivitaetenService>(AktivitaetenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
