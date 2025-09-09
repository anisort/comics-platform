import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from 'src/entities/genre.entity';
import { GenresService } from 'src/services/genres/genres.service';
import { GenresSeederService } from './genres-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Genre])],
  providers: [GenresService, GenresSeederService],
  exports: [GenresService],
})
export class GenresModule {}
