export interface CleanupTask {
    cleanup(): Promise<void>;
}
  