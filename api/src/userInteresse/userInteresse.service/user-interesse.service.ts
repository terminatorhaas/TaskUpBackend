import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Interessen } from 'src/interessen/interessen.models/interessen.interface';
import { InteressenService } from 'src/interessen/interessen.service/interessen.service';
import { User } from 'src/user/user.models/user.interface';
import { Connection, getConnection, Repository } from 'typeorm';
import { UserInteresse } from '../userInteresse.models/userInteresse';
import { UserInteresseEntity } from '../userInteresse.models/userInteresse.entity';

@Injectable()
export class UserInteresseService {

    constructor(
        @InjectRepository(UserInteresseEntity) private readonly userInteresseRepository: Repository<UserInteresseEntity>,

        @Inject(forwardRef(() => InteressenService))
        private readonly interessenService: InteressenService,
    ) { }

    findUserZuInteresse(interesse1: number): Observable<UserInteresseEntity[]> {
        return from(this.userInteresseRepository.find({
            select: ["username"],
            where: { interessenID: interesse1 }
        }));
    }


    async findeInteressenZuUser(user1: string): Promise<number[]> {


        let interessenIds: number[] = [];

        console.log("Finde Interessen zu User " + user1)

        const userInteressen = await getConnection()
            .getRepository(UserInteresseEntity)
            .createQueryBuilder("userInteressen")
            .where("userInteressen.username = :user", { user: user1 })
            .getMany();

        for (var i = 0; i < userInteressen.length; i++) {
            interessenIds.push(Number(userInteressen[i].interessenID))
        }

        return interessenIds;
    }

    async insertNewUserInteresseTie(interessenId: number, username1: string) {
        await getConnection()
            .createQueryBuilder()
            .insert()
            .into(UserInteresseEntity)
            .values({
                interessenID: interessenId,
                username: username1
            })
            .execute();
    }

    async deleteUserInteresseTie(interessenId: number, username1: string) {

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(UserInteresseEntity)
            .where({
                interessenID: interessenId,
                username: username1
            })
            .execute();
    }

    async deleteAlleUserTies(username1: string) {

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(UserInteresseEntity)
            .where({
                username: username1
            })
            .execute();
    }

    async deleteAlleInteressenTies(interessenId: number) {

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(UserInteresseEntity)
            .where({
                interessenID: interessenId
            })
            .execute();
    }

}


