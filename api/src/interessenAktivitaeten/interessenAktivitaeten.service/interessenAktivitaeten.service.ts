import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { AktivitaetenEntity } from 'src/aktivitaeten/aktivitaeten.models/aktivitaeten.entity';
import { AktivitaetenService } from 'src/aktivitaeten/aktivitaeten.service/aktivitaeten.service';
import { InteressenService } from 'src/interessen/interessen.service/interessen.service';
import { getConnection, Repository } from 'typeorm';
import { InteressenAktivitaetenEntity } from '../interessenAktivitaeten.models/interessenAktivitaeten.entity';

@Injectable()
export class InteressenAktivitaetenService {

    constructor(
        @InjectRepository(InteressenAktivitaetenEntity) private readonly interessenAktivitaetenRepository: Repository<InteressenAktivitaetenEntity>,

        @Inject(forwardRef(() => InteressenService))
        private readonly interessenService: InteressenService,

        @Inject(forwardRef(() => AktivitaetenService))
        private readonly aktivitaetenService: AktivitaetenService,
    ) { }

    async findAktivitaetenToInteresse(interestID: number): Promise<number[]> {

        let activityIDs: number[] = [];

        const interestActivities = await getConnection()
            .getRepository(InteressenAktivitaetenEntity)
            .createQueryBuilder("interessenAktivitaeten")
            .where("interessenAktivitaeten.interessenID = :number", { number: interestID })
            .getMany();

        for (var i = 0; i < interestActivities.length; i++) {
            activityIDs.push(Number(interestActivities[i].aktivitaetenID))
        }
        return activityIDs;
    }


    async findInteressenToAktivitaet(activityID: number): Promise<number[]> {

        let interestIDs: number[] = [];

        const interestActivities = await getConnection()
            .getRepository(InteressenAktivitaetenEntity)
            .createQueryBuilder("interessenAktivitaeten")
            .where("interessenAktivitaeten.aktivitaetenID = :activity", { activity: activityID })
            .getMany();

        for (var i = 0; i < interestActivities.length; i++) {
            interestIDs.push(Number(interestActivities[i].interessenID))
        }

        return interestIDs;
    }

    async insertNewAktivitaetenInteresseTie(interestID: number, activityID: number) {
        await getConnection()
            .createQueryBuilder()
            .insert()
            .into(InteressenAktivitaetenEntity)
            .values({
                interessenID: interestID,
                aktivitaetenID: activityID
            })
            .execute();
    }

    async deleteAktivitaetenInteresseTie(interestID: number, activityID: number) {

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(InteressenAktivitaetenEntity)
            .where({
                interessenID: interestID,
                aktivitaetenID: activityID
            })
            .execute();
    }

    async deleteAllTiesToAktivitaet(activityID: number) {

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(InteressenAktivitaetenEntity)
            .where({
                aktivitaetenID: activityID
            })
            .execute();
    }

    async deleteAllTiesToInteresse(interestID: number) {

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(InteressenAktivitaetenEntity)
            .where({
                interessenID: interestID
            })
            .execute();
    }





}
