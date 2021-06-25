import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KalenderService } from 'src/kalender/kalender.service/kalender.service';
import { UserInteresseEntity } from 'src/userInteresse/userInteresse.models/userInteresse.entity';
import { getConnection, Repository } from 'typeorm';
import { UserKalenderEntity } from '../userKalender.models/userKalender.entity';

@Injectable()
export class UserKalenderService {

    constructor(
        @InjectRepository(UserKalenderEntity) private readonly userKalenderRepository: Repository<UserKalenderEntity>,

        @Inject(forwardRef(() => KalenderService))
        private kalenderService: KalenderService,
    ) {}


    async findeUserZuKalender(kalenderId: number): Promise<string[]> {
        let usernamen: string[] = [];
        
        console.log("Finde User zu Kalender " + kalenderId)
        
        const userKalender = await getConnection()
        .getRepository(UserKalenderEntity)
        .createQueryBuilder("userKalender")
        .where("userKalender.kalenderID = :kalender", {kalender: kalenderId})
        .getMany();

        for(var i = 0; i < userKalender.length; i++) {
            usernamen.push(String(userKalender[i].username))
        }
        return usernamen;
            
    }

    async findeKalenderZuUser(username: string): Promise<number[]> {
        
        let kalenderIds: number[] = [];
        
        console.log("Finde Interessen zu User " + username)
        
        const userKalender = await getConnection()
        .getRepository(UserKalenderEntity)
        .createQueryBuilder("userKalender")
        .where("userKalender.username = :user1", {user1: username})
        .getMany();

        for(var i = 0; i < userKalender.length; i++) {
            kalenderIds.push(Number (userKalender[i].kalenderID))
        }

        return kalenderIds;
            }
        
    async insertNewUserKalenderTie(kalenderId: number, username1: string) {
        await getConnection()
        .createQueryBuilder()
        .insert()
        .into(UserKalenderEntity)
        .values({ 
        kalenderID: kalenderId, 
        username: username1
    })
        .execute();
    }

    async deleteUserKalenderTie(kalenderId: number, username1: string) {

        await getConnection()
        .createQueryBuilder()
        .delete()
        .from(UserKalenderEntity)
        .where({ 
            kalenderID: kalenderId, 
        username: username1
    })
        .execute();
    }

    async deleteAlleUserTies(username1: string) {

        await getConnection()
        .createQueryBuilder()
        .delete()
        .from(UserKalenderEntity)
        .where({ 
        username: username1
    })
        .execute();
    }

    async deleteAlleKalenderTies(kalenderId: number) {

        await getConnection()
        .createQueryBuilder()
        .delete()
        .from(UserKalenderEntity)
        .where({ 
        kalenderID: kalenderId
    })
        .execute();
    }

   




}
