import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../entities/user.entity';
import { AuthController } from '../../controllers/auth/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), 
        ConfigModule,
        JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
        }),
        }),
        UsersModule,
        PassportModule
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [JwtModule],
})
export class AuthModule {}
