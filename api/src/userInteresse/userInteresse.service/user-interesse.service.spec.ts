import { Test, TestingModule } from '@nestjs/testing';
import { UserInteresseService } from './user-interesse.service';

describe('UserInteresseService', () => {
  let service: UserInteresseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserInteresseService],
    }).compile();

    service = module.get<UserInteresseService>(UserInteresseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
