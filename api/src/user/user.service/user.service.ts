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
import { UserInteresseEntity } from 'src/userInteresse/userInteresse.models/userInteresse.entity';
import { UserInteresse } from 'src/userInteresse/userInteresse.models/userInteresse';
import { InteressenEntity } from 'src/interessen/interessen.models/Interessen.entity';
import { UserInteresseController } from 'src/userInteresse/userInteresse.controller/user-interesse.controller';


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
        return from(this.userRepository.findOne({username}));
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

    addTieToInteresse(username: string, interessenBezeichnung: string): Observable<any> {
        return from(this.findOne(username).pipe(
            switchMap((mappedUser: UserEntity) => {return this.interessenService.getInteresseZuUser(mappedUser).pipe(
                switchMap((mappedInteressen: Interessen[]) => {
                    return this.interessenService.findOne(interessenBezeichnung).pipe(
                        switchMap((mappedInteresse: Interessen) => {
                            var neuesInteresse: UserInteresseEntity = new UserInteresseEntity();
                                neuesInteresse.username = mappedUser;
                                neuesInteresse.interessenID = mappedInteresse;
                            var userInteressenArray: UserInteresseEntity[] = [];
                                for(var i = 0; i < mappedInteressen.length; i++) {
                                    var neuesUserInteresse: UserInteresse = new UserInteresseEntity();
                                    neuesUserInteresse.username = mappedUser;
                                    neuesUserInteresse.interessenID = mappedInteressen[i];
                                    userInteressenArray.push(neuesUserInteresse)
                                }
                                userInteressenArray.push(neuesInteresse);
                                mappedUser.interessens = userInteressenArray;
                                return from(this.userRepository.save(mappedUser));
                        })
                        
                    )
                }
                )
            ) })));



        /*
        return this.interessenService.getInteresse(interessenBezeichnung).pipe(
            switchMap((mappedInteresse: InteressenEntity) => this.findOne(username).pipe(
                map((mappedUser: UserEntity) => {
                console.log("Auf User: " + mappedUser.username);
                //mappedUser.interessens.push(mappedInteresse.interessenId)
                const neuesInteresse: UserInteresse = {
                    interessenID: mappedInteresse,
                    username: mappedUser
                };
                if (mappedUser.interessens == undefined) {
                    mappedUser.interessens = []
                    }
                mappedUser.interessens.push(neuesInteresse);
                console.log("User: " + mappedUser.username + " zugeordnet zu Interesse: " + mappedInteresse.interessenBezeichnung);
                //return from(this.userRepository.update(mappedUser.username, mappedUser)); 
                return from(this.userRepository.save(mappedUser));
                }))
        ))
                */
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

        return from(this.findOne(username).pipe(
            switchMap((mappedUser: User) => {
                return this.interessenService.getInteresseZuUser(mappedUser) })));
    }

    removeTieFromInteresse(username: string, interessenBezeichnung: string): Observable<any> {
        return this.interessenService.getInteresse(interessenBezeichnung).pipe(
            switchMap((mappedInteresse: InteressenEntity) => this.findOne(username).pipe(
                map((mappedUser: UserEntity) => {
                console.log("Auf User: " + mappedUser.username);
                //mappedUser.interessens.push(mappedInteresse)
                for(let v of mappedUser.interessens) {
                }
                console.log("User: " + mappedUser.username + " zugeordnet zu Interesse: " + mappedInteresse.interessenBezeichnung);
                //return from(this.userRepository.update(mappedUser.username, mappedUser)); 
                return from(this.userRepository.save(mappedUser));
                }))
        ))

    }

    
}
