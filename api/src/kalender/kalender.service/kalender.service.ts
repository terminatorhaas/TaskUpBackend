import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserKalenderService } from 'src/userKalender/userKalender.service/user-kalender.service';
import { In, Repository } from 'typeorm';
import { KalenderEntity } from '../kalender.models/kalender.entity';
import { Kalender } from '../kalender.models/kalender.interface';

@Injectable()
export class KalenderService {

    //creating local repository, plus loading of necessary external service modules
    constructor(
        @InjectRepository(KalenderEntity) private readonly kalenderRepository: Repository<KalenderEntity>,

        @Inject(forwardRef(() => UserKalenderService))
        readonly userKalenderService: UserKalenderService,

    ) { }

    create(calendar: Kalender): Observable<Kalender> {
        return from(this.kalenderRepository.save(calendar));
    }

    findOne(calendarID: number): Observable<Kalender> {
        return from(this.kalenderRepository.findOne({ 'kalenderID': calendarID }));
    }

    findAll(): Observable<Kalender[]> {
        return from(this.kalenderRepository.find()).pipe(
            map((calendar: Kalender[]) => {
                return calendar;
            })
        );
    }

    updateOne(calendarID: number, calendar: Kalender): Observable<any> {
        return from(this.kalenderRepository.update(calendarID, calendar));
    }


    deleteOne(calendarID: number): Observable<any> {
        this.userKalenderService.deleteAllTiesToKalender(calendarID);
        return from(this.kalenderRepository.delete(calendarID));
    }

    getKalenderToUser(username: string): Observable<Kalender[]> {
        return from(this.userKalenderService.findKalenderToUser(username)).pipe(switchMap((calendarIDs: number[]) => {  //returns IDs of calendar belonging to User
            return this.kalenderRepository.find({                                                                       //find actual calendar entities to IDs
                kalenderID: In(calendarIDs)
            });
        }));
    }

}
