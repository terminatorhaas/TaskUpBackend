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
    ) { }


    async findUsersToKalender(calendarID: number): Promise<string[]> {
        let usernames: string[] = [];

        const userCalendar = await getConnection()
            .getRepository(UserKalenderEntity)
            .createQueryBuilder("userKalender")
            .where("userKalender.kalenderID = :calendar", { calendar: calendarID })
            .getMany();

        for (var i = 0; i < userCalendar.length; i++) {
            usernames.push(String(userCalendar[i].username))
        }
        return usernames;

    }

    async findKalenderToUser(username: string): Promise<number[]> {

        let calendarIDs: number[] = [];

        const userKalender = await getConnection()
            .getRepository(UserKalenderEntity)
            .createQueryBuilder("userKalender")
            .where("userKalender.username = :username", { username: username })
            .getMany();

        for (var i = 0; i < userKalender.length; i++) {
            calendarIDs.push(Number(userKalender[i].kalenderID))
        }

        return calendarIDs;
    }

    async insertNewUserKalenderTie(calendarID: number, username: string) {
        await getConnection()
            .createQueryBuilder()
            .insert()
            .into(UserKalenderEntity)
            .values({
                kalenderID: calendarID,
                username: username
            })
            .execute();
    }

    async deleteUserKalenderTie(calendarID: number, username: string) {

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(UserKalenderEntity)
            .where({
                kalenderID: calendarID,
                username: username
            })
            .execute();
    }

    async deleteAllTiesToUser(username: string) {

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(UserKalenderEntity)
            .where({
                username: username
            })
            .execute();
    }

    async deleteAllTiesToKalender(calendarID: number) {

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(UserKalenderEntity)
            .where({
                kalenderID: calendarID
            })
            .execute();
    }






}
