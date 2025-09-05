import { Component, OnInit } from '@angular/core';
import { ComicItem } from '../../../../core/models/comic-item';
import { ComicsService } from '../../services/comics/comics.service';
import { Router } from '@angular/router';
import { SubscriptionsService } from '../../../subscriptions/services/subscriptions/subscriptions.service';

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
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadSubscribedComics() {
    this.isLoading = true;
    this.subscriptionService.getMySubscriptions().subscribe({
      next: data => {
        this.subscribedComics = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onAddNewComic() {
    this.router.navigate(['comics/add-comic']);
  }

  onComicDeleted(id: number) {
    this.isLoading = true;
    this.comicsService.deleteComic(id).subscribe({
      next: () => {
        this.loadComics();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
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

