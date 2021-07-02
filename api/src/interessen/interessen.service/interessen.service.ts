import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InteressenEntity } from '../interessen.models/Interessen.entity';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Interessen } from '../interessen.models/interessen.interface';
import { UserInteresseService } from 'src/userInteresse/userInteresse.service/user-interesse.service';
import { UserService } from 'src/user/user.service/user.service';
import { InteressenAktivitaetenService } from 'src/interessenAktivitaeten/interessenAktivitaeten.service/interessenAktivitaeten.service';
import { AktivitaetenService } from 'src/aktivitaeten/aktivitaeten.service/aktivitaeten.service';
import { Aktivitaeten } from 'src/aktivitaeten/aktivitaeten.models/aktivitaeten.interface';

@Injectable()
export class InteressenService {

    //creating local repository, plus loading of necessary external service modules    
    constructor(
        @InjectRepository(InteressenEntity) private readonly interessenRepository: Repository<InteressenEntity>,
        @Inject(forwardRef(() => UserInteresseService))
        readonly userInteresseService: UserInteresseService,

        @Inject(forwardRef(() => UserService))
        readonly userService: UserService,

        @Inject(forwardRef(() => InteressenAktivitaetenService))
        private readonly interessenAktivitaetenService: InteressenAktivitaetenService,

        @Inject(forwardRef(() => AktivitaetenService))
        private readonly aktivitaetenService: AktivitaetenService,



    ) { }

    create(interest: Interessen): Observable<Interessen> {
        const newInterest = new InteressenEntity();                              //create new entity, assign value, save
        newInterest.interessenBezeichnung = interest.interessenBezeichnung;
        return from(this.interessenRepository.save(newInterest));
    }


    findOne(interestID: number): Observable<Interessen> {
        return from(this.interessenRepository.findOne(interestID));
    }

    findAll(): Observable<Interessen[]> {
        return from(this.interessenRepository.find()).pipe(
            map((interessen: Interessen[]) => {
                return interessen;
            })
        );
    }

    updateOne(interestID: number, interest: Interessen): Observable<any> {
    return from(this.interessenRepository.update(interestID, interest));
    }


    deleteOne(interestID: number): Observable<any> {
        this.userInteresseService.deleteAllTiesToInteresse(interestID);           //remove all relations between users and the interest to be removed in order to meet integrity constraints
        this.interessenAktivitaetenService.deleteAllTiesToInteresse(interestID);  //remove all relations between activities and the interest to be removed in order to meet integrity constraints
        return from(this.interessenRepository.delete(interestID));
    }



    public findInteressenToUser(username: string): Observable<Interessen[]> {

        return from(this.userInteresseService.findInteressenToUser(username)).pipe(switchMap((interestIDs: number[]) => {  //returns interestIDs
            return this.interessenRepository.find({
                interessenID: In(interestIDs)                                                                              //find actual interest entities to IDs
            });
        }));

    }


    public findInteressenToAktivitaet(activityID: number): Observable<Interessen[]> {                                      
    
        return from(this.interessenAktivitaetenService.findInteressenToAktivitaet(activityID)).pipe(switchMap((interestIDs: number[]) => { //returns interestIDs
            return this.interessenRepository.find({
                interessenID: In(interestIDs)                                                                                              //find actual interest entities to IDs
            });
        }));
    }

    public findAktivitaetenToInteresse(interestID: number): Observable<Aktivitaeten[]> {
        return from(this.aktivitaetenService.findAktivitaetenToInteresse(interestID));
    }

    public removeInteressenAktivitaetenTie(interestID: number, activityID: number) {
        return this.interessenAktivitaetenService.deleteAktivitaetenInteresseTie(interestID, activityID);
    }

    addTieToAktivitaet(interestID: number, activityID: number): void {
        this.interessenAktivitaetenService.insertNewAktivitaetenInteresseTie(interestID, activityID);
    }



}


