import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
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
