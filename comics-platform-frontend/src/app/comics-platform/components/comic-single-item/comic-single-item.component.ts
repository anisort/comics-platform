import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComicSingleItem } from '../../models/comic-single-item';
import { ComicsService } from '../../services/comics.service';
import { map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SubscriptionsService } from '../../services/subscriptions.service';

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
  private destroy$ = new Subject<void>();

  constructor(
    private comicsService: ComicsService,
    private authService: AuthService,
    private subscriptionService: SubscriptionsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();

    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      map(params => Number(params.get('id'))),
      switchMap(id => {
        if (id) {
          return this.comicsService.getComicById(id);
        } else {
          this.router.navigate(['/']);
          return of(null);
        }
      })
    ).subscribe(data => {
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
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubscribe(): void {
    if (this.comicSingleItem) {
      this.subscriptionService.subscribe(this.comicSingleItem.id).subscribe({
        next: () => {
          this.isSubscribed = true;
        },
        error: () => {
          this.errorMessage = 'Failed to subscribe';
        }
      });
    }
  }

  onUnsubscribe(): void {
    if (this.comicSingleItem) {
      this.subscriptionService.unsubscribe(this.comicSingleItem.id).subscribe({
        next: () => {
          this.isSubscribed = false;
        },
        error: () => {
          this.errorMessage = 'Failed to unsubscribe';
        }
      });
    }
  }
}
