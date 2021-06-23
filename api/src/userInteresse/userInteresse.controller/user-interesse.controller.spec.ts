import { Test, TestingModule } from '@nestjs/testing';
import { UserInteresseController } from './user-interesse.controller';

describe('UserInteresseController', () => {
  let controller: UserInteresseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserInteresseController],
    }).compile();

    controller = module.get<UserInteresseController>(UserInteresseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
