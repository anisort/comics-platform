import { Controller, Post, Body, Param, Get, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ComicsService } from '../../services/comics/comics.service';
import { ComicCreateDto } from '../../dto/comic.create.dto';
import { ComicItemDto } from '../../dto/comic.item.dto';
import { ComicItemSingleDto } from '../../dto/comic.single-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('comics')
export class ComicsController {
  constructor(private readonly comicsService: ComicsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('coverImage'))
  async create(
    @Body() createComicDto: ComicCreateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.comicsService.createComic(createComicDto, file); // 1 - это пример ID пользователя
  }

  @Get()
  async findAll(): Promise<ComicItemDto[]> {
    return this.comicsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ComicItemSingleDto> {
    return this.comicsService.findOne(id);
  }
}