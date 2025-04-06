import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEpisodeDto } from 'src/dto/create-episode.dto';
import { Episode } from 'src/entities/episode.entity';
import { In, Repository } from 'typeorm';
import { ComicsService } from '../comics/comics.service';
import { ReorderDto } from 'src/dto/reorder.dto';
import { EpisodeItemDto } from 'src/dto/episode-item.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class EpisodesService {

    constructor(
        @InjectRepository(Episode)
        private episodeRepository: Repository<Episode>,
        private comicsService: ComicsService,
        private uploadService: UploadService,
    ){}

    async findByComic(comicId: number): Promise<EpisodeItemDto[]> {
        const episodes = await this.episodeRepository.find({
          where: { comic: { id: comicId } },
          order: { order: 'ASC' },
          relations: ['pages'],
        });
      
        return episodes.map((e) => ({
          id: e.id,
          name: e.name,
          order: e.order,
          created_at: e.created_at,
        }));
    }
      
    async createEpisode(createEpisodDto: CreateEpisodeDto, username: string): Promise<Episode> {

        const comic = await this.comicsService.findComicById(createEpisodDto.comicId);

        if(!comic || comic.user !== username){
            throw new NotFoundException('Comic not found');
        }

        const last = await this.episodeRepository.findOne({
          where: { comic: { id: createEpisodDto.comicId } },
          order: { order: 'DESC' }
        });
    
        const order = last ? last.order + 1 : 1;
    
        const episode = this.episodeRepository.create({
          name: createEpisodDto.name,
          order,
          comic: { id: createEpisodDto.comicId },
        });
    
        return await this.episodeRepository.save(episode);
    }

    async updateName(episodeId: number, name: string, username: string ): Promise<Episode | null> {
        const episode = await this.findById(episodeId);

        const comic = episode.comic;
        if(!comic || comic.user.username !== username){
            throw new NotFoundException('Episode not found');
        }

        await this.episodeRepository.update(episodeId, { name });
        return await this.episodeRepository.findOne({where: {id: episodeId}});
    }

    async reorder(dto: ReorderDto, username: string, comicId: number): Promise<EpisodeItemDto[]> {
        const comic = await this.comicsService.findComicById(comicId);
        if(!comic || comic.user !== username){
            throw new NotFoundException('Comic not found');
        }

        const episodes = await this.episodeRepository.find({
            where: {
                id: In(dto.idsInOrder),
                comic: { id: comicId },
            },
            relations: ['comic'],
        });
        
        if (episodes.length !== dto.idsInOrder.length) {
            throw new BadRequestException('Some episodes do not belong to the comic');
        }
        
        for (let i = 0; i < episodes.length; i++) {
            const episode = episodes.find(e => e.id === dto.idsInOrder[i]);
            if (episode) {
                episode.order = i + 1;
            }
        }
        await this.episodeRepository.save(episodes);

        return await this.episodeRepository.find({
            where: { comic: { id: comicId } },
            order: { order: 'ASC' },
        });
        
    }

    async delete(id: number, username: string): Promise<void> {

        const episode = await this.findById(id);

        if (!episode){
            throw new NotFoundException('Episode not found');
        }

        console.log(`username: ${username}`)

        const comic = episode.comic;
        if(!comic || comic.user.username !== username){
            throw new NotFoundException('Episode not found');
        }

        await this.episodeRepository.delete(id);
    
        const remaining = await this.episodeRepository.find({
          where: { comic: { id: episode.comic.id } },
          order: { order: 'ASC' },
        });
    
        for (let i = 0; i < remaining.length; i++) {
          await this.episodeRepository.update(remaining[i].id, { order: i + 1 });
        }

        const pageUrls = episode.pages.map(page => page.imageUrl);
        await this.uploadService.deletePagesForEpisode(pageUrls);

    }

    async findById(episodeId: number): Promise<Episode>{
        const episode = await this.episodeRepository.findOne({
            where: { id: episodeId },
            relations: ['comic', 'comic.user', 'pages'],
        });
        if(!episode){
            throw new NotFoundException('Episode not found');
        }
        return episode;
    }
      
}
