import { Component, OnInit } from '@angular/core';
import { ComicsService } from '../../services/comics/comics.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateUpdateComic } from '../../../../core/models/create-update-comic';
import { Router } from '@angular/router';
import { CustomValidator } from '../../../../core/validators/custom.validator';

@Component({
  selector: 'app-create-comic',
  standalone: false,
  templateUrl: './create-comic.component.html',
  styleUrl: './create-comic.component.scss'
})
export class CreateComicComponent implements OnInit {

  constructor(private comicsService: ComicsService, private router: Router) { }
  isLoading = false;
  createForm!: FormGroup;
  coverImage!: File;
  coverImagePreview: string | ArrayBuffer | null = null;
  coverImageError: string | null = null;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.createForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)], CustomValidator.uniqueComicNameValidator(this.comicsService)),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      status: new FormControl('', Validators.required),
      ageRating: new FormControl('', Validators.required),
      genres: new FormControl([], Validators.required)
    })
  }

  onFileChange(event: any): void {
    const file: File = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        this.coverImageError = 'Only JPG, JPEG, or PNG files are allowed.';
        this.coverImage = undefined!;
        this.coverImagePreview = null;
        return;
      }

      this.coverImageError = null;
      this.coverImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.coverImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.createForm.valid && this.coverImage) {
      this.isLoading = true;
      const comic: CreateUpdateComic = this.createForm.value;
      console.log(comic)
      const formData = new FormData();

      formData.append('name', this.createForm.get('name')?.value);
      formData.append('description', this.createForm.get('description')?.value);
      formData.append('status', this.createForm.get('status')?.value);
      formData.append('ageRating', this.createForm.get('ageRating')?.value);
      this.createForm.value.genres.forEach((genre: string) => formData.append('genres', genre));
      formData.append('coverImage', this.coverImage);
      formData.forEach((value, key) => console.log(key, value));

      this.comicsService.createComic(formData).subscribe({
        next: () => {
          this.createForm.reset();
          this.coverImage = undefined!;
          this.coverImagePreview = null;
          this.isLoading = false;
          void this.router.navigate(['comics/my-library']);
        },
        error: () => {
          this.isLoading = false;
        }
      });

    } else {
      console.log('Form is disabled')
    }
  }
}
