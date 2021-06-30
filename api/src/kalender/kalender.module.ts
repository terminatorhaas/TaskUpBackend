import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { UserKalenderModule } from 'src/userKalender/user-kalender.module';
import { UserKalenderEntity } from 'src/userKalender/userKalender.models/userKalender.entity';
import { KalenderController } from './kalender.controller/kalender.controller';
import { KalenderEntity } from './kalender.models/kalender.entity';
import { KalenderService } from './kalender.service/kalender.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([KalenderEntity]),
        forwardRef(() => UserKalenderModule),
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
    ],
    
    controllers: [KalenderController],
    providers: [KalenderService],
    exports: [KalenderService]
  })
export class KalenderModule {}

