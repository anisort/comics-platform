import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findUserByName(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { username },
    });
  }
  
  async findUserByIdWithSubscriptions(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['subscribedComics'],
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    return user;
  }
  
  async saveUser(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async findUserById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
  
  
}
