import { Controller, Post, Body, Param, Get, UploadedFile, UseInterceptors, UseGuards, Put, Delete, Query, Req, Request } from '@nestjs/common';
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
    @Query('page') page: number, 
    @Query('limit') limit: number,
  ): Promise<{ comics: ComicItemDto[], total: number, totalPages?: number }> {
    return await this.comicsService.findAllComics(filters, page, limit);
  }

  @Get('/search')
  async searchComics(@Query('query') query: string): Promise<ComicItemDto[]> {
    return await this.comicsService.searchComics(query);
  }

  @UseGuards(AuthGuard)
  @Get("/my-library")
  async getUserComics(@Request() req){
    //console.log(req.user.username)
    return await this.comicsService.getComicsByUsername(req.user.username);
  }

  @Get('check-name')
  async checkComicName(@Query('name') name: string) {
    const exists = await this.comicsService.isNameTaken(name);
    return { exists };
  }
  
  @UseGuards(AuthGuard)
  @Get('check-authority/:id')
  async isAuthor(@Param('id') id: number, @Request() req) {
    const username = req.user.username;
    return await this.comicsService.isAuthor(id, username);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ComicItemSingleDto | null> {
    return await this.comicsService.findComicById(id);
  }
  
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('coverImage'))
  async create(@Body() createComicDto: CreateComicDto, @UploadedFile() coverImage: Express.Multer.File, @Request() req) {
    const username = req.user.username;
    return await this.comicsService.createComic(createComicDto, coverImage, username);
  }
  
  @UseGuards(AuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('newCoverImage'))
  async update(@Param('id') id: number, @Body() updateComicDto: UpdateComicDto,  @Request() req, @UploadedFile() newCoverImage?: Express.Multer.File,){
    const username = req.user.username;
    return await this.comicsService.updateComic(id, updateComicDto, username, newCoverImage);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @Request() req){
    const username = req.user.username;
    await this.comicsService.deleteComic(id, username);
  }

}