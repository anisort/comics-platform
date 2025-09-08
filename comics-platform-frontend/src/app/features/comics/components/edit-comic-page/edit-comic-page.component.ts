import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComicsService } from '../../services/comics/comics.service';
import { ComicSingleItem } from '../../../../core/models/comic-single-item';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../../../core/validators/custom.validator';
import { map, of, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-comic-page',
  standalone: false,
  templateUrl: './edit-comic-page.component.html',
  styleUrl: './edit-comic-page.component.scss'
})
export class EditComicPageComponent implements OnInit, OnDestroy {

  comicSingleItem!: ComicSingleItem;
  updateForm!: FormGroup;
  isEditing = false;
  isLoading = false;
  errorMessage: string | null = null;
  coverImage!: File;
  coverImagePreview: string | ArrayBuffer | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private comicsService: ComicsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      map(params => Number(params.get('id'))),
      switchMap(id => {
        if (id) {
          return this.comicsService.checkAuthority(id).pipe(
            map(data => ({ id, isAuthor: data.isAuthor }))
          );
        } else {
          return of(null);
        }
      })
    ).subscribe(result => {
      if (!result) return;

      if (result.isAuthor) {
        this.getComicById(result.id);
      } else {
        void this.router.navigate(['/comics-platform/my-library']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getComicById(id: number): void {
    this.comicsService.getComicById(id).subscribe(comic => {
      if (comic) {
        this.comicSingleItem = comic;
        this.initForm();
      }
    });
  }

  initForm(): void {
    this.updateForm = new FormGroup({
      name: new FormControl(this.comicSingleItem.name, [Validators.required, Validators.minLength(3)], CustomValidator.uniqueComicNameValidator(this.comicsService, this.comicSingleItem.name)),
      description: new FormControl(this.comicSingleItem.description, [Validators.required, Validators.minLength(10)]),
      status: new FormControl(this.comicSingleItem.status, Validators.required),
      ageRating: new FormControl(this.comicSingleItem.ageRating, Validators.required),
      genres: new FormControl(this.comicSingleItem.genres, Validators.required)
    });

    this.coverImagePreview = this.comicSingleItem.coverUrl;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.coverImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.coverImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.initForm();
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('name', this.updateForm.get('name')?.value);
      formData.append('description', this.updateForm.get('description')?.value);
      formData.append('status', this.updateForm.get('status')?.value);
      formData.append('ageRating', this.updateForm.get('ageRating')?.value);
      this.updateForm.value.genres.forEach((genre: string) => formData.append('genres', genre));

      if (this.coverImage) {
        formData.append('newCoverImage', this.coverImage);
      }

      this.comicsService.updateComic(this.comicSingleItem.id, formData).subscribe({
        next: () => {
          this.getComicById(this.comicSingleItem.id);
          this.isEditing = false;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
