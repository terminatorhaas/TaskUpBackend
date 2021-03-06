import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteressenEntity } from 'src/interessen/interessen.models/Interessen.entity';
import { InteressenModule } from 'src/interessen/interessen.module';
import { UserEntity } from 'src/user/user.models/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserInteresseEntity } from './userInteresse.models/userInteresse.entity';
import { UserInteresseService } from './userInteresse.service/user-interesse.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, InteressenEntity, UserInteresseEntity]),
    forwardRef(() => InteressenModule),
    forwardRef(() => UserModule),
  ],


  controllers: [],

  providers: [UserInteresseService],
  exports: [UserInteresseService]
})

export class UserInteresseModule {}
