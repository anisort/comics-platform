import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PagesService } from '../../services/pages.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PageItem } from '../../models/page-item';
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-page-list',
  standalone: false,
  templateUrl: './edit-page-list.component.html',
  styleUrls: ['./edit-page-list.component.scss']
})
export class EditPageListComponent {
  pages: PageItem[] = [];
  isLoading = false;
  isReorderChanged = false;
  selectedFiles: File[] = [];
  fileError: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { episodeId: number, episodeName: string },
    private pagesService: PagesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPages();
  }

  loadPages() {
    this.isLoading = true;
    this.pagesService.getPagesForEdit(this.data.episodeId).subscribe({
      next: (data) => {
        this.pages = data;
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        if (err.status === 401) {
          this.router.navigate(['/comics-platform/login']);
        } else {
          console.error('Error loading:', err);
        }
      }
    });
  }

  onDeletePage(pageId: number) {
    this.isLoading = true;
    this.pagesService.deletePage(pageId).subscribe({
      next: () => {
        this.loadPages();
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        if (err.status === 401) {
          this.router.navigate(['/comics-platform/login']);
        } else {
          console.error('Error deleting:', err);
        }
      }
    });
  }

  onFilesSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.selectedFiles = Array.from(files);
      this.validateFiles();
    }
  }

  validateFiles() {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    this.fileError = null;

    for (let file of this.selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        this.fileError = 'Only JPG, JPEG, or PNG files are allowed.';
        return;
      }
    }
  }

  addPages() {
    this.isLoading = true;
    this.pagesService.uploadPages(this.data.episodeId, this.selectedFiles).subscribe({
      next: () => {
        this.loadPages();
        this.selectedFiles = [];
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        if (err.status === 401) {
          this.router.navigate(['/comics-platform/login']);
        } else {
          console.error('Error adding:', err);
        }
      }
    });
  }

  drop(event: CdkDragDrop<PageItem[]>) {
    moveItemInArray(this.pages, event.previousIndex, event.currentIndex);
    this.isReorderChanged = true;
  }

  saveOrder() {
    this.isLoading = true;
    const newOrder = this.pages.map(p => p.id);
    this.pagesService.reorderPages(this.data.episodeId, newOrder).subscribe({
      next: () => {
        this.isReorderChanged = false;
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        if (err.status === 401) {
          this.router.navigate(['/comics-platform/login']);
        } else {
          console.error('Error saving order:', err);
        }
      }

    });
  }
}
