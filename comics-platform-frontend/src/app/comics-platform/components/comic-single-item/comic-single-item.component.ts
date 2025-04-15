import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComicSingleItem } from '../../models/comic-single-item';
import { ComicsService } from '../../services/comics.service';
import { map, of, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-comic-single-item',
  standalone: false,
  templateUrl: './comic-single-item.component.html',
  styleUrl: './comic-single-item.component.scss'
})
export class ComicSingleItemComponent implements OnInit, OnDestroy{
  comicSingleItem!: ComicSingleItem;
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();
  constructor(
    private comicsService: ComicsService,
    private route: ActivatedRoute,
    private router: Router
  ){}
  // ngOnInit(): void {
  //   this.route.paramMap.subscribe(params => {
  //     const id = Number(params.get('id'));
  //     if (id) {
  //       this.comicsService.getComicById(id).subscribe(data => {
  //         if(data){
  //           this.comicSingleItem = data;
  //         }
  //         else{
  //           this.errorMessage = 'Comic not found'
  //         }
  //       });
  //     } else {
  //       this.router.navigate(['/']);
  //     }
  //   });
  // }


  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      map(params => Number(params.get('id'))),
      switchMap(id => {
        if (id) {
          return this.comicsService.getComicById(id);
        } else {
          this.router.navigate(['/']);
          return of(null);
        }
      })
    ).subscribe(data => {
      if (data) {
        this.comicSingleItem = data;
      } else {
        this.errorMessage = 'Comic not found';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
}
