import { Test, TestingModule } from '@nestjs/testing';
import { EreignisController } from './ereignis.controller';

describe('EreignisController', () => {
  let controller: EreignisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EreignisController],
    }).compile();

    controller = module.get<EreignisController>(EreignisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
