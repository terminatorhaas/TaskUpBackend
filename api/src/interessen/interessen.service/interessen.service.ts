import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Raw, Repository } from 'typeorm';
import { InteressenEntity } from '../interessen.models/Interessen.entity';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError} from 'rxjs/operators';
import { Interessen } from '../interessen.models/interessen.interface';
import { In } from 'typeorm';
import { User } from 'src/user/user.models/user.interface';
import { UserEntity } from 'src/user/user.models/user.entity';
import { UserService } from 'src/user/user.service/user.service';

@Injectable()
export class InteressenService{
  constructor(
        @InjectRepository(InteressenEntity) private readonly interessenRepository: Repository<InteressenEntity>,
    ) {}

    create(interesse: Interessen): Observable<Interessen> {
                console.log('interessenBezeichnung  = ' + interesse.interessenBezeichnung) ;        
                const neuesInteresse = new InteressenEntity();
                console.log('interessenID  = ' + interesse.interessenId) ;
                neuesInteresse.interessenBezeichnung  = interesse.interessenBezeichnung;

                return from(this.interessenRepository.save(neuesInteresse));           
    }
        

    findOne(interessenBezeichnung: string): Observable<Interessen> {
        console.log("Suche nach Interesse " + interessenBezeichnung);
        return from(this.interessenRepository.findOne({interessenBezeichnung}));
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
            switchMap((oldInteresse: Interessen) => {return this.interessenRepository.update(oldInteresse.interessenId, interesse)}))
        }
    

    deleteOne(interessenBezeichnung: string): Observable<any> {
        console.log("Interessen: " + interessenBezeichnung + " gelöscht.");
        return this.findOne(interessenBezeichnung).pipe(
            switchMap((oldInteresse: Interessen) => {return this.interessenRepository.delete(oldInteresse.interessenId)}))
    }

    public getInteresse(interessenBezeichnung: string): Observable<Interessen> {
        console.log("Suche nach Interesse " + interessenBezeichnung);
        return from(this.interessenRepository.findOne({interessenBezeichnung}));
    }

    public getInteresseZuUser(username1: string): Observable<Interessen[]> {
        return from(this.interessenRepository.find({
            where: {
                users: {
                    username: username1
                },
            },
            relations: ['users'],
            /*
            join: {
                alias: "username",
                leftJoinAndSelect: {
                    users: "username.users"
                }
            },
            loadRelationIds: true,
            where: {
                users: username1
            },
    */
    
    
   /*         relations: ['users'],
    loadRelationIds: true,
    where: {
        
    }
*/
        
        }));

        }

    }
   
  
