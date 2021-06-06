import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteressenController } from './interessen.controller/interessen.controller';
import { InteressenEntity } from './interessen.models/Interessen.entity';
import { InteressenService } from './interessen.service/interessen.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([InteressenEntity])
      
    ],
    
    controllers: [InteressenController],
    providers: [InteressenService],
    exports: [InteressenService]
  })
export class InteressenModule {}