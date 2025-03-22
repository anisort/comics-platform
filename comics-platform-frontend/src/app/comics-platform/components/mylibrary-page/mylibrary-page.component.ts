import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ComicItem } from '../../models/comic-item';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mylibrary-page',
  standalone: false,
  templateUrl: './mylibrary-page.component.html',
  styleUrl: './mylibrary-page.component.scss'
})
export class MyLibraryPageComponent implements OnInit {
  comics: ComicItem[] = [];
  
  constructor(private http: HttpClient, private authService: AuthService) {}
  

  ngOnInit() {
    const username = this.authService.getUsername();
    
    if (username) {
      const params = new HttpParams().set('username', username);
  
      this.http.get<ComicItem[]>('http://localhost:3000/api/comics', { params })
        .subscribe((data) => {
          this.comics = data;
        });
    } else {
      console.log('User is not logged in');
    }
  }
  
}
