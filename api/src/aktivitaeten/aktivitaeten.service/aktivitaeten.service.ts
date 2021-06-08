import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { AktivitaetenEntity } from '../aktivitaeten.models/aktivitaeten.entity';
import { Aktivitaeten } from '../aktivitaeten.models/aktivitaeten.interface';

@Injectable()
export class AktivitaetenService {

    constructor(
        @InjectRepository(AktivitaetenEntity) private readonly aktivitaetenRepository: Repository<AktivitaetenEntity>,
    ) {}

    create(aktivitaet: Aktivitaeten): Observable<Aktivitaeten> {
        console.log('aktivitaetsBezeichnung  = ' + aktivitaet.aktivitaetsBezeichnung) ;        
        return from(this.aktivitaetenRepository.save(aktivitaet));
}


findOne(aktivitaetsBezeichnung: string): Observable<Aktivitaeten> {
console.log("Suche nach Aktivität " + aktivitaetsBezeichnung);
return from(this.aktivitaetenRepository.findOne({aktivitaetsBezeichnung}));
}

findAll(): Observable<Aktivitaeten[]> {
return from(this.aktivitaetenRepository.find()).pipe(
    map((interessen: Aktivitaeten[]) => {
        console.log("Alle Aktivitäten gefunden");
        return interessen;
    })
);
}

updateOne(aktivitaetsBezeichnung: string, aktivitaet: Aktivitaeten): Observable<any> {
console.log("Interesse: " + aktivitaetsBezeichnung + " geändert.");
return this.findOne(aktivitaetsBezeichnung).pipe(
    switchMap((oldAktivitaet: Aktivitaeten) => {return this.aktivitaetenRepository.update(oldAktivitaet.aktivitaetenId, aktivitaet)}))
}


deleteOne(aktivitaetsBezeichnung: string): Observable<any> {
console.log("Interessen: " + aktivitaetsBezeichnung + " gelöscht.");
return this.findOne(aktivitaetsBezeichnung).pipe(
    switchMap((oldAktivitaet: Aktivitaeten) => {return this.aktivitaetenRepository.delete(oldAktivitaet.aktivitaetenId)}))
}






}
