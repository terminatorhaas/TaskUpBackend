import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AktivitaetenService } from 'src/aktivitaeten/aktivitaeten.service/aktivitaeten.service';
import { InteressenService } from 'src/interessen/interessen.service/interessen.service';
import { getConnection, Repository } from 'typeorm';
import { InteressenAktivitaetenEntity } from '../interessenAktivitaeten.models/interessenAktivitaeten.entity';

@Injectable()
export class InteressenAktivitaetenService {

    //loading of necessary external service modules, local repository not needed
    constructor(

        @Inject(forwardRef(() => InteressenService))
        private readonly interessenService: InteressenService,

        @Inject(forwardRef(() => AktivitaetenService))
        private readonly aktivitaetenService: AktivitaetenService,
    ) { }

    async findAktivitaetenToInteresse(interestID: number): Promise<number[]> {

        let activityIDs: number[] = []; //array to contain output IDs

        const interestActivities = await getConnection()                                        //Performing select operation on DB
            .getRepository(InteressenAktivitaetenEntity)
            .createQueryBuilder("interessenAktivitaeten")
            .where("interessenAktivitaeten.interessenID = :number", { number: interestID })
            .getMany();

        for (var i = 0; i < interestActivities.length; i++) {
            activityIDs.push(Number(interestActivities[i].aktivitaetenID))                      //just IDs are needed --> extraction of those
        }
        return activityIDs;
    }


    async findInteressenToAktivitaet(activityID: number): Promise<number[]> {

        let interestIDs: number[] = []; //array to contain output IDs

        const interestActivities = await getConnection()                                        //Performing select operation on DB
            .getRepository(InteressenAktivitaetenEntity)
            .createQueryBuilder("interessenAktivitaeten")
            .where("interessenAktivitaeten.aktivitaetenID = :activity", { activity: activityID })
            .getMany();

        for (var i = 0; i < interestActivities.length; i++) {
            interestIDs.push(Number(interestActivities[i].interessenID))                        //just IDs are needed --> extraction of those
        }

        return interestIDs;
    }

    //add new relation
    async insertNewAktivitaetenInteresseTie(interestID: number, activityID: number) {
        await getConnection()                                                                   //Performing insert operation on DB
            .createQueryBuilder()
            .insert()
            .into(InteressenAktivitaetenEntity)
            .values({
                interessenID: interestID,
                aktivitaetenID: activityID
            })
            .execute();
    }

    //Delete specific relation
    async deleteAktivitaetenInteresseTie(interestID: number, activityID: number) {

        await getConnection()                                                                   //Performing delete operation on DB
            .createQueryBuilder()
            .delete()
            .from(InteressenAktivitaetenEntity)
            .where({
                interessenID: interestID,
                aktivitaetenID: activityID
            })
            .execute();
    }

    //Used to ensure that integrity constraints of DB are met
    async deleteAllTiesToAktivitaet(activityID: number) {

        await getConnection()                                                                   //Performing delete operation on DB
            .createQueryBuilder()
            .delete()
            .from(InteressenAktivitaetenEntity)
            .where({
                aktivitaetenID: activityID
            })
            .execute();
    }

    //Used to ensure that integrity constraints of DB are met
    async deleteAllTiesToInteresse(interestID: number) {

        await getConnection()                                                                   //Performing delete operation on DB
            .createQueryBuilder()
            .delete()
            .from(InteressenAktivitaetenEntity)
            .where({
                interessenID: interestID
            })
            .execute();
    }





}
