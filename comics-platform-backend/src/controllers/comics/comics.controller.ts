import { Controller, Post, Body, Param, Get, UploadedFile, UseInterceptors, UseGuards, Put, Delete, Query } from '@nestjs/common';
import { ComicsService } from '../../services/comics/comics.service';
import { CreateComicDto } from '../../dto/create-comic.dto';
import { ComicItemDto } from '../../dto/comic.item.dto';
import { ComicItemSingleDto } from '../../dto/comic.single-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guards';
import { UpdateComicDto } from 'src/dto/update-comic.dto';

@Controller('comics')
export class ComicsController {
  constructor(private readonly comicsService: ComicsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('coverImage'))
  async create(@Body() createComicDto: CreateComicDto, @UploadedFile() coverImage: Express.Multer.File) {
    return this.comicsService.createComic(createComicDto, coverImage);
  }

  // @Get()
  // async findAll(): Promise<ComicItemDto[] | {message}> {
  //   return this.comicsService.findAllComics();
  // }

  @Get()
  async findAll(@Query() filters: { [key: string]: string }): Promise<ComicItemDto[] | { message: string }> {
    return this.comicsService.findAllComics(filters);
  }


  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ComicItemSingleDto | {errorMessage}> {
    return this.comicsService.findComicById(id);
  }
  
  @UseGuards(AuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('newCoverImage'))
  async update(@Param('id') id: number, @Body() updateComicDto: UpdateComicDto, @UploadedFile() newCoverImage?: Express.Multer.File,){
    return this.comicsService.updateComic(id, updateComicDto, newCoverImage);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number){
    this.comicsService.deleteComic(id);
  }

  // @Get('me')
  // async getUserComics(@Query('username') currentUsername: string){
  //   return this.comicsService.getComicsByAuthor(currentUsername);
  // }
}