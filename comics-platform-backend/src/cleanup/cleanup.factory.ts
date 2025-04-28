import { CleanupTask } from './cleanup-task.interface';

export abstract class CleanupFactory {
    abstract createCleanupTask(): CleanupTask;
}
