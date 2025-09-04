import { Injectable, OnModuleInit } from '@nestjs/common';
import { CleanupFactory } from './cleanup.factory';
import cron from 'node-cron';

@Injectable()
export class CleanupService implements OnModuleInit {
  constructor(private readonly factories: CleanupFactory[]) {}

  onModuleInit() {
    this.factories.forEach((factory) => {
      const task = factory.createCleanupTask();
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      cron.schedule('* * * * *', async () => {
        await task.cleanup();
      });
    });
  }
}
