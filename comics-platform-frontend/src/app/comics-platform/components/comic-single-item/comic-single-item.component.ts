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
  errorMessage: string | null = null;
  constructor(
    private comicsService: ComicsService,
    private route: ActivatedRoute,
    private router: Router
  ){}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.comicsService.getComicById(id).subscribe(data => {
          if(data){
            this.comicSingleItem = data;
          }
          else{
            this.errorMessage = 'Comic not found'
          }
        });
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
