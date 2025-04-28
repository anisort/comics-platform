import { Component, OnInit } from '@angular/core';
import { ComicItem } from '../../models/comic-item';
import { ComicsService } from '../../services/comics.service';
import { Router } from '@angular/router';
import { SubscriptionsService } from '../../services/subscriptions.service';

@Component({
  selector: 'app-mylibrary-page',
  standalone: false,
  templateUrl: './mylibrary-page.component.html',
  styleUrl: './mylibrary-page.component.scss'
})
export class MyLibraryPageComponent implements OnInit {
  comics: ComicItem[] = [];
  subscribedComics: ComicItem[] = [];
  isLoading: boolean = false;

  constructor(
    private comicsService: ComicsService,
    private subscriptionService: SubscriptionsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadComics();
    this.loadSubscribedComics();
  }

  loadComics() {
    this.isLoading = true;
    this.comicsService.getComicsByCurrentUser().subscribe({
      next: data => {
        this.comics = data;
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        if (err.status === 401) {
          this.router.navigate(['/comics-platform/login']);
        } else {
          console.error('Error loading comics:', err);
        }
      }
    });
  }

  loadSubscribedComics() {
    this.subscriptionService.getMySubscriptions().subscribe({
      next: data => {
        this.subscribedComics = data;
      },
      error: err => {
        if (err.status === 401) {
          this.router.navigate(['/comics-platform/login']);
        } else {
          console.error('Error loading subscriptions:', err);
        }
      }
    });
  }

  onAddNewComic() {
    this.router.navigate(['comics-platform/add-comic']);
  }

  onComicDeleted(id: number) {
    this.isLoading = true;
    this.comicsService.deleteComic(id).subscribe({
      next: () => {
        this.loadComics();
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        if (err.status === 401) {
          this.router.navigate(['/comics-platform/login']);
        } else {
          console.error('Error comics deleting:', err);
        }
      }
    });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}

