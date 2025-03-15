import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../entities/user.entity';
import { AuthController } from '../../controllers/auth/auth.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([User]), ConfigModule],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
