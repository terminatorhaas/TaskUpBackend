import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KalenderController } from './kalender.controller/kalender.controller';
import { KalenderEntity } from './kalender.models/kalender.entity';
import { KalenderService } from './kalender.service/kalender.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([KalenderEntity])
    ],
    
    controllers: [KalenderController],
    providers: [KalenderService],
    exports: [KalenderService]
  })
export class KalenderModule {}

