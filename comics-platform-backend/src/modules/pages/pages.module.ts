import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagesController } from 'src/controllers/pages/pages.controller';
import { Page } from 'src/entities/page.entity';
import { PagesService } from 'src/services/pages/pages.service';
import { UploadModule } from '../upload/upload.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { EpisodesModule } from '../episodes/episodes.module';
import { ComicsModule } from '../comics/comics.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        TypeOrmModule.forFeature([Page]),
        MulterModule.register({
            dest: '../../../uploads'
        }),
        UploadModule,
        JwtModule,
        AuthModule,
        EpisodesModule,
    ],
    controllers: [PagesController],
    providers: [PagesService]
})
export class PagesModule {}
