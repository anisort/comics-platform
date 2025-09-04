import { Injectable, OnModuleInit } from '@nestjs/common';
import { CleanupFactory } from './cleanup.factory';
import { schedule } from 'node-cron';

@Injectable()
export class CleanupService implements OnModuleInit {
  constructor(private readonly factories: CleanupFactory[]) {}

  onModuleInit() {
    this.factories.forEach((factory) => {
      const task = factory.createCleanupTask();
      schedule('* * * * *', () => {
        void task.cleanup();
      });
    });
  }
}
