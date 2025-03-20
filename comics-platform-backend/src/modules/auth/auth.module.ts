import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../entities/user.entity';
import { AuthController } from '../../controllers/auth/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/controllers/auth/strategies/local.strategy';
import { PassportAuthController } from 'src/controllers/auth/passport-auth.controller';
import { JwtStrategy } from 'src/controllers/auth/strategies/jwt.strategy';

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
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController, PassportAuthController],
})
export class AuthModule {}
