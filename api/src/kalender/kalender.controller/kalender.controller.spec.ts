import { Test, TestingModule } from '@nestjs/testing';
import { KalenderController } from './kalender.controller';

describe('KalenderController', () => {
  let controller: KalenderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KalenderController],
    }).compile();

    controller = module.get<KalenderController>(KalenderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
