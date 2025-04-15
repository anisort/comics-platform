import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagesService } from '../../services/pages.service';
import { EpisodesService } from '../../services/episodes.service';
import { EpisodeItem } from '../../models/episode-item';
import { combineLatest, map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-episode-page-viewer',
  standalone: false,
  templateUrl: './episode-page-viewer.component.html',
  styleUrl: './episode-page-viewer.component.scss'
})
export class EpisodePageViewerComponent implements OnInit, OnDestroy {
  comicId!: number;
  episodeId!: number;
  currentPage: number = 1;
  totalPages: number = 1;
  pageImageUrl: string = '';
  episodes: EpisodeItem[] = [];
  episodeName: string = '';
  isLoading = false;
  errorMessage: string = '';
  noAvailablePages: string  = '';
  private destroy$ = new Subject<void>();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pagesService: PagesService,
    private episodesService: EpisodesService
  ) {}

  // ngOnInit(): void {
  //   this.route.paramMap.subscribe(params => {
  //     this.episodeId = Number(params.get('episodeId'));
  
  //     this.route.queryParamMap.subscribe(queryParams => {
  //       this.currentPage = Number(queryParams.get('page')) || 1;
  //       this.loadPage();
  //     });
  
  //     this.loadEpisodeMeta();
  //   });
  // }

  ngOnInit(): void {
    combineLatest([
      this.route.paramMap.pipe(map(params => Number(params.get('episodeId')))),
      this.route.queryParamMap.pipe(map(query => Number(query.get('page')) || 1))
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([episodeId, page]) => {
      this.episodeId = episodeId;
      this.currentPage = page;

      this.loadEpisodeMeta(); // або один раз, або обгорни логікою, щоб не викликалась зайвий раз
      this.loadPage();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadEpisodeMeta() {
    this.isLoading = true;
    this.episodesService.getEpisodeMeta(this.episodeId).subscribe({
      next: (meta) => {
        this.comicId = meta.comicId;
        this.episodeName = meta.episodeName;
        this.loadEpisodes();
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.errorMessage = 'Episode not found';
        } else {
          this.errorMessage = 'An error occurred while loading the episode';
        }
        console.error('Error loading episode meta:', err);
      }
    });
  }
  
  loadEpisodes() {
    this.isLoading = true;
    this.episodesService.getEpisodesByComic(this.comicId).subscribe({
      next: (episodes) => {
        this.episodes = episodes;
    
        const current = this.episodes.find(e => e.id === this.episodeId);
        this.episodeName = current?.name || 'Episode';
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = 'Error loading episodes. Please try again later.';
        console.error('Error loading episodes:', err);
      }
    });
  }

  loadPage() {
    this.isLoading = true;
    this.pagesService.getPagesPublic(this.episodeId, this.currentPage).subscribe({
      next: (res) => {
        if (res.page && res.page.imageUrl) {
          this.pageImageUrl = res.page.imageUrl;
          this.totalPages = res.totalPages;
          this.currentPage = res.currentPage;
          this.errorMessage = '';  // Якщо сторінка є, очищаємо помилку
        } else {
          this.pageImageUrl = '';  // Якщо сторінки немає
          this.totalPages = 1;
          this.noAvailablePages = 'No pages available for this episode';
        }
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        if (err.status === 404) {
          this.errorMessage = 'Page not found';
        } else {
          this.errorMessage = 'An error occurred while loading the page';
        }
        console.error('Error loading page:', err);
      }
    });
  }
  

  goToPage(page: number) {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;
    this.loadPage();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    } else {
      this.goToNextEpisode();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    } else {
      this.goToPreviousEpisode();
    }
  }

  goToNextEpisode() {
    const currentIndex = this.episodes.findIndex(e => e.id === this.episodeId);
    const nextEpisode = this.episodes[currentIndex + 1];
    if (nextEpisode) {
      this.router.navigate(['/comics-platform/read', nextEpisode.id], {
        queryParams: { page: 1 }
      });
    } else {
      this.router.navigate(['comics-platform/comic-detail-info', this.comicId]);
    }
  }

  goToPreviousEpisode() {
    const currentIndex = this.episodes.findIndex(e => e.id === this.episodeId);
    const prevEpisode = this.episodes[currentIndex - 1];
    if (prevEpisode) {
      this.router.navigate(['/comics-platform/read', prevEpisode.id], {
        queryParams: { page: 1 }
      });
    }else {
    this.router.navigate(['comics-platform/comic-detail-info', this.comicId]);
  }
    
  }
}
