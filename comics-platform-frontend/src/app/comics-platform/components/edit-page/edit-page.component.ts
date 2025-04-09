import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageItem } from '../../models/page-item';

@Component({
  selector: 'app-edit-page',
  standalone: false,
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.scss'
})
export class EditPageComponent {
  @Input() page!: PageItem;
  @Input() index!: number;

  @Output() deletePage = new EventEmitter<number>();

  confirmDelete(): void {
    if (confirm('Are you sure you want to delete this page?')) {
      this.deletePage.emit(this.page.id);
    }
  }
}
