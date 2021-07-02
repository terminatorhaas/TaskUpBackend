import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KalenderService } from 'src/kalender/kalender.service/kalender.service';
import { UserInteresseEntity } from 'src/userInteresse/userInteresse.models/userInteresse.entity';
import { getConnection, Repository } from 'typeorm';
import { UserKalenderEntity } from '../userKalender.models/userKalender.entity';

@Injectable()
export class UserKalenderService {

    //creating local repository, plus loading of necessary external service modules
    constructor(
        @InjectRepository(UserKalenderEntity) private readonly userKalenderRepository: Repository<UserKalenderEntity>,

        @Inject(forwardRef(() => KalenderService))
        private kalenderService: KalenderService,
    ) { }


    async findUsersToKalender(calendarID: number): Promise<string[]> {
        let usernames: string[] = [];

        const userCalendar = await getConnection()                                      //Performing select operation on DB
            .getRepository(UserKalenderEntity)
            .createQueryBuilder("userKalender")
            .where("userKalender.kalenderID = :calendar", { calendar: calendarID })
            .getMany();

        for (var i = 0; i < userCalendar.length; i++) {
            usernames.push(String(userCalendar[i].username))                            //just usernames are needed --> extraction of those
        }
        return usernames;

    }

    async findKalenderToUser(username: string): Promise<number[]> {

        let calendarIDs: number[] = [];

        const userKalender = await getConnection()                                      //Performing select operation on DB
            .getRepository(UserKalenderEntity)
            .createQueryBuilder("userKalender")
            .where("userKalender.username = :username", { username: username })
            .getMany();

        for (var i = 0; i < userKalender.length; i++) {
            calendarIDs.push(Number(userKalender[i].kalenderID))                        //just IDs are needed --> extraction of those
        }

        return calendarIDs;
    }

    //add new relation
    async insertNewUserKalenderTie(calendarID: number, username: string) {
        await getConnection()                                                           //Performing insert operation on DB
            .createQueryBuilder()
            .insert()
            .into(UserKalenderEntity)
            .values({
                kalenderID: calendarID,
                username: username
            })
            .execute();
    }

    //Delete specific relation
    async deleteUserKalenderTie(calendarID: number, username: string) {

        await getConnection()                                                           //Performing delete operation on DB
            .createQueryBuilder()
            .delete()
            .from(UserKalenderEntity)
            .where({
                kalenderID: calendarID,
                username: username
            })
            .execute();
    }

    //Used to ensure that integrity constraints of DB are met
    async deleteAllTiesToUser(username: string) {

        await getConnection()                                                           //Performing delete operation on DB
            .createQueryBuilder()
            .delete()
            .from(UserKalenderEntity)
            .where({
                username: username
            })
            .execute();
    }

    //Used to ensure that integrity constraints of DB are met
    async deleteAllTiesToKalender(calendarID: number) {

        await getConnection()                                                           //Performing delete operation on DB
            .createQueryBuilder()
            .delete()
            .from(UserKalenderEntity)
            .where({
                kalenderID: calendarID
            })
            .execute();
    }






}
