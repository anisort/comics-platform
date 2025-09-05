import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import {EditPageComponent} from './components/edit-page/edit-page.component';
import {EditPageListComponent} from './components/edit-page-list/edit-page-list.component';
import {EpisodePageViewerComponent} from './components/episode-page-viewer/episode-page-viewer.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    EditPageComponent,
    EditPageListComponent,
    EpisodePageViewerComponent
  ],
  imports: [
    PagesRoutingModule,
    SharedModule
  ]
})
export class PagesModule { }
