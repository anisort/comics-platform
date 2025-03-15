import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { IsUniqueConstraint } from './validators/is-unique-constraint.validator';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'comics-platform',
      entities: [User],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    ConfigModule.forRoot(), 
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint],
})
export class AppModule {}
