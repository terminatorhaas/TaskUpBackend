import { HttpCode, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.models/user.entity';
import { Repository } from 'typeorm';
import { User } from '../user.models/user.interface';
import { Interessen } from '../../interessen/interessen.models/interessen.interface';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError} from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service/auth.service';
import { InteressenService } from 'src/interessen/interessen.service/interessen.service';
import { UserRole } from "../user.models/user.interface";


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        readonly interessenService: InteressenService,
        private authService: AuthService

    ) {}

    create(user: User): Observable<any> 
     {
        return this.authService.hashPasswort(user.passwort).pipe(
            switchMap((passwortHash: string) => {
                const newUser     = new UserEntity();
                newUser.username  = user.username;
                newUser.email     = user.email;
                newUser.passwort  = passwortHash;
                newUser.vorname   = user.vorname;
                newUser.nachname  = user.nachname;
                newUser.zeitzone  = user.zeitzone;
                newUser.adminFlag = user.adminFlag;                
                newUser.role = UserRole.USER;
                newUser.interessens = [];

                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const {passwort, ...result} = user;
                        console.log("Neuer User: " + newUser.username + " hinzugefügt.");
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
        console.log("Alle User gefunden");
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach(function (v) {delete v.passwort});
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

    tieToInteresse(username: string, interessenBezeichnung: string): Observable<any> {
        return this.interessenService.getInteresse(interessenBezeichnung).pipe(
            switchMap((mappedInteresse: Interessen) => this.findOne(username).pipe(
                map((mappedUser: User) => {
                console.log("Auf User: " + mappedUser.username);
                //mappedUser.interessens.push(mappedInteresse)
                var interessenArray: Interessen[] = [];
                interessenArray = mappedUser.interessens;
                interessenArray.push(mappedInteresse);
                mappedUser.interessens = interessenArray;
                console.log("User: " + mappedUser.username + " zugeordnet zu Interesse: " + mappedInteresse.interessenBezeichnung);
                //return from(this.userRepository.update(mappedUser.username, mappedUser)); 
                return from(this.userRepository.save(mappedUser));
                }))
        ))

    }

    updateRoleOfUser(username: string, role: string): Observable<any> {
        var user = new UserEntity();
        const {passwort, ...result} = user;
        return this.findOne(username).pipe( switchMap((mappedUser: User)=>  {

        switch(role){
            case UserRole.ADMIN:{
                mappedUser.role= UserRole.ADMIN;
                break;
            }
            case UserRole.USER:{
                mappedUser.role= UserRole.USER;
                break;
            }default:{
                console.log("Es wird ein Error geworfen")
                throw new Error("Incompatible User.Role");
            }
        }
        return from(this.userRepository.update(mappedUser.username,mappedUser ));} ));                
    }


    findeInteressenZuUser(username: string): Observable<Interessen[]> {
        return this.interessenService.getInteresseZuUser(username);
            //gib mir Interessen zum User aus
    }

    removeTieFromInteresse(username: string, interessenBezeichnung: string): Observable<any> {
        return this.interessenService.getInteresse(interessenBezeichnung).pipe(
            switchMap((mappedInteresse: Interessen) => this.findOne(username).pipe(
                map((mappedUser: User) => {
                console.log("Auf User: " + mappedUser.username);
                //mappedUser.interessens.push(mappedInteresse)
                var interessenArray: Interessen[] = [];
                interessenArray = mappedUser.interessens;
                interessenArray.push(mappedInteresse);
                mappedUser.interessens = interessenArray;
                console.log("User: " + mappedUser.username + " zugeordnet zu Interesse: " + mappedInteresse.interessenBezeichnung);
                //return from(this.userRepository.update(mappedUser.username, mappedUser)); 
                return from(this.userRepository.save(mappedUser));
                }))
        ))

    }

    
}
