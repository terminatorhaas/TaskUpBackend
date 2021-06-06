import { Test, TestingModule } from '@nestjs/testing';
import { AktivitaetenController } from './aktivitaeten.controller';

describe('AktivitaetenController', () => {
  let controller: AktivitaetenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AktivitaetenController],
    }).compile();

    controller = module.get<AktivitaetenController>(AktivitaetenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
