import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EreignisController } from './ereignis.controller/ereignis.controller';
import { EreignisService } from './ereignis.service/ereignis.service';
import { EreignisEntity } from './ereignis.models/ereignis.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([EreignisEntity])
      
    ],
    
    controllers: [EreignisController],
    providers: [EreignisService],
    exports: [EreignisService]
  })
export class EreignisModule {}