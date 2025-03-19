import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async checkUsernameOrEmail(value: string): Promise<{ exists: boolean }> {
        const user = await this.usersRepository.findOne({
          where: [
            { username: value },
            { email: value },
          ],
        });
        return { exists: user ? true : false };
    }
}
