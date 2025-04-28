export interface Notification {
    id: number;
    title: string;
    message: string;
    link: string | null;
    notificationCoverUrl: string | null;
    isRead: boolean;
    createdAt: string;
}
  