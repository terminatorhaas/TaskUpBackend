import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InteressenEntity } from '../interessen.models/Interessen.entity';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError} from 'rxjs/operators';
import { Interessen } from '../interessen.models/interessen.interface';

@Injectable()
export class InteressenService{
  constructor(
        @InjectRepository(InteressenEntity) private readonly interessenRepository: Repository<InteressenEntity>,
    ) {}

    create(interesse: Interessen): Observable<Interessen> {

                console.log('interessenBezeichnung  = ' + interesse.interessenBezeichnung) ;        
                const neueInteresse = new InteressenEntity();
                
                console.log('interessenID  = ' + interesse.interessenID) ;
                neueInteresse.interessenBezeichnung  = interesse.interessenBezeichnung;

                return from(this.interessenRepository.save(neueInteresse)).pipe(
                    map((interesse: Interessen) => {
                        const { ...result} = interesse;
                        console.log("Neue Interesse: " + neueInteresse.interessenBezeichnung + " hinzugefügt.");
                        return result;
                    }),
                    catchError(err => throwError(err))
                )
                
    }
        
/*
    findOne(username: string): Observable<User> {
        return from(this.userRepository.findOne({username})).pipe(
            map((user: User) => {
                const {passwort, ...result} = user;
                console.log("User: " + username + " gefunden.");
                return result;
            } )
        )
    }
*/
    findAll(): Observable<Interessen[]> {
        return from(this.interessenRepository.find()).pipe(
            map((interessen: Interessen[]) => {
                console.log("Alle Interessen gefunden");
                return interessen;
            })
        );
    }
/*
    deleteOne(interessenID: string): Observable<any> {
        console.log("Interessen: " + interessenID + " gelöscht.");
        return from(this.interessenRepository.delete(interessenID));
    }
/*
    updateOne(username: string, user: User): Observable<any> {
        delete user.email;
        delete user.passwort;
        console.log("User: " + username + " geändert.");
        return from(this.userRepository.update(username, user));
    }
*/
   
  }
