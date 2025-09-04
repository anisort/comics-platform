import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Put,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { ComicsService } from '../../services/comics/comics.service';
import { CreateComicDto } from '../../dto/create-comic.dto';
import { ComicItemDto } from '../../dto/comic.item.dto';
import { ComicItemSingleDto } from '../../dto/comic.single-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guards';
import { UpdateComicDto } from 'src/dto/update-comic.dto';
import { RequestWithUser } from '../../utils/user-payload';

@Controller('comics')
export class ComicsController {
  constructor(private readonly comicsService: ComicsService) {}

  @Get()
  async findAll(
    @Query() filters: { [key: string]: string },
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<{ comics: ComicItemDto[]; total: number; totalPages?: number }> {
    return await this.comicsService.findAllComics(page, limit);
  }

  @Get('home')
  async getTopByLatest(): Promise<ComicItemDto[]> {
    return this.comicsService.findTopComicsByLatestEpisode();
  }

  @Get('/search')
  async searchComics(@Query('query') query: string): Promise<ComicItemDto[]> {
    return await this.comicsService.searchComics(query);
  }

  @Get('/own-comics')
  @UseGuards(AuthGuard)
  async getUserComics(@Request() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.comicsService.getComicsByUserId(userId);
  }

  @Get('check-name')
  async checkComicName(@Query('name') name: string) {
    const exists = await this.comicsService.isNameTaken(name);
    return { exists };
  }

  @UseGuards(AuthGuard)
  @Get('check-authority/:id')
  async isAuthor(@Param('id') id: number, @Request() req: RequestWithUser) {
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
  async create(
    @Body() createComicDto: CreateComicDto,
    @UploadedFile() coverImage: Express.Multer.File,
    @Request() req: RequestWithUser,
  ) {
    const username = req.user.username;
    return await this.comicsService.createComic(
      createComicDto,
      coverImage,
      username,
    );
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('newCoverImage'))
  async update(
    @Param('id') id: number,
    @Body() updateComicDto: UpdateComicDto,
    @Request() req: RequestWithUser,
    @UploadedFile() newCoverImage?: Express.Multer.File,
  ) {
    const username = req.user.username;
    return await this.comicsService.updateComic(
      id,
      updateComicDto,
      username,
      newCoverImage,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @Request() req: RequestWithUser) {
    const username = req.user.username;
    await this.comicsService.deleteComic(id, username);
  }
}
