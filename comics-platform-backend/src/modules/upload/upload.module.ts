import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadService } from 'src/services/upload/upload.service';

@Module({
  imports: [ConfigModule], // Добавляем импорт ConfigModule
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
