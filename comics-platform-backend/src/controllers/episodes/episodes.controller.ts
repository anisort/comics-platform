import { Body, Controller, Get, Param, Post, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guards';
import { CreateEpisodeDto } from 'src/dto/create-episode.dto';
import { ReorderDto } from 'src/dto/reorder.dto';
import { EpisodesService } from 'src/services/episodes/episodes.service';

@Controller('episodes')
export class EpisodesController {

    constructor(private readonly episodesService: EpisodesService){}

    @Get('/comic/:comicId')
    async getEpisodesByComic(@Param('comicId') comicId: number) {
        return await this.episodesService.findByComic(comicId);
    }

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() createEpisodeDto: CreateEpisodeDto, @Request() req) {
        const username = req.user.username;
        return await this.episodesService.createEpisode(createEpisodeDto, username);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    async updateName(@Param('id') id: number, @Body('name') name: string, @Request() req) {
        const username = req.user.username;
        return await this.episodesService.updateName(+id, name, username);
    }

    @UseGuards(AuthGuard)
    @Post('reorder/:comicId')
    async reorder(@Param('comicId') comicId: number, @Body() dto: ReorderDto, @Request() req) {
        const username = req.user.username;
        return await this.episodesService.reorder(dto, username, comicId);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: number, @Request() req) {
        const username = req.user.username;
        return this.episodesService.delete(+id, username);
    }
}
