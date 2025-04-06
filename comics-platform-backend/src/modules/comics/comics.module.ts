import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from '../upload/upload.module'; 
import { ConfigModule } from '@nestjs/config';
import { Comic } from 'src/entities/comic.entity';
import { ComicsController } from 'src/controllers/comics/comics.controller';
import { ComicsService } from 'src/services/comics/comics.service';
import { GenresModule } from '../genres/genres.module';
import { UsersModule } from '../users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comic]), 
    MulterModule.register({
      dest: '../../../uploads'
    }),
    UploadModule,
    ConfigModule, 
    GenresModule,
    UsersModule,
    AuthModule
  ],
  controllers: [ComicsController],
  providers: [ComicsService],
  exports: [ComicsService]
})
export class ComicsModule {}