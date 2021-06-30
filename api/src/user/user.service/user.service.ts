import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.models/user.entity';
import { User } from '../user.models/user.interface';
import { Interessen } from '../../interessen/interessen.models/interessen.interface';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service/auth.service';
import { InteressenService } from 'src/interessen/interessen.service/interessen.service';
import { UserRole } from "../user.models/user.interface";
import { UserInteresseService } from 'src/userInteresse/userInteresse.service/user-interesse.service';
import { UserKalenderService } from 'src/userKalender/userKalender.service/user-kalender.service';
import { Kalender } from 'src/kalender/kalender.models/kalender.interface';
import { KalenderService } from 'src/kalender/kalender.service/kalender.service';
import { getConnection, Repository } from 'typeorm';
import { InteressenEntity } from 'src/interessen/interessen.models/Interessen.entity';
import { AktivitaetenService } from 'src/aktivitaeten/aktivitaeten.service/aktivitaeten.service';
import { Aktivitaeten } from 'src/aktivitaeten/aktivitaeten.models/aktivitaeten.interface';



@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @Inject(forwardRef(() => InteressenService))
        private readonly interessenService: InteressenService,

        @Inject(forwardRef(() => KalenderService))
        private readonly kalenderService: KalenderService,

        @Inject(forwardRef(() => AktivitaetenService))
        private readonly aktivitaetenService: AktivitaetenService,

        @Inject(forwardRef(() => UserInteresseService))
        private readonly userInteressenService: UserInteresseService,

        @Inject(forwardRef(() => UserKalenderService))
        private readonly userKalenderService: UserKalenderService,


        @Inject(forwardRef(() => AuthService))
        private authService: AuthService

    ) { }


    create(user: User): Observable<any> {
        return this.authService.hashPasswort(user.passwort).pipe(
            switchMap((passwortHash: string) => {

                const newUser = new UserEntity();
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.passwort = passwortHash;
                newUser.vorname = user.vorname;
                newUser.nachname = user.nachname;
                newUser.zeitzone = user.zeitzone;
                newUser.role = UserRole.USER;
                newUser.interessens = [];

                return this.checkIfUserExists(newUser.username).pipe(switchMap((match: boolean) => { 
                    console.log("test");
                    if (match) { 
                        console.log("User existiert bereits (username)"); 
                        throwError; 
                        return null; 
                    } else{
                        return from(this.userRepository.save(newUser)).pipe(
                            map((user: User) => {
        
                                const { passwort, ...result } = user;
                                console.log("Neuer User: " + newUser.username + " hinzugefügt.");
                                return result;
                            })
                            ,
                            catchError(err => throwError(err))
                        )
                    }
                }))
            }))
    }

    checkIfUserExists(username: string): Observable<boolean> {
        return this.findOne(username).pipe(
            map((user: User) => {
                if (user != undefined) {
                    return true;
                }else{
                console.log("der user existiert nicht")
                return false;
                }
            }
        ))
    }

    findOne(username: string): Observable<User> {
        return from(this.userRepository.findOne({ username }));
    }

    findAll(): Observable<User[]> {
        console.log("Alle User gefunden");
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach(function (v) { delete v.passwort });
                return users;
            })
        );
    }

    deleteOne(username: string): Observable<any> {
        console.log("User: " + username + " gelöscht.");
        this.userKalenderService.deleteAlleUserTies(username);
        this.userInteressenService.deleteAlleUserTies(username);
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
                if (user) {
                    return this.authService.generiereJWT(user).pipe(map((jwt: string) => jwt));
                } else {
                    return 'U';
                }
            })
        )
    }
    
    validateUser(email: string, passwort: string): Observable<User> {
        return this.findByMail(email).pipe(
            switchMap((user: User) => this.authService.vergleichePasswort(passwort, user.passwort).pipe(
                map((match: boolean) => {
                    if (match) {
                        console.log("Eingegebenes Passwort für User: " + user.username + " stimmt überein.");
                        const { passwort, ...result } = user;
                        return result;
                    } else {
                        console.log("Falsches Passwort für User: " + user.username + ".");
                        return null;
                    }
                })
            ))
        )
    }

    findByMail(email: string): Observable<User> {
        return from(this.userRepository.findOne({ email }));
    }

    addTieToInteresse(username: string, interessenID: number): void {
        this.userInteressenService.insertNewUserInteresseTie(interessenID, username);
    }


    updateRoleOfUser(username: string, role: string): Observable<any> {
        var user = new UserEntity();
        const { passwort, ...result } = user;
        return this.findOne(username).pipe(switchMap((mappedUser: User) => {

            switch (role) {
                case UserRole.ADMIN: {
                    mappedUser.role = UserRole.ADMIN;
                    break;
                }
                case UserRole.USER: {
                    mappedUser.role = UserRole.USER;
                    break;
                } default: {
                    console.log("Es wird ein Error geworfen")
                    throw new Error("Incompatible User.Role");
                }
            }
            return from(this.userRepository.update(mappedUser.username, mappedUser));
        }));
    }

    findeInteressenZuUser(username: string): Observable<Interessen[]> {
        return this.interessenService.getInteresseZuUser(username);
    }

    deleteTieFromInteresse(username: string, interessenID: number): void {
        this.userInteressenService.deleteUserInteresseTie(interessenID, username);

    }

    addTieToKalender(username: string, kalenderID: number): void {
        this.userKalenderService.insertNewUserKalenderTie(kalenderID, username);
    }

    findeKalenderZuUser(username: string): Observable<Kalender[]> {
        return this.kalenderService.getKalenderZuUser(username);

    }

    removeTieFromKalender(username: string, kalenderId: number) {
        this.userKalenderService.deleteUserKalenderTie(kalenderId, username);
    }

    async getUsername(email1: string): Promise<String> {
        let username: string;
    
        const user = await getConnection()
        .getRepository(UserEntity)
        .createQueryBuilder("user")
        .where("user.email = :email", {email: email1})
        .getOne();

        username = String(user.username);

        return username;
    }
/*
    generateVorschlage(username: string):Observable<Aktivitaeten[]>{
        let vorschlaege: Aktivitaeten[];
        let interessenArray: Interessen[];
        this.findeInteressenZuUser(username).pipe(map((interessenArray: Interessen[])=>{
            console.log("test");  
            
            
                return this.aktivitaetenService.findeAktivitaetZuInteresse(interessenArray[i].interessenID).pipe
                (map((aktivitaeten: Aktivitaeten[])=>{  return aktivitaeten;   }));
            
        })); //Interessen[]
        
        
        return;
    }
    */
}


