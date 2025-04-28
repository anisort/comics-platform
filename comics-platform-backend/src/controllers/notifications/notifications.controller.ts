import { Controller, Get, Patch, Param, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from 'src/services/notifications/notifications.service';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get()
  async getUserNotifications(@Request() req) {
    return await this.notificationService.getUserNotifications(req.user.userId);
  }

  @Patch(':id/read')
  async markNotificationAsRead(@Param('id') id: number, @Request() req) {
    return await this.notificationService.markAsRead(Number(id), req.user.userId);
  }

  @Patch('read-all')
  async markAllNotificationsAsRead(@Request() req) {
    return await this.notificationService.markAllAsRead(req.user.userId);
  }
}
