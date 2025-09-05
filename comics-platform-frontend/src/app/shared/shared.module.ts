import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import { LoaderComponent } from './components/loader/loader.component';
import { AuthButtonComponent } from './components/auth-button/auth-button.component';



@NgModule({
  declarations: [
    LoaderComponent,
    AuthButtonComponent
  ],
  imports: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DragDropModule,
    MatIconModule,
    LoaderComponent,
    AuthButtonComponent
  ]
})
export class SharedModule { }
