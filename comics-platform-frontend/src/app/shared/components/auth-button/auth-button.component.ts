import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-auth-button',
  standalone: false,
  templateUrl: './auth-button.component.html',
  styleUrl: './auth-button.component.scss'
})
export class AuthButtonComponent {
  @Input() label!: string;
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<void>();

}
