import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ComicItem } from '../../models/comic-item';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/comics-platform/login']);
  }

  onComicSelected(comicItem: ComicItem) {
    this.router.navigate(['comics-platform/comic-detail-info', comicItem.id]).then(() => {
      window.location.reload();
    });
  }
  
  
  
  
}