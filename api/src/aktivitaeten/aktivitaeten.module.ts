import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AktivitaetenController } from './aktivitaeten.controller/aktivitaeten.controller';
import { AktivitaetenEntity } from './aktivitaeten.models/aktivitaeten.entity';
import { AktivitaetenService } from './aktivitaeten.service/aktivitaeten.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AktivitaetenEntity])
  ],


  controllers: [AktivitaetenController],
  providers: [AktivitaetenService],
  exports:[AktivitaetenService]
})
export class AktivitaetenModule {}
