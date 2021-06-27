import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteressenModule } from 'src/interessen/interessen.module';
import { InteressenAktivitaetenModule } from 'src/interessenAktivitaeten/interessenAktivitaeten.module';
import { AktivitaetenController } from './aktivitaeten.controller/aktivitaeten.controller';
import { AktivitaetenEntity } from './aktivitaeten.models/aktivitaeten.entity';
import { AktivitaetenService } from './aktivitaeten.service/aktivitaeten.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AktivitaetenEntity]),
    forwardRef(() => InteressenAktivitaetenModule),
    forwardRef(() => InteressenModule),

  ],


  controllers: [AktivitaetenController],
  providers: [AktivitaetenService],
  exports:[AktivitaetenService]
})
export class AktivitaetenModule {}
