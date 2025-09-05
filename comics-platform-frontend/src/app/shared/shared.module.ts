import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import { LoaderComponent } from './components/loader/loader.component';



@NgModule({
  declarations: [
    LoaderComponent
  ],
  imports: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DragDropModule,
    MatIconModule,
    LoaderComponent
  ]
})
export class SharedModule { }
