import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service/user.service';
import { UserController } from './user.controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.models/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { InteressenModule } from 'src/interessen/interessen.module';
import { InteressenEntity } from 'src/interessen/interessen.models/Interessen.entity';
import { UserInteresseModule } from 'src/userInteresse/user-interesse.module';
import { UserKalenderModule } from 'src/userKalender/user-kalender.module';
import { KalenderModule } from 'src/kalender/kalender.module';
import { KalenderEntity } from 'src/kalender/kalender.models/kalender.entity';
import { UserInteresseEntity } from 'src/userInteresse/userInteresse.models/userInteresse.entity';
import { UserKalenderEntity } from 'src/userKalender/userKalender.models/userKalender.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, InteressenEntity, KalenderEntity]),
    AuthModule,
    forwardRef(() => InteressenModule),
    forwardRef(() => KalenderModule),
    forwardRef(() => UserInteresseModule),
    forwardRef(() => UserKalenderModule),
    
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
