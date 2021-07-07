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
import { AktivitaetenService } from 'src/aktivitaeten/aktivitaeten.service/aktivitaeten.service';
import { Aktivitaeten } from 'src/aktivitaeten/aktivitaeten.models/aktivitaeten.interface';



@Injectable()
export class UserService {

    //creating local repository, plus loading of necessary external service modules
    //since this service class accesses many different global methods, as many service classes need to be injected
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
        return this.authService.hashPassword(user.passwort).pipe(       //build hash of password entered at register screen
            switchMap((passwordHash: string) => {

                const newUser = new UserEntity();                       //assigning of parameters given at register screen
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.passwort = passwordHash;                        //hashed password instead of plain text password (for security reasons)           
                newUser.vorname = user.vorname;
                newUser.nachname = user.nachname;
                newUser.zeitzone = user.zeitzone;
                newUser.role = UserRole.USER;
                newUser.interessens = [];

                return this.checkIfUserExists(newUser.username).pipe(switchMap((match: boolean) => {    //if User already exists, throw an error and abort user creation process
                    if (match) {
                        throwError;
                        return null;
                    } else {                                                                            //if user doesn't already exist, continue by saving user on database
                        return from(this.userRepository.save(newUser)).pipe(
                            map((user: User) => {
                                const { passwort, ...result } = user;                                   //return user BUT extract password out of payload first (for security reasons)   
                                return result;
                            })
                            ,
                            catchError(err => throwError(err))
                        )
                    }
                }))
            }))
    }

    checkIfUserExists(username: string): Observable<boolean> {                                          //checks if user exists, used in create() method 
        return this.findOne(username).pipe(                                                             //returns boolean: true = doesnt exist, false = already exists
            map((user: User) => {
                if (user != undefined) {
                    return true;
                } else {
                    return false;
                }
            }
            ))
    }

    findOne(username: string): Observable<User> {
        return from(this.userRepository.findOne({ username }));
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach(function (v) { delete v.passwort });                                      //find all users, but extract password out of payload first
                return users;
            })
        );
    }

    deleteOne(username: string): Observable<any> {
        this.userKalenderService.deleteAllTiesToUser(username);                                         //remove all relations between calendars and the user to be removed in order to meet integrity constraints
        this.userInteressenService.deleteAllTiesToUser(username);                                       //remove all relations between interests and the user to be removed in order to meet integrity constraints
        return from(this.userRepository.delete(username));
    }

    updateOne(username: string, user: User): Observable<any> {                                          //update user BUT username, email and password can't be changed after creation (login credentails need to be kept secret, username is used as foreign key)
        delete user.username;
        delete user.email;
        delete user.passwort;
        return from(this.userRepository.update(username, user));
    }

    login(user: User): Observable<string> {                                                             
        return this.validateUser(user.email, user.passwort).pipe(                                       
            switchMap((user: User) => {
                if (user) {                                                                             //Wenn Passwort OK, dann JWT Token generieren und zurückgeben
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));          
                } else {
                    return 'U';                                                                         //Meldung, wenn Passwort falsch
                }
            })
        )
    }

    validateUser(email: string, passwort: string): Observable<User> {
        return this.findByMail(email).pipe(                                                             //find by mail since email has to be entered during login
            switchMap((user: User) => this.authService.comparePassword(passwort, user.passwort).pipe(   
                map((match: boolean) => {
                    if (match) {                                                                        //if password is correct, return user found in db
                        const { passwort, ...result } = user;
                        return result;
                    } else {
                        return null;
                    }
                })
            ))
        )
    }

    findByMail(email: string): Observable<User> {
        return from(this.userRepository.findOne({ email }));
    }

    addTieToInteresse(username: string, interestID: number): void {
        this.userInteressenService.insertNewUserInteresseTie(interestID, username);                     //Creates relation of user entity towards an interest
    }


    updateRoleOfUser(username: string, role: string): Observable<any> {
        var user = new UserEntity();
        const { passwort, ...result } = user;
        return this.findOne(username).pipe(switchMap((mappedUser: User) => {

            switch (role) {                                     //check whether entered role is even valid
                case UserRole.ADMIN: {
                    mappedUser.role = UserRole.ADMIN;
                    break;
                }
                case UserRole.USER: {
                    mappedUser.role = UserRole.USER;
                    break;
                } default: {
                    throw new Error("Incompatible User.Role");
                }
            }
            return from(this.userRepository.update(mappedUser.username, mappedUser));
        }));
    }

    findInteressenToUser(username: string): Observable<Interessen[]> {
        return this.interessenService.findInteressenToUser(username);
    }

    deleteTieFromInteresse(username: string, interestID: number): void {
        this.userInteressenService.deleteUserInteresseTie(interestID, username);

    }

    addTieToKalender(username: string, calendarID: number): void {
        this.userKalenderService.insertNewUserKalenderTie(calendarID, username);
    }

    findKalenderToUser(username: string): Observable<Kalender[]> {
        return this.kalenderService.getKalenderToUser(username);
    }

    removeTieFromKalender(username: string, calendarID: number) {
        this.userKalenderService.deleteUserKalenderTie(calendarID, username);
    }

    async getUsernameRole(email: string): Promise<String[]> {                             //returns username to specified email
        let returnArray: string[] = [];
        const user = await getConnection()                                          //Performing select operation on DB
            .getRepository(UserEntity)
            .createQueryBuilder("user")
            .where("user.email = :email", { email: email })
            .getOne();
            returnArray.push(String(user.username));
            returnArray.push(String(user.role));                                           //just need username --> isolation
        return returnArray;
    }




    // This function returns a randomized aktivitaeten entity based on the interests of a given user.
    generateProposal(username: string): Observable<Aktivitaeten> {

        return this.findInteressenToUser(username).pipe(switchMap((interestsArray: Interessen[]) => {

            return this.aktivitaetenService.findAktivitaetenToInteresse(interestsArray[Math.floor(Math.random() * interestsArray.length)].interessenID)
                .pipe(map((activitiesArray: Aktivitaeten[]) => {
                    return activitiesArray[Math.floor(Math.random() * activitiesArray.length)];
                }
                ));

        }));
    }
}


