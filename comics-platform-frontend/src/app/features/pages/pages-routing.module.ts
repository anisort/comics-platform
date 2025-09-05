import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EpisodePageViewerComponent} from './components/episode-page-viewer/episode-page-viewer.component';

const routes: Routes = [
  {path: 'read/:episodeId', component: EpisodePageViewerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
