import { Body, Controller, Delete, Get, Param, Post, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { PagesService } from 'src/services/pages/pages.service';
import { ReorderDto } from 'src/dto/reorder.dto';

@Controller('pages')
export class PagesController {

    constructor(private readonly pagesService: PagesService){}

    @Get('/episode/:episodeId')
    async getPages(@Param('episodeId') episodeId: number, @Query('page') page: number = 1) {
        return this.pagesService.paginatePages(episodeId, page);
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    @Post(':episodeId')
    async uploadPage(
        @Param('episodeId') episodeId: number,
        @UploadedFile() image: Express.Multer.File,
        @Request() req
    ) {
        const username = req.user.username;
        return await this.pagesService.createPageWithUpload(episodeId, image, username);
    }

    @UseGuards(AuthGuard)
    @Post('/reorder/:episodeId')
    async reorderPages(@Param('episodeId') episodeId: number, @Body() dto: ReorderDto, @Request() req) {
        const username = req.user.username;
        return await this.pagesService.reorder(dto, username, episodeId);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async deletePage(@Param('id') id: number, @Request() req){
        const username = req.user.username;
        return await this.pagesService.deletePage(id, username);
    }


}
