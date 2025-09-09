import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from '../../entities/genre.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GenresSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(GenresSeederService.name);

  constructor(
    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const seedOnStart = this.configService.get<string>('SEED_ON_START');
    const nodeEnv = this.configService.get<string>('NODE_ENV');

    const shouldSeed =
      (seedOnStart ?? '').toLowerCase() === 'true' ||
      (nodeEnv !== 'production' &&
        (seedOnStart ?? '').toLowerCase() !== 'false');

    if (!shouldSeed) {
      this.logger.log('Seeding on start is disabled (SEED_ON_START!=true).');
      return;
    }

    const preset = [
      'action',
      'adventure',
      'comedy',
      'drama',
      'fantasy',
      'horror',
      'mystery',
      'romance',
      'sci-fi',
      'superhero',
      'thriller',
    ];

    for (const name of preset) {
      const exists = await this.genreRepo.findOne({ where: { name } });
      if (!exists) {
        await this.genreRepo.save(this.genreRepo.create({ name }));
        this.logger.log(`Seeded genre: ${name}`);
      }
    }

    this.logger.log('Genre seeding on start completed.');
  }
}
