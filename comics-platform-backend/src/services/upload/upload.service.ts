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



}



  // async uploadPage(file: Express.Multer.File, comicsId: string, episodeId: string): Promise<UploadApiResponse> {
  //   const folder = `comics-platform/${comicsId}/episodes/${episodeId}`;
  //   const result = await this.cloudinary.uploader.upload(file.path, {
  //     folder,
  //   });
  //   return result;
  // }