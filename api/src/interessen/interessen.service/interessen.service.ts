import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindRelationsNotFoundError, In, Like, Raw, Repository } from 'typeorm';
import { InteressenEntity } from '../interessen.models/Interessen.entity';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Interessen } from '../interessen.models/interessen.interface';
import { UserInteresseService } from 'src/userInteresse/userInteresse.service/user-interesse.service';
import { User } from 'src/user/user.models/user.interface';
import { UserInteresse } from 'src/userInteresse/userInteresse.models/userInteresse';

@Injectable()
export class InteressenService {
    constructor(
        @InjectRepository(InteressenEntity) private readonly interessenRepository: Repository<InteressenEntity>,
        readonly userInteresseService: UserInteresseService,
    ) { }

    create(interesse: Interessen): Observable<Interessen> {
        console.log('interessenBezeichnung  = ' + interesse.interessenBezeichnung);
        const neuesInteresse = new InteressenEntity();
        console.log('interessenID  = ' + interesse.interessenId);
        neuesInteresse.interessenBezeichnung = interesse.interessenBezeichnung;

        return from(this.interessenRepository.save(neuesInteresse));
    }


    findOne(interessenBezeichnung: string): Observable<Interessen> {
        console.log("Suche nach Interesse " + interessenBezeichnung);
        return from(this.interessenRepository.findOne({ interessenBezeichnung }));
    }

    findAll(): Observable<Interessen[]> {
        return from(this.interessenRepository.find()).pipe(
            map((interessen: Interessen[]) => {
                console.log("Alle Interessen gefunden");
                return interessen;
            })
        );
    }

    updateOne(interessenBezeichnung: string, interesse: Interessen): Observable<any> {
        console.log("Interesse: " + interessenBezeichnung + " geändert.");
        return this.findOne(interessenBezeichnung).pipe(
            switchMap((oldInteresse: Interessen) => { return this.interessenRepository.update(oldInteresse.interessenId, interesse) }))
    }


    deleteOne(interessenBezeichnung: string): Observable<any> {
        console.log("Interessen: " + interessenBezeichnung + " gelöscht.");
        return this.findOne(interessenBezeichnung).pipe(
            switchMap((oldInteresse: Interessen) => { return this.interessenRepository.delete(oldInteresse.interessenId) }))
    }

    public getInteresse(interessenBezeichnung: string): Observable<Interessen> {
        console.log("Suche nach Interesse " + interessenBezeichnung);
        return from(this.interessenRepository.findOne({ interessenBezeichnung }));
    }

    public getInteresseZuUser(user: User): Observable<Interessen[]> {

        const interessenIds: number[] = [];

        return from(this.userInteresseService.findeInteressenZuUser(user)).pipe(switchMap((interessenIds: number[]) => {
            for (var i = 0; i < interessenIds.length; i++) {
                console.log("interessenService: " + interessenIds[i]);
            };
            return this.interessenRepository.find({
                interessenId: In(interessenIds)
            });
        }));
    
            



        /*
        
        pipe(
            switchMap((interessenIds: number[]) => {
                for(var i = 0; i < interessenIds.length; i++) {
                    console.log(interessenIds[i]);
                };
                return from(this.interessenRepository.find({
                    interessenId: In(interessenIds)}));
            }));



        for(var i = 0; i < interessenArray.length; i++) {
            console.log(interessenArray[i]);
        };
            return from(this.interessenRepository.find({
                interessenId: In(interessenArray)}));
        
        

        /*
        return from(this.userInteresseService.findeInteressenZuUser(user).pipe(
            switchMap((mappedUserInteresse: UserInteresse[]) => {
                let interessenArray: number[] = [];
                console.log("Interessen-Array deklariert")
                for(var i = 0; i < mappedUserInteresse.length; i++) {
                    interessenArray.push(mappedUserInteresse[i].interesse.interessenId);
                    console.log("interesse:" + mappedUserInteresse[i].interesse.interessenId);
                };
                return this.interessenRepository.find({
                    interessenId: In(interessenArray)})})));
                    */

    }

}


