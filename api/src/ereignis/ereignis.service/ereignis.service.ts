import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { getConnection, In, Repository } from 'typeorm';
import { EreignisEntity } from '../ereignis.models/ereignis.entity';
import { Ereignis } from '../ereignis.models/ereignis.interface';

@Injectable()
export class EreignisService {

    constructor(
        @InjectRepository(EreignisEntity) private readonly ereignisRepository: Repository<EreignisEntity>,
    ) { }


    create(event: EreignisEntity): Observable<any> {
        return from(this.ereignisRepository.save(event));
    }

    findOne(eventID: number, calendarID: number): Observable<Ereignis> {
        return from(this.ereignisRepository.findOne({ "ereignisId": eventID, "kalenderId": calendarID }));
    }

    updateOne(eventID: number, calendarID: number, event: Ereignis): Observable<any> {
        return from(this.ereignisRepository.update({ "ereignisId": eventID, "kalenderId": calendarID }, event));
    }

    deleteOne(eventID: number, calendarID: number): Observable<any> {
        return from(this.ereignisRepository.delete({ "ereignisId": eventID, "kalenderId": calendarID }));
    }


    findEreignisseToKalender(calendarID: number): Observable<Ereignis[]> {
        return from(this.selectEreignisseToKalender(calendarID)).pipe(switchMap((eventIDs: number[]) => {
            return this.ereignisRepository.find({
                ereignisId: In(eventIDs)
            });
        }));
    }


    async selectEreignisseToKalender(calendarID: number): Promise<number[]> {
        let events: number[] = [];

        const eventsToCalendar = await getConnection()
            .getRepository(EreignisEntity)
            .createQueryBuilder("ereignisse")
            .where("ereignisse.kalenderId = :calendar", { calendar: calendarID })
            .getMany();

        for (var i = 0; i < eventsToCalendar.length; i++) {
            events.push(Number(eventsToCalendar[i].ereignisId))
        }

        return events;
    }

    async deleteAllTiesToKalender(calendarID: number) {

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(EreignisEntity)
            .where({
                kalenderId: calendarID
            })
            .execute();
    }

}
