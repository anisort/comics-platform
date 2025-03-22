// genres.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from '../../entities/genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {}

  async findByNames(names: string[]): Promise<Genre[]> {
    return this.genreRepository.find({
      where: names.map(name => ({ name })),
    });
  }
}
