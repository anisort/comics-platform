export interface NotificationContext {
  user: any;
  title: string;
  message: string;
  type: any;
  link?: string;
  coverUrl?: string;
}
  
export interface Subscriber {
  update(context: NotificationContext): Promise<void>;
}