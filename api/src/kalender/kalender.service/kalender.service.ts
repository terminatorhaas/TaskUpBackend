import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from 'src/user/user.models/user.interface';
import { UserKalenderService } from 'src/userKalender/userKalender.service/user-kalender.service';
import { In, Repository } from 'typeorm';
import { KalenderEntity } from '../kalender.models/kalender.entity';
import { Kalender } from '../kalender.models/kalender.interface';

@Injectable()
export class KalenderService {

    constructor(
        @InjectRepository(KalenderEntity) private readonly kalenderRepository: Repository<KalenderEntity>,

        @Inject(forwardRef(() => UserKalenderService))
        readonly userKalenderService: UserKalenderService,

    ) {}

    create(kalender: Kalender): Observable<Kalender> {
        console.log('kalenderBezeichnung  = ' + kalender.bezeichnung);
        return from(this.kalenderRepository.save(kalender));
}


findOne(kalenderID: number): Observable<Kalender> {
console.log("Suche nach Kalender " + kalenderID);
return from(this.kalenderRepository.findOne({ kalenderID }));
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


deleteOne(kalenderId: number): Observable<any> {
console.log("Kalender: " + kalenderId + " gelöscht.");
this.userKalenderService.deleteAlleKalenderTies(kalenderId);
return from(this.kalenderRepository.delete(kalenderId));
}

getKalenderZuUser(username: string): Observable<Kalender[]> {
    
    const kalenderIds: number[] = [];

    return from(this.userKalenderService.findeKalenderZuUser(username)).pipe(switchMap((kalenderIds: number[]) => {
        
        for (var i = 0; i < kalenderIds.length; i++) {
            console.log("interessenService: " + kalenderIds[i]);
        };
        return this.kalenderRepository.find({
            kalenderID: In(kalenderIds)
        });
    }));
}

}
