import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindRelationsNotFoundError, In, Like, Raw, Repository } from 'typeorm';
import { InteressenEntity } from '../interessen.models/Interessen.entity';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Interessen } from '../interessen.models/interessen.interface';
import { UserInteresseService } from 'src/userInteresse/userInteresse.service/user-interesse.service';
import { User } from 'src/user/user.models/user.interface';
import { UserInteresse } from 'src/userInteresse/userInteresse.models/userInteresse';
import { UserService } from 'src/user/user.service/user.service';

@Injectable()
export class InteressenService {
    constructor(
        @InjectRepository(InteressenEntity) private readonly interessenRepository: Repository<InteressenEntity>,
        @Inject(forwardRef(() => UserInteresseService))
        readonly userInteresseService: UserInteresseService,

        @Inject(forwardRef(() => UserService))
        readonly userService: UserService,
    ) { }

    create(interesse: Interessen): Observable<Interessen> {
        console.log('interessenBezeichnung  = ' + interesse.interessenBezeichnung);
        const neuesInteresse = new InteressenEntity();
        console.log('interessenID  = ' + interesse.interessenId);
        neuesInteresse.interessenBezeichnung = interesse.interessenBezeichnung;

        return from(this.interessenRepository.save(neuesInteresse));
    }


    findOne(interessenID: number): Observable<Interessen> {
        console.log("Suche nach Interesse " + interessenID);
        return from(this.interessenRepository.findOne(interessenID));
    }

    findAll(): Observable<Interessen[]> {
        return from(this.interessenRepository.find()).pipe(
            map((interessen: Interessen[]) => {
                console.log("Alle Interessen gefunden");
                return interessen;
            })
        );
    }

    updateOne(interessenID: number, interesse: Interessen): Observable<any> {
        console.log("Interesse: " + interessenID + " geändert.");
        return this.findOne(interessenID).pipe(
            switchMap((oldInteresse: Interessen) => { return this.interessenRepository.update(oldInteresse.interessenId, interesse) }))
    }


    deleteOne(interessenID: number): Observable<any> {
        console.log("Interessen: " + interessenID + " gelöscht.");
        this.userInteresseService.deleteAlleInteressenTies(interessenID);
        return from(this.interessenRepository.delete(interessenID));
    }

    public getInteresse(interessenID: number): Observable<Interessen> {
        console.log("Suche nach Interesse " + interessenID);
        return from(this.interessenRepository.findOne(interessenID));
    }

    public getInteresseZuUser(username: string): Observable<Interessen[]> {

        const interessenIds: number[] = [];

        return from(this.userInteresseService.findeInteressenZuUser(username)).pipe(switchMap((interessenIds: number[]) => {
            
            for (var i = 0; i < interessenIds.length; i++) {
                console.log("interessenService: " + interessenIds[i]);
            };
            return this.interessenRepository.find({
                interessenId: In(interessenIds)
            });
        }));

    }

}


