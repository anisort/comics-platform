import { NgModule } from '@angular/core';
import {EditEpisodeItemComponent} from './components/edit-episode-item/edit-episode-item.component';
import {EditEpisodeListComponent} from './components/edit-episode-list/edit-episode-list.component';
import {EpisodeItemComponent} from './components/episode-item/episode-item.component';
import {EpisodeListComponent} from './components/episode-list/episode-list.component';
import {SharedModule} from '../../shared/shared.module';



@NgModule({
  declarations: [
    EditEpisodeItemComponent,
    EditEpisodeListComponent,
    EpisodeItemComponent,
    EpisodeListComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    EpisodeListComponent, EditEpisodeListComponent
  ]
})
export class EpisodesModule { }
