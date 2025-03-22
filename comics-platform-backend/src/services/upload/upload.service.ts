import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {v2} from 'cloudinary'; // Імпортуємо cloudinary
import { UploadApiResponse } from 'cloudinary'; // Імпортуємо тип UploadApiResponse

@Injectable()
export class UploadService {

  constructor(private configService: ConfigService){
    v2.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }
  
  async uploadCover(file: Express.Multer.File, comicName: string): Promise<UploadApiResponse> {
    const formattedComicName = comicName.toLowerCase().replace(/\s+/g, '-');
    const folder = `comics-platform/comics/${formattedComicName}/cover`;
    const result = await v2.uploader.upload(file.path, {folder});
    return result;
  }

  // // Пример загрузки страницы
  // async uploadPage(file: Express.Multer.File, comicsId: string, episodeId: string): Promise<UploadApiResponse> {
  //   const folder = `comics-platform/${comicsId}/episodes/${episodeId}`;
  //   const result = await this.cloudinary.uploader.upload(file.path, {
  //     folder,
  //   });
  //   return result;
  // }
}
