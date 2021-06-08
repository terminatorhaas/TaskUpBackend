import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { KalenderEntity } from '../kalender.models/kalender.entity';
import { Kalender } from '../kalender.models/kalender.interface';

@Injectable()
export class KalenderService {

    constructor(
        @InjectRepository(KalenderEntity) private readonly kalenderRepository: Repository<KalenderEntity>,
    ) {}

    create(kalender: Kalender): Observable<Kalender> {
        console.log('kalenderBezeichnung  = ' + kalender.bezeichnung);
        return from(this.kalenderRepository.save(kalender));
}


findOne(kalenderId: number): Observable<Kalender> {
console.log("Suche nach Kalender " + kalenderId);
return from(this.kalenderRepository.findOne({ kalenderId }));
}

findAll(): Observable<Kalender[]> {
return from(this.kalenderRepository.find()).pipe(
    map((kalender: Kalender[]) => {
        console.log("Alle Kalender gefunden");
        return kalender;
    })
);
}

updateOne(kalenderId: number, kalender: Kalender): Observable<any> {
console.log("Kalender: " + kalenderId + " geändert.");
return from(this.kalenderRepository.update(kalenderId, kalender));
}
s

deleteOne(kalenderId: number): Observable<any> {
console.log("Kalender: " + kalenderId + " gelöscht.");
return from(this.kalenderRepository.delete(kalenderId));
}

}
