import { Test, TestingModule } from '@nestjs/testing';
import { InteressenController } from './interessen.controller';

describe('InteressenController', () => {
  let controller: InteressenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InteressenController],
    }).compile();

    controller = module.get<InteressenController>(InteressenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
