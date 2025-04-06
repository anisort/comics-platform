import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodesController } from 'src/controllers/episodes/episodes.controller';
import { Episode } from 'src/entities/episode.entity';
import { EpisodesService } from 'src/services/episodes/episodes.service';
import { AuthModule } from '../auth/auth.module';
import { ComicsModule } from '../comics/comics.module';
import { UploadModule } from '../upload/upload.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Episode]),
        JwtModule,
        AuthModule,
        ComicsModule,
        UploadModule
    ],
    controllers: [EpisodesController],
    providers: [EpisodesService],
    exports: [EpisodesService]
})
export class EpisodesModule {
}
