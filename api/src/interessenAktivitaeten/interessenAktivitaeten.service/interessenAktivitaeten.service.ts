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
    ) {}

    async findAktivitaetenZuInteresse(interessenId1: number): Promise<number[]> {
        
        let aktivitaetenIds: number[] = [];

        console.log("Finde Interessen zu Aktivitaet " + interessenId1)
        const interessenAktivitaeten = await getConnection()
        .getRepository(InteressenAktivitaetenEntity)
        .createQueryBuilder("interessenAktivitaeten")
        .where("interessenAktivitaeten.interessenID = :number", {number: interessenId1})
        .getMany();

        for(var i = 0; i < interessenAktivitaeten.length; i++) {
            aktivitaetenIds.push(Number (interessenAktivitaeten[i].aktivitaetenID))
        }

        return aktivitaetenIds;
            }


    async findeInteressenZuAktivitaet(aktivitaetenId1: number): Promise<number[]> {
        let interessenIds: number[] = [];

        console.log("Finde Interessen zu Aktivitaet " + aktivitaetenId1)
        const interessenAktivitaeten = await getConnection()
        .getRepository(InteressenAktivitaetenEntity)
        .createQueryBuilder("interessenAktivitaeten")
        .where("interessenAktivitaeten.aktivitaetenID = :aktivitaet", {aktivitaet: aktivitaetenId1})
        .getMany();

        for(var i = 0; i < interessenAktivitaeten.length; i++) {
            interessenIds.push(Number (interessenAktivitaeten[i].interessenID))
        }

        return interessenIds;
            }
        
    async insertNewAktivitaetenInteresseTie(interessenId: number, aktivitaetenId: number) {
        await getConnection()
        .createQueryBuilder()
        .insert()
        .into(InteressenAktivitaetenEntity)
        .values({ 
        interessenID: interessenId, 
        aktivitaetenID: aktivitaetenId
    })
        .execute();
    }

    async deleteAktivitaetenInteresseTie(interessenId: number, aktivitaetenId: number) {

        await getConnection()
        .createQueryBuilder()
        .delete()
        .from(InteressenAktivitaetenEntity)
        .where({ 
        interessenID: interessenId, 
        aktivitaetenID: aktivitaetenId
    })
        .execute();
    }

    async deleteAlleAktivitaetenTies(aktivitaetenId: number) {

        await getConnection()
        .createQueryBuilder()
        .delete()
        .from(InteressenAktivitaetenEntity)
        .where({ 
        aktivitaetenID: aktivitaetenId
    })
        .execute();
    }

    async deleteAlleInteressenTies(interessenId: number) {

        await getConnection()
        .createQueryBuilder()
        .delete()
        .from(InteressenAktivitaetenEntity)
        .where({ 
        interessenID: interessenId
    })
        .execute();
    }


    


}
