import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceModuleService } from './user-kalender.service';

describe('UserServiceModuleService', () => {
  let service: UserServiceModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserServiceModuleService],
    }).compile();

    service = module.get<UserServiceModuleService>(UserServiceModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
