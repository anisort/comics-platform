import { Test, TestingModule } from '@nestjs/testing';
import { EpisodeNotificationService } from './episode-notification.service';

describe('EpisodeNotificationService', () => {
  let service: EpisodeNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EpisodeNotificationService],
    }).compile();

    service = module.get<EpisodeNotificationService>(
      EpisodeNotificationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
