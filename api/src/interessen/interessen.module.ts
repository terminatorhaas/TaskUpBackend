import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { UserInteresseModule } from 'src/userInteresse/user-interesse.module';
import { UserInteresseEntity } from 'src/userInteresse/userInteresse.models/userInteresse.entity';
import { InteressenController } from './interessen.controller/interessen.controller';
import { InteressenEntity } from './interessen.models/Interessen.entity';
import { InteressenService } from './interessen.service/interessen.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([InteressenEntity]),
        forwardRef(() => UserInteresseModule),
        forwardRef(() => UserModule),
        ],
    
    controllers: [InteressenController],
    providers: [InteressenService],
    exports: [InteressenService]
  })
export class InteressenModule {}