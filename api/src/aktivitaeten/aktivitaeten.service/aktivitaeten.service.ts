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
    ) { }

    create(aktivitaet: Aktivitaeten): Observable<Aktivitaeten> {
        console.log('aktivitaetsBezeichnung  = ' + aktivitaet.aktivitaetsBezeichnung);
        return from(this.aktivitaetenRepository.save(aktivitaet));
    }


    findOne(aktivitaetenID: number): Observable<Aktivitaeten> {
        console.log("Suche nach Aktivität " + aktivitaetenID);
        return from(this.aktivitaetenRepository.findOne(aktivitaetenID));
    }

    findAll(): Observable<Aktivitaeten[]> {
        return from(this.aktivitaetenRepository.find()).pipe(
            map((interessen: Aktivitaeten[]) => {
                console.log("Alle Aktivitäten gefunden");
                return interessen;
            })
        );
    }

    updateOne(aktivitaetenID: number, aktivitaet: Aktivitaeten): Observable<any> {
        console.log("Interesse: " + aktivitaetenID + " geändert.");
        return this.findOne(aktivitaetenID).pipe(
            switchMap((oldAktivitaet: Aktivitaeten) => { return this.aktivitaetenRepository.update(oldAktivitaet.aktivitaetenId, aktivitaet) }))
    }


    deleteOne(aktivitaetenID: number): Observable<any> {
        console.log("Interessen: " + aktivitaetenID + " gelöscht.");
        return this.findOne(aktivitaetenID).pipe(
            switchMap((oldAktivitaet: Aktivitaeten) => { return this.aktivitaetenRepository.delete(oldAktivitaet.aktivitaetenId) }))
    }






}
