import { CleanupTask } from './cleanup-task.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InactiveUsersCleanupTask implements CleanupTask {
  private readonly logger = new Logger(InactiveUsersCleanupTask.name);

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async cleanup(): Promise<void> {
    this.logger.log('Starting inactive users cleanup job...');

    const users = await this.usersRepository.find({ where: { isActive: false } });
    this.logger.log(`Found ${users.length} inactive users.`);

    const now = Date.now();
    const expired = users.filter(u => (now - new Date(u.createdAt).getTime()) > 185 * 60 * 1000);
    this.logger.log(`Users eligible for deletion: ${expired.length}`);

    if (expired.length > 0) {
      await this.usersRepository.remove(expired);
      this.logger.log(`Deleted ${expired.length} inactive users.`);
    } else {
      this.logger.log('No inactive users to delete at this time.');
    }

    this.logger.log('Inactive users cleanup job finished.');
  }
}
