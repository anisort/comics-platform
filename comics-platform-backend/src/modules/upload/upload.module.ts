import { Module } from '@nestjs/common';
import { UploadService } from 'src/services/upload/upload.service';

@Module({
  imports: [],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
