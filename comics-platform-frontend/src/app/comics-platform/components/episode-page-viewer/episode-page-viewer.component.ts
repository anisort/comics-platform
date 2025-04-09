import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagesService } from '../../services/pages.service';
import { EpisodesService } from '../../services/episodes.service';
import { EpisodeItem } from '../../models/episode-item';

@Component({
  selector: 'app-episode-page-viewer',
  standalone: false,
  templateUrl: './episode-page-viewer.component.html',
  styleUrl: './episode-page-viewer.component.scss'
})
export class EpisodePageViewerComponent implements OnInit {
  comicId!: number;
  episodeId!: number;
  currentPage: number = 1;
  totalPages: number = 1;
  pageImageUrl: string = '';
  episodes: EpisodeItem[] = [];
  episodeName: string = '';
  isLoading = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pagesService: PagesService,
    private episodesService: EpisodesService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.comicId = Number(params.get('comicId'));
      this.episodeId = Number(params.get('episodeId'));
  
      this.route.queryParamMap.subscribe(queryParams => {
        this.currentPage = Number(queryParams.get('page')) || 1;
        this.loadPage();
      });
  
      this.loadEpisodes();
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
        console.error('Error loading episodes:', err);
      }
    });
  }
  

  loadPage() {
    this.isLoading = true;
    this.pagesService.getPagesPublic(this.episodeId, this.currentPage).subscribe({
      next: (res) => {
        this.pageImageUrl = res.page.imageUrl;
        this.totalPages = res.totalPages;
        this.currentPage = res.currentPage;
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        console.error('Error loading pages:', err);
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
      this.router.navigate(['/comics-platform/read', this.comicId, nextEpisode.id], {
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
      this.router.navigate(['/comics-platform/read', this.comicId, prevEpisode.id], {
        queryParams: { page: 1 }
      });
    }else {
    this.router.navigate(['comics-platform/comic-detail-info', this.comicId]);
  }
    
  }
}
