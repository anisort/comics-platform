import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from 'src/entities/page.entity';
import { In, Repository } from 'typeorm';
import { EpisodesService } from '../episodes/episodes.service';
import { UploadService } from '../upload/upload.service';
import { ComicsService } from '../comics/comics.service';
import { ReorderDto } from 'src/dto/reorder.dto';

@Injectable()
export class PagesService {

  constructor(
      @InjectRepository(Page)
      private pageRepository: Repository<Page>,
      private uploadService: UploadService,
      private episodesService: EpisodesService,
  ){}

  // prop i need to refactor it
  async paginatePages(episodeId: number, page = 1, limit = 1): Promise<Page[]> {
      return this.pageRepository.find({
        where: { episode: { id: episodeId } },
        order: { order: 'ASC' },
        skip: (page - 1) * limit,
        take: limit
      });
  }

  async createPageWithUpload(episodeId: number, image: Express.Multer.File, username: string) {
    const episode = await this.episodesService.findById(episodeId);
    const comic = episode.comic;
    if(!comic || comic.user.username !== username){
        throw new NotFoundException('Episode not found');
    }

    const lastPage = await this.pageRepository.findOne({
      where: { episode: { id: episodeId } },
      order: { order: 'DESC' }
    });
    const nextOrder = lastPage ? lastPage.order + 1 : 1;
  
    const folder = `comics-platform/comics/pages`;
    const uploadResult = await this.uploadService.upload(image, folder);
  
    const page = this.pageRepository.create({
      order: nextOrder,
      imageUrl: uploadResult.secure_url,
      episode: { id: episodeId }
    });
  
    return await this.pageRepository.save(page);
  }

  async reorder(dto: ReorderDto, username: string, episodeId: number): Promise<Page[]>{
    const episode = await this.episodesService.findById(episodeId);
    const comic = episode.comic;
    if(!comic || comic.user.username !== username){
        throw new NotFoundException('Episode not found');
    }

    const pages = await this.pageRepository.find({
      where: {
        id: In(dto.idsInOrder),
        episode: { id: episodeId},
      },
      relations: ['episode'],
    });

    if(pages.length !== dto.idsInOrder.length){
      throw new BadRequestException('Some pages do not belong to the episode');
    }

    for (let i = 0; i < pages.length; i++){
      const page = pages.find(p => p.id === dto.idsInOrder[i]);
      if(page) {
        page.order = i + 1;
      }
    }
    await this.pageRepository.save(pages);

    return await this.pageRepository.find({
      where: { episode: { id: episodeId} },
      order: { order: 'ASC' },
    })
  }

  async deletePage(id: number, username: string): Promise<void> {

    const page = await this.pageRepository.findOne({
      where: { id },
      relations: ['episode', 'episode.comic', 'episode.comic.user']
    });

    if(!page){
      throw new NotFoundException('Page not found');
    }
    const comic = page.episode.comic;
    
    console.log(`username: ${comic.user.username}`);
    if(!comic || comic.user.username !== username){
        throw new NotFoundException('Episode not found');
    }

    await this.pageRepository.delete(id);
  
    const pages = await this.pageRepository.find({
      where: { episode: { id: page.episode.id } },
      order: { order: 'ASC' }
    });
  
    for (let i = 0; i < pages.length; i++) {
      await this.pageRepository.update(pages[i].id, { order: i + 1 });
    }

    this.uploadService.deletePageFromCloudService(page.imageUrl);
  }
  
}
