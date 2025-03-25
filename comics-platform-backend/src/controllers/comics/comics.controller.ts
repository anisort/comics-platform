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

  @Get()
  async findAll(
    @Query() filters: { [key: string]: string },
    @Query('page') page?: number, 
    @Query('limit') limit?: number,
  ): Promise<{ comics: ComicItemDto[], total: number, totalPages?: number }> {
    return await this.comicsService.findAllComics(filters, page, limit);
  }
  
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ComicItemSingleDto | {errorMessage}> {
    return await this.comicsService.findComicById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('coverImage'))
  async create(@Body() createComicDto: CreateComicDto, @UploadedFile() coverImage: Express.Multer.File) {
    return await this.comicsService.createComic(createComicDto, coverImage);
  }
  
  @UseGuards(AuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('newCoverImage'))
  async update(@Param('id') id: number, @Body() updateComicDto: UpdateComicDto, @UploadedFile() newCoverImage?: Express.Multer.File,){
    return await this.comicsService.updateComic(id, updateComicDto, newCoverImage);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number){
    await this.comicsService.deleteComic(id);
  }

  @UseGuards(AuthGuard)
  @Get("/my-library/:username")
  async getUserComics(@Param('username') currentUsername: string){
    return await this.comicsService.getComicsByAuthor(currentUsername);
  }

}



  // @Get()
  // async findAll(): Promise<ComicItemDto[] | {message}> {
  //   return this.comicsService.findAllComics();
  // }

  // @Get()
  // async findAll(@Query() filters: { [key: string]: string }): Promise<ComicItemDto[] | { message: string }> {
  //   return await this.comicsService.findAllComics(filters);
  // }


  // @Get()
  // async findAll(
  //   @Query('page') page: number = 1, 
  //   @Query('limit') limit: number = 10,
  //   @Query() filters: { [key: string]: string }
  // ): Promise<{ comics: ComicItemDto[], total: number }> {
  //   return await this.comicsService.findAllComics(filters, page, limit);
  // }