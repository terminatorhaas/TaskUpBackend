import { Module } from '@nestjs/common';
import { UserService } from './user.service/user.service';
import { UserController } from './user.controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.models/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { InteressenModule } from 'src/interessen/interessen.module';
import { InteressenEntity } from 'src/interessen/interessen.models/Interessen.entity';


@Module({
  imports: [
    InteressenModule,
    TypeOrmModule.forFeature([UserEntity, InteressenEntity]),
    AuthModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
