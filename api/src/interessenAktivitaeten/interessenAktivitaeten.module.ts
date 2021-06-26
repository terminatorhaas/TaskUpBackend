import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AktivitaetenEntity } from 'src/aktivitaeten/aktivitaeten.models/aktivitaeten.entity';
import { AktivitaetenModule } from 'src/aktivitaeten/aktivitaeten.module';
import { InteressenEntity } from 'src/interessen/interessen.models/Interessen.entity';
import { InteressenModule } from 'src/interessen/interessen.module';
import { InteressenAktivitaetenEntity } from './interessenAktivitaeten.models/interessenAktivitaeten.entity';
import { InteressenAktivitaetenService } from './interessenAktivitaeten.service/interessenAktivitaeten.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AktivitaetenEntity, InteressenEntity, InteressenAktivitaetenEntity]),
    forwardRef(() => InteressenModule),
    forwardRef(() => AktivitaetenModule),
  ],
  
  providers: [InteressenAktivitaetenService],
  exports: [InteressenAktivitaetenService]

  
})
export class InteressenAktivitaetenModule {}
