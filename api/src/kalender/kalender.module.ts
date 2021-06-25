import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserKalenderModule } from 'src/userKalender/user-kalender.module';
import { UserKalenderEntity } from 'src/userKalender/userKalender.models/userKalender.entity';
import { KalenderController } from './kalender.controller/kalender.controller';
import { KalenderEntity } from './kalender.models/kalender.entity';
import { KalenderService } from './kalender.service/kalender.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([KalenderEntity]),
        forwardRef(() => UserKalenderModule),
    ],
    
    controllers: [KalenderController],
    providers: [KalenderService],
    exports: [KalenderService]
  })
export class KalenderModule {}

