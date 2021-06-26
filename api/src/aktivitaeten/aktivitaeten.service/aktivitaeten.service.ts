import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Interessen } from 'src/interessen/interessen.models/interessen.interface';
import { InteressenService } from 'src/interessen/interessen.service/interessen.service';
import { InteressenAktivitaetenService } from 'src/interessenAktivitaeten/interessenAktivitaeten.service/interessenAktivitaeten.service';
import { In, Repository } from 'typeorm';
import { AktivitaetenEntity } from '../aktivitaeten.models/aktivitaeten.entity';
import { Aktivitaeten } from '../aktivitaeten.models/aktivitaeten.interface';

@Injectable()
export class AktivitaetenService {

    constructor(
        @InjectRepository(AktivitaetenEntity) private readonly aktivitaetenRepository: Repository<AktivitaetenEntity>,

        @Inject(forwardRef(() => InteressenService))
        private readonly interessenService: InteressenService,

        @Inject(forwardRef(() => InteressenAktivitaetenService))
        private readonly interessenAktivitaetenService: InteressenAktivitaetenService,

    ) {}

    create(aktivitaet: Aktivitaeten): Observable<Aktivitaeten> {
        console.log('aktivitaetsBezeichnung  = ' + aktivitaet.aktivitaetsBezeichnung) ;        
        return from(this.aktivitaetenRepository.save(aktivitaet));
}


findOne(aktivitaetenID: number): Observable<Aktivitaeten> {
console.log("Suche nach Aktivität " + aktivitaetenID);
return from(this.aktivitaetenRepository.findOne(aktivitaetenID));
}

findAll(): Observable<Aktivitaeten[]> {
return from(this.aktivitaetenRepository.find()).pipe(
    map((aktivitaeten: Aktivitaeten[]) => {
        console.log("Alle Aktivitäten gefunden");
        return aktivitaeten;
    })
);
}

updateOne(aktivitaetenID: number, aktivitaet: Aktivitaeten): Observable<any> {
console.log("Interesse: " + aktivitaetenID + " geändert.");
return from(this.aktivitaetenRepository.update(aktivitaetenID, aktivitaet));
}


deleteOne(aktivitaetenID: number): Observable<any> {
console.log("Interessen: " + aktivitaetenID + " gelöscht.");
    this.interessenAktivitaetenService.deleteAlleAktivitaetenTies(aktivitaetenID);
    return from(this.aktivitaetenRepository.delete(aktivitaetenID));
}

public findeInteressenZuAktivitaet(aktivitaetenId: number): Observable<Interessen[]> {
    const interessenIds: number[] = [];
    return from(this.interessenService.findeInteressenZuAktivitaet(aktivitaetenId));
}

public findeAktivitaetZuInteresse(interessenId: number): Observable<Aktivitaeten[]> {


    return from(this.interessenAktivitaetenService.findAktivitaetenZuInteresse(interessenId)).pipe(switchMap((aktivitaetenIds: number[]) => {
        for (var i = 0; i < aktivitaetenIds.length; i++) {
            console.log("aktivitaetenService: " + aktivitaetenIds[i]);
        };
        return this.aktivitaetenRepository.find({
            aktivitaetenID: In(aktivitaetenIds)
        });
    }));
}





}
