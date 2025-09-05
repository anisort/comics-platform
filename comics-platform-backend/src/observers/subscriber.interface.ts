import { User } from '../entities/user.entity';
import { NotificationType } from '../entities/notification.entity';

export interface NotificationContext {
  user: User;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  coverUrl?: string;
}

export const SUBSCRIBERS = 'SUBSCRIBERS';

export interface Subscriber {
  update(context: NotificationContext): Promise<void>;
}
