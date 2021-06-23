import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Interessen } from 'src/interessen/interessen.models/interessen.interface';
import { User } from 'src/user/user.models/user.interface';
import { Connection, getConnection, Repository } from 'typeorm';
import { UserInteresse } from '../userInteresse.models/userInteresse';
import { UserInteresseEntity } from '../userInteresse.models/userInteresse.entity';

@Injectable()
export class UserInteresseService {

    constructor(
        @InjectRepository(UserInteresseEntity) private readonly userInteresseRepository: Repository<UserInteresseEntity>,
    ) {}

    findUserZuInteresse(interesse1: Interessen): Observable<UserInteresse[]> {
        return from(this.userInteresseRepository.find({
            select: ["username"],
        where: {interessenID: interesse1}}));
            }


    async findeInteressenZuUser(user1: User): Promise<number[]> {
        
        
        let interessenIds: number[] = [];
        
        console.log("Finde Interessen zu User " + user1.username)
        
        const userInteressen = await getConnection()
        .getRepository(UserInteresseEntity)
        .createQueryBuilder("userInteressen")
        .where("userInteressen.username = :user1", {user1: user1.username})
        .getMany();

        console.log(Number (userInteressen[0].interessenID))
        for(var i = 0; i < userInteressen.length; i++) {
            interessenIds.push(Number (userInteressen[i].interessenID))
        }

        return interessenIds;
        /*
        from(this.userInteresseRepository.find({
            select: ["interesse"],
            where: {user: user1.username}})).pipe(
            map((mappedUserInteressen: UserInteresse[]) => {
                for(var i = 0; i < mappedUserInteressen.length; i++) {
                    interessenIds.push(mappedUserInteressen[i].interesse.interessenId)
            }}));
                return interessenIds;
            */
                /*
        return from(this.userInteresseRepository.find({
            select: ["interesse"],
        where: {user: user1}}));
        */
            }
        }


