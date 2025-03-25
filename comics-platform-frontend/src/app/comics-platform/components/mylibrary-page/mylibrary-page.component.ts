import { Component, OnInit } from '@angular/core';
import { ComicItem } from '../../models/comic-item';
import { AuthService } from '../../services/auth.service';
import { ComicsService } from '../../services/comics.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mylibrary-page',
  standalone: false,
  templateUrl: './mylibrary-page.component.html',
  styleUrl: './mylibrary-page.component.scss'
})
export class MyLibraryPageComponent implements OnInit {
  comics: ComicItem[] = [];
  
  constructor(private authService: AuthService, private comicsService: ComicsService, private router: Router) {}

  ngOnInit() {
    const username = this.authService.getUsername();
    if (username) {
      this.comicsService.getComicsByUsername(username).subscribe((data) => {
        this.comics = data;
      })
    } else {
      console.log('User is not logged in');
    }
  }

  onClick(){
    this.router.navigate(['comics-platform/add-comic']);
  }
  
}
