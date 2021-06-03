import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { User } from '../models/user.interface';
import { Observable, from } from 'rxjs';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ) {}

    create(user: User): Observable<User> {
        return from(this.userRepository.save(user));
    }

    findOne(username: string): Observable<User> {
        return from(this.userRepository.findOne({username}));
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find());
    }

    deleteOne(username: string): Observable<any> {
        return from(this.userRepository.delete(username));
    }

    updateOne(username: string, user: User): Observable<any> {
        return from(this.userRepository.update(username, user));
    }
}