import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { InteressenService } from 'src/interessen/interessen.service/interessen.service';
import { Connection, getConnection, Repository } from 'typeorm';
import { UserInteresseEntity } from '../userInteresse.models/userInteresse.entity';

@Injectable()
export class UserInteresseService {

    constructor(
        @InjectRepository(UserInteresseEntity) private readonly userInteresseRepository: Repository<UserInteresseEntity>,

        @Inject(forwardRef(() => InteressenService))
        private readonly interessenService: InteressenService,
    ) { }

    findUserToInteresse(interestID: number): Observable<UserInteresseEntity[]> {
        return from(this.userInteresseRepository.find({
            select: ["username"],
            where: { interessenID: interestID }
        }));
    }


    async findInteressenToUser(username: string): Promise<number[]> {


        let interestIDs: number[] = [];

        const userInterests = await getConnection()
            .getRepository(UserInteresseEntity)
            .createQueryBuilder("userInteressen")
            .where("userInteressen.username = :user", { user: username })
            .getMany();

        for (var i = 0; i < userInterests.length; i++) {
            interestIDs.push(Number(userInterests[i].interessenID))
        }

        return interestIDs;
    }

    async insertNewUserInteresseTie(interestID: number, username: string) {
        await getConnection()
            .createQueryBuilder()
            .insert()
            .into(UserInteresseEntity)
            .values({
                interessenID: interestID,
                username: username
            })
            .execute();
    }

    async deleteUserInteresseTie(interestID: number, username: string) {

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(UserInteresseEntity)
            .where({
                interessenID: interestID,
                username: username
            })
            .execute();
    }

    async deleteAllTiesToUser(username: string) {

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(UserInteresseEntity)
            .where({
                username: username
            })
            .execute();
    }

    async deleteAllTiesToInteresse(interestID: number) {

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(UserInteresseEntity)
            .where({
                interessenID: interestID
            })
            .execute();
    }

}


