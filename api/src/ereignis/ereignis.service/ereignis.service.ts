import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { getConnection, In, Repository } from 'typeorm';
import { EreignisEntity } from '../ereignis.models/ereignis.entity';
import { Ereignis } from '../ereignis.models/ereignis.interface';

@Injectable()
export class EreignisService {

    //creating local repository
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
        return from(this.selectEreignisseToKalender(calendarID)).pipe(switchMap((eventIDs: number[]) => {   //returns eventIDs
            return this.ereignisRepository.find({                                                           //find actual activity entities to IDs
                ereignisId: In(eventIDs)
            });
        }));
    }


    async selectEreignisseToKalender(calendarID: number): Promise<number[]> {
        let eventIDs: number[] = []; //array to contain output IDs

        const eventsToCalendar = await getConnection()                                                      //Performing select operation on DB
            .getRepository(EreignisEntity)
            .createQueryBuilder("ereignisse")
            .where("ereignisse.kalenderId = :calendar", { calendar: calendarID })
            .getMany();

        for (var i = 0; i < eventsToCalendar.length; i++) {
            eventIDs.push(Number(eventsToCalendar[i].ereignisId))                                           //just IDs are needed --> extraction of those
        }

        return eventIDs;
    }

    async deleteAllTiesToKalender(calendarID: number) {

        await getConnection()                                                                               //Performing Delete operation on DB
            .createQueryBuilder()
            .delete()
            .from(EreignisEntity)
            .where({
                kalenderId: calendarID
            })
            .execute();
    }

}
