import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {v2} from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class UploadService {

  constructor(private configService: ConfigService){
    v2.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }
  
  async upload(file: Express.Multer.File, folder: string): Promise<UploadApiResponse> { 
    return await v2.uploader.upload(file.path, {folder});
  }

  async delete(valueToDelete: string): Promise<void> {
    await v2.uploader.destroy(valueToDelete);
  }

  async deletePageFromCloudService(imageUrl: string){
    const publicId = (imageUrl).split('/').pop()?.split('.')[0];
    const valueToDelete = `comics-platform/comics/pages/${publicId}`;
    await this.delete(valueToDelete);
  }

  async deletePagesForEpisode(pageUrls: string[]): Promise<void> {
    await Promise.all(pageUrls.map(p => this.deletePageFromCloudService(p)));
  }

  async deleteComicFromCloudService(coverUrl: string, pageUrls: string[]){
    const publicId = (coverUrl).split('/').pop()?.split('.')[0];
    const valueToDelete = `comics-platform/comics/covers/${publicId}`;
    await this.delete(valueToDelete);
    await Promise.all(pageUrls.map(p => this.deletePageFromCloudService(p)));
  }
}
