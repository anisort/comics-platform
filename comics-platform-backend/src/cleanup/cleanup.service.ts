import { Injectable, OnModuleInit } from '@nestjs/common';
import { CleanupFactory } from './cleanup.factory';
import * as cron from 'node-cron';

@Injectable()
export class CleanupService implements OnModuleInit {
  constructor(private readonly factories: CleanupFactory[]) {}

  onModuleInit() {
    this.factories.forEach(factory => {
      const task = factory.createCleanupTask();
      cron.schedule('* * * * *', async () => {
        await task.cleanup();
      });
    });
  }
}
