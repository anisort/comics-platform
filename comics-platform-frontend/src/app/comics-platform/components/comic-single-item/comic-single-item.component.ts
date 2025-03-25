import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComicSingleItem } from '../../models/comic-single-item';
import { ComicsService } from '../../services/comics.service';

@Component({
  selector: 'app-comic-single-item',
  standalone: false,
  templateUrl: './comic-single-item.component.html',
  styleUrl: './comic-single-item.component.scss'
})
export class ComicSingleItemComponent implements OnInit{
  comicSingleItem!: ComicSingleItem;
  constructor(
    private comicsService: ComicsService,
    private route: ActivatedRoute,
    private router: Router
  ){}
  ngOnInit(): void {
    // Підписка на зміни параметрів маршруту
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id')); // Отримуємо параметр id
      if (id) {
        this.comicsService.getComicById(id).subscribe(data => {
          this.comicSingleItem = data; // Завантажуємо комікс за id
        });
      } else {
        this.router.navigate(['/']); // Якщо id не знайдено, переходимо на головну
      }
    });
  }
}
