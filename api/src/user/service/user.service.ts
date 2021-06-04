import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { User } from '../models/user.interface';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError} from 'rxjs/operators';
import { AuthService } from '../../auth/service/auth.service';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService
    ) {}

    create(user: User): Observable<User> {
        return this.authService.hashPasswort(user.passwort).pipe(
            switchMap((passwortHash: string) => {
                const neuerUser     = new UserEntity();
                neuerUser.username  = user.username;
                neuerUser.email     = user.email;
                neuerUser.passwort  = passwortHash;
                neuerUser.vorname   = user.vorname;
                neuerUser.nachname  = user.nachname;
                neuerUser.zeitzone  = user.zeitzone;
                neuerUser.adminFlag = user.adminFlag;

                return from(this.userRepository.save(neuerUser)).pipe(
                    map((user: User) => {
                        const {passwort, ...result} = user;
                        console.log("Neuer User: " + neuerUser.username + " hinzugefügt.");
                        return result;
                    }),
                    catchError(err => throwError(err))
                )
                
            })
        )
    }

    findOne(username: string): Observable<User> {
        return from(this.userRepository.findOne({username})).pipe(
            map((user: User) => {
                const {passwort, ...result} = user;
                console.log("User: " + username + " gefunden.");
                return result;
            } )
        )
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach(function (v) {delete v.passwort});
                console.log("Alle User gefunden");
                return users;
            })
        );
    }

    deleteOne(username: string): Observable<any> {
        console.log("User: " + username + " gelöscht.");
        return from(this.userRepository.delete(username));
    }

    updateOne(username: string, user: User): Observable<any> {
        delete user.email;
        delete user.passwort;
        console.log("User: " + username + " geändert.");
        return from(this.userRepository.update(username, user));
    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.passwort).pipe(
            switchMap((user: User) => {
                if(user) {
                    return this.authService.generiereJWT(user).pipe(map((jwt: string) => jwt));
                } else {
                    return 'User ' + user.username + " ist unbekannt.";
                }
            })
        )
    }

    validateUser(email: string, passwort: string): Observable<User> {
        return this.findByMail(email).pipe(
            switchMap((user: User) => this.authService.vergleichePasswort(passwort, user.passwort).pipe(
                map((match: boolean) => {
                    if(match) {
                        console.log("Eingegebenes Passwort für User: " + user.username + " stimmt überein.");
                        const {passwort, ...result} = user;
                        return result;
                    } else {
                        console.log("Falsches Passwort für User: " + user.username + ".");
                        throw Error;
                    }
                })
            ))
        )

    }

    findByMail(email: string): Observable<User> {
        return from(this.userRepository.findOne({email}));
    }
}