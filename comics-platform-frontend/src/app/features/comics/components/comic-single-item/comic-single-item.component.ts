import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComicSingleItem } from '../../../../core/models/comic-single-item';
import { ComicsService } from '../../services/comics/comics.service';
import {finalize, map, of, Subject, switchMap, takeUntil} from 'rxjs';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { SubscriptionsService } from '../../../subscriptions/services/subscriptions/subscriptions.service';

@Component({
  selector: 'app-comic-single-item',
  standalone: false,
  templateUrl: './comic-single-item.component.html',
  styleUrl: './comic-single-item.component.scss'
})
export class ComicSingleItemComponent implements OnInit, OnDestroy {
  comicSingleItem!: ComicSingleItem;
  errorMessage: string | null = null;
  isAuthenticated = false;
  isSubscribed = false;
  isAuthor = false;
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private comicsService: ComicsService,
    private authService: AuthService,
    private subscriptionService: SubscriptionsService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.loadComic();
  }

  private loadComic(): void {
    this.isLoading = true;

    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      map(params => Number(params.get('id'))),
      switchMap(id => id ? this.comicsService.getComicById(id) : of(null)),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (data) => {
        if (data) {
          this.comicSingleItem = data;
          const currentUsername = this.authService.getUsername();
          this.isAuthor = currentUsername === this.comicSingleItem.user;

          if (this.isAuthenticated && !this.isAuthor) {
            this.subscriptionService.checkSubscription(this.comicSingleItem.id).subscribe({
              next: (res) => {
                this.isSubscribed = res.isSubscribed;
              },
              error: () => {
                this.errorMessage = 'Failed to check subscription status';
              }
            });
          }
        } else {
          this.errorMessage = 'Comic not found';
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load comic';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubscribe(): void {
    if (this.comicSingleItem) {
      this.isLoading = true;
      this.subscriptionService.subscribe(this.comicSingleItem.id).subscribe({
        next: () => {
          this.isSubscribed = true;
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to subscribe';
          this.isLoading = false;
        }
      });
    }
  }

  onUnsubscribe(): void {
    if (this.comicSingleItem) {
      this.isLoading = true;
      this.subscriptionService.unsubscribe(this.comicSingleItem.id).subscribe({
        next: () => {
          this.isSubscribed = false;
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to unsubscribe';
          this.isLoading = false;
        }
      });
    }
  }
}
