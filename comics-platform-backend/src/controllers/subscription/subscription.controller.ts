import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { SubscriptionService } from 'src/services/subscription/subscription.service';
import { AuthGuard } from 'src/guards/auth.guards';
import { RequestWithUser } from '../../utils/user-payload';

@Controller('subscriptions')
@UseGuards(AuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post(':comicId')
  async subscribe(
    @Param('comicId') comicId: number,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    await this.subscriptionService.subscribe(userId, comicId);
  }

  @Delete(':comicId')
  async unsubscribe(
    @Param('comicId') comicId: number,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    await this.subscriptionService.unsubscribe(userId, comicId);
  }

  @Get('/my-list')
  async getMySubscriptions(@Request() req: RequestWithUser) {
    const userId = req.user.userId;
    return await this.subscriptionService.getUserSubscriptions(userId);
  }

  @Get(':comicId/check')
  async checkSubscription(
    @Param('comicId') comicId: number,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    const isSubscribed = await this.subscriptionService.isSubscribed(
      userId,
      comicId,
    );
    return { isSubscribed };
  }
}
