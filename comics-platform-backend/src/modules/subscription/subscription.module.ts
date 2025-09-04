import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SubscriptionController } from 'src/controllers/subscription/subscription.controller';
import { SubscriptionService } from 'src/services/subscription/subscription.service';
import { AuthModule } from '../auth/auth.module';
import { ComicsModule } from '../comics/comics.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [JwtModule, AuthModule, ComicsModule, UsersModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
