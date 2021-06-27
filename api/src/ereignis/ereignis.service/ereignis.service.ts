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
    ) {}


    create(ereignis: EreignisEntity): Observable<any> {
        return from(this.ereignisRepository.save(ereignis));
    }

    findOne(ereignisId: number, kalenderId: number): Observable<Ereignis> {
        return from(this.ereignisRepository.findOne({"ereignisId": ereignisId,"kalenderId": kalenderId}));
    }

    updateOne(ereignisId: number, kalenderId: number, ereignis: Ereignis): Observable<any> {
        console.log("Ereignis: " + ereignisId + " geändert.");
            return from(this.ereignisRepository.update({"ereignisId": ereignisId,"kalenderId": kalenderId}, ereignis));
    }

    deleteOne(ereignisId: number, kalenderId: number): Observable<any> {
        return from(this.ereignisRepository.delete({"ereignisId": ereignisId,"kalenderId": kalenderId}));
    }


    findEreignisseZuKalender(kalenderId: number): Observable<Ereignis[]> {

        return from(this.selectEreignisseZuKalender(kalenderId)).pipe(switchMap((ereignisIds: number[]) => {
            
            for (var i = 0; i < ereignisIds.length; i++) {
                console.log("Ereignis: " + ereignisIds[i]);
            };
            return this.ereignisRepository.find({
                ereignisId: In(ereignisIds)
            });
        }));
    }


    async selectEreignisseZuKalender(kalenderId: number): Promise<number[]> {
        let ereignisse: number[] = [];
        
        console.log("Finde Ereignisse zu Kalender " + kalenderId);

        const ereignisseZuKalender = await getConnection()
        .getRepository(EreignisEntity)
        .createQueryBuilder("ereignisse")
        .where("ereignisse.kalenderId = :kalender", {kalender: kalenderId})
        .getMany();

        for(var i = 0; i < ereignisseZuKalender.length; i++) {
            ereignisse.push(Number(ereignisseZuKalender[i].ereignisId))
        }

        return ereignisse;
    }

    async deleteAlleKalenderTies(kalenderID: number) {

        await getConnection()
        .createQueryBuilder()
        .delete()
        .from(EreignisEntity)
        .where({ 
        kalenderId: kalenderID
    })
        .execute();
    }

}
