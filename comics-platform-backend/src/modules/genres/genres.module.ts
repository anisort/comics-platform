import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from 'src/entities/genre.entity';
import { GenresService } from 'src/services/genres/genres.service';

@Module({
  imports: [TypeOrmModule.forFeature([Genre])],
  providers: [GenresService],
  exports: [GenresService],
})
export class GenresModule {}
