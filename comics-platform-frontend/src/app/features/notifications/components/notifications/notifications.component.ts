import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { Notification } from '../../../../core/models/notification';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: false,
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  showDropdown = false;
  private pollingSubscription: Subscription | undefined;

  constructor(private notificationsService: NotificationsService) { }

  ngOnInit() {
    this.loadNotifications();
    this.startPolling()
  }

  loadNotifications() {
    this.notificationsService.getNotifications().subscribe(data => {
      this.notifications = data;
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  markAsRead(notificationId: number) {
    this.notificationsService.markAsRead(notificationId).subscribe(() => {
      this.loadNotifications();
    });
  }

  markAllAsRead() {
    this.notificationsService.markAllAsRead().subscribe(() => {
      this.loadNotifications();
    });
  }

  hasUnread(): boolean {
    return this.notifications.some(n => !n.isRead);
  }

  handleNotificationClick(event: MouseEvent, notificationId: number, link: string) {
    event.preventDefault();
    this.markAsRead(notificationId);
    setTimeout(() => {
      window.open(link, '_blank');
    }, 300);
  }

  startPolling() {
    this.pollingSubscription = interval(10000)
      .subscribe(() => this.loadNotifications());
  }

  ngOnDestroy() {
    this.pollingSubscription?.unsubscribe();
  }

}
