import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { InteressenService } from 'src/interessen/interessen.service/interessen.service';
import { Connection, getConnection, Repository } from 'typeorm';
import { UserInteresseEntity } from '../userInteresse.models/userInteresse.entity';

@Injectable()
export class UserInteresseService {

    //creating local repository, plus loading of necessary external service modules
    constructor(
        @InjectRepository(UserInteresseEntity) private readonly userInteresseRepository: Repository<UserInteresseEntity>,

        @Inject(forwardRef(() => InteressenService))
        private readonly interessenService: InteressenService,
    ) { }

    findUserToInteresse(interestID: number): Observable<UserInteresseEntity[]> {
        return from(this.userInteresseRepository.find({                             //Performing select operation on DB
            select: ["username"],
            where: { interessenID: interestID }
        }));
    }


    async findInteressenToUser(username: string): Promise<number[]> {
        let interestIDs: number[] = [];

        const userInterests = await getConnection()                                 //Performing select operation on DB
            .getRepository(UserInteresseEntity)
            .createQueryBuilder("userInteressen")
            .where("userInteressen.username = :user", { user: username })
            .getMany();

        for (var i = 0; i < userInterests.length; i++) {
            interestIDs.push(Number(userInterests[i].interessenID))                 //just IDs are needed --> extraction of those
        }

        return interestIDs;
    }

    //add new relation
    async insertNewUserInteresseTie(interestID: number, username: string) {
        await getConnection()                                                       //Performing insert operation on DB
            .createQueryBuilder()
            .insert()
            .into(UserInteresseEntity)
            .values({
                interessenID: interestID,
                username: username
            })
            .execute();
    }

    //Delete specific relation
    async deleteUserInteresseTie(interestID: number, username: string) {

        await getConnection()                                                       //Performing delete operation on DB
            .createQueryBuilder()
            .delete()
            .from(UserInteresseEntity)
            .where({
                interessenID: interestID,
                username: username
            })
            .execute();
    }

    //Used to ensure that integrity constraints of DB are met
    async deleteAllTiesToUser(username: string) {

        await getConnection()                                                       //Performing delete operation on DB
            .createQueryBuilder()
            .delete()
            .from(UserInteresseEntity)
            .where({
                username: username
            })
            .execute();
    }

    //Used to ensure that integrity constraints of DB are met
    async deleteAllTiesToInteresse(interestID: number) {

        await getConnection()                                                       //Performing delete operation on DB
            .createQueryBuilder()
            .delete()
            .from(UserInteresseEntity)
            .where({
                interessenID: interestID
            })
            .execute();
    }

}


