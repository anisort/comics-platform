import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComicsService } from '../../services/comics.service';
import { ComicSingleItem } from '../../models/comic-single-item';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../validators/custom.validator';

@Component({
  selector: 'app-edit-comic-page',
  standalone: false,
  templateUrl: './edit-comic-page.component.html',
  styleUrl: './edit-comic-page.component.scss'
})
export class EditComicPageComponent implements OnInit {

  comicSingleItem!: ComicSingleItem;
  updateForm!: FormGroup;
  isEditing = false;
  isLoading = false;
  errorMessage: string | null = null;
  coverImage!: File;
  coverImagePreview: string | ArrayBuffer | null = null;

  constructor(
    private comicsService: ComicsService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.comicsService.checkAuthority(id).subscribe(data => {
          if (data.isAuthor) {
            this.getComicById(id);
          } else {
            this.router.navigate(['/comics-platform/my-library']);
          }
        });
      }
    });
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
    this.initForm(); // відновлює початкові значення
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
        error: err => {
          this.isLoading = false;
          if (err.status === 401) {
            this.router.navigate(['/comics-platform/login']);
          }
        }
      });
    }
  }
}
