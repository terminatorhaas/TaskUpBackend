import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteressenModule } from 'src/interessen/interessen.module';
import { KalenderEntity } from 'src/kalender/kalender.models/kalender.entity';
import { KalenderModule } from 'src/kalender/kalender.module';
import { UserEntity } from 'src/user/user.models/user.entity';
import { UserInteresseEntity } from 'src/userInteresse/userInteresse.models/userInteresse.entity';
import { UserInteresseService } from 'src/userInteresse/userInteresse.service/user-interesse.service';
import { UserKalenderEntity } from './userKalender.models/userKalender.entity';
import { UserKalenderService } from './userKalender.service/user-kalender.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, KalenderEntity, UserKalenderEntity, UserInteresseEntity]),
        forwardRef(() => InteressenModule),
        forwardRef(() => KalenderModule),
    ],
    providers: [UserKalenderService],
    exports: [UserKalenderService]
  })


export class UserKalenderModule {}
