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

  async findByNames(names: string[] | string): Promise<Genre[]> {
    const namesArray = Array.isArray(names) ? names : [names];
    return this.genreRepository.find({
      where: namesArray.map(name => ({ name })),
    });
  }

  // make controller
  async getAllGenres(): Promise<Genre[]>{
    return this.genreRepository.find();
  }
  
}
