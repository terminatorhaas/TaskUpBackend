import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteressenEntity } from 'src/interessen/interessen.models/Interessen.entity';
import { InteressenModule } from 'src/interessen/interessen.module';
import { UserEntity } from 'src/user/user.models/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserInteresseController } from './userInteresse.controller/user-interesse.controller';
import { UserInteresseEntity } from './userInteresse.models/userInteresse.entity';
import { UserInteresseService } from './userInteresse.service/user-interesse.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, InteressenEntity, UserInteresseEntity]),
  ],
  controllers: [UserInteresseController],
  providers: [UserInteresseService],
  exports: [UserInteresseService]
})

export class UserInteresseModule {}
