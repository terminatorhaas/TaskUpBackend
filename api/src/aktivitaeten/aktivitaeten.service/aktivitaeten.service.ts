import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Interessen } from 'src/interessen/interessen.models/interessen.interface';
import { InteressenService } from 'src/interessen/interessen.service/interessen.service';
import { InteressenAktivitaetenService } from 'src/interessenAktivitaeten/interessenAktivitaeten.service/interessenAktivitaeten.service';
import { In, Repository } from 'typeorm';
import { AktivitaetenEntity } from '../aktivitaeten.models/aktivitaeten.entity';
import { Aktivitaeten } from '../aktivitaeten.models/aktivitaeten.interface';

@Injectable()
export class AktivitaetenService {

    //creating local repository, plus loading of necessary external service modules
    constructor(
        @InjectRepository(AktivitaetenEntity) private readonly aktivitaetenRepository: Repository<AktivitaetenEntity>,

        @Inject(forwardRef(() => InteressenService))
        private readonly interessenService: InteressenService,

        @Inject(forwardRef(() => InteressenAktivitaetenService))
        private readonly interessenAktivitaetenService: InteressenAktivitaetenService,

    ) { }

    create(activity: Aktivitaeten): Observable<Aktivitaeten> {
        return from(this.aktivitaetenRepository.save(activity));
    }

    findOne(activity: number): Observable<Aktivitaeten> {
        return from(this.aktivitaetenRepository.findOne(activity));
    }

    findAll(): Observable<Aktivitaeten[]> {
        return from(this.aktivitaetenRepository.find()).pipe(
            map((activities: Aktivitaeten[]) => {
                return activities;
            })
        );
    }

    updateOne(activityID: number, aktivitaet: Aktivitaeten): Observable<any> {
        return from(this.aktivitaetenRepository.update(activityID, aktivitaet));
    }


    deleteOne(activityID: number): Observable<any> {
        this.interessenAktivitaetenService.deleteAllTiesToAktivitaet(activityID);                       //remove all relations between interests and the activityID to be removed in order to meet integrity constraints 
        return from(this.aktivitaetenRepository.delete(activityID));
    }

    public findInteressenToAktivitaet(activityID: number): Observable<Interessen[]> {
        return from(this.interessenService.findInteressenToAktivitaet(activityID));                     //call method in another service (done to keep structure)
    }


    public findAktivitaetenToInteresse(interestID: number): Observable<Aktivitaeten[]> {
        return from(this.interessenAktivitaetenService.findAktivitaetenToInteresse(interestID)).pipe(   //returns activityIDs
            switchMap((activityIDs: number[]) => {
                return this.aktivitaetenRepository.find({                                               //find actual activity entities to IDs
                    aktivitaetenID: In(activityIDs)
                });
            }));
    }





}
