import { Test, TestingModule } from '@nestjs/testing';
import { InteressenAktivitaetenService } from './interessenAktivitaeten.service';

describe('InteressenAktivitaetenService', () => {
  let service: InteressenAktivitaetenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InteressenAktivitaetenService],
    }).compile();

    service = module.get<InteressenAktivitaetenService>(InteressenAktivitaetenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
