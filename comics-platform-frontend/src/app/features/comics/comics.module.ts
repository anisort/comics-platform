import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComicsRoutingModule } from './comics-routing.module';
import {AllComicsPageComponent} from './components/all-comics-page/all-comics-page.component';
import {ComicItemComponent} from './components/comic-item/comic-item.component';
import {ComicItemMylibraryComponent} from './components/comic-item-mylibrary/comic-item-mylibrary.component';
import {ComicSingleItemComponent} from './components/comic-single-item/comic-single-item.component';
import {CreateComicComponent} from './components/create-comic/create-comic.component';
import {EditComicPageComponent} from './components/edit-comic-page/edit-comic-page.component';
import {HomePageComponent} from './components/home-page/home-page.component';
import {MyLibraryPageComponent} from './components/mylibrary-page/mylibrary-page.component';
import {SearchComponent} from './components/search/search.component';
import {SharedModule} from '../../shared/shared.module';
import {EpisodesModule} from '../episodes/episodes.module';


@NgModule({
  declarations: [
    AllComicsPageComponent,
    ComicItemComponent,
    ComicItemMylibraryComponent,
    ComicSingleItemComponent,
    CreateComicComponent,
    EditComicPageComponent,
    HomePageComponent,
    MyLibraryPageComponent,
    SearchComponent
  ],
  imports: [
    SharedModule,
    ComicsRoutingModule,
    EpisodesModule
  ],
  exports: [
    SearchComponent
  ]
})
export class ComicsModule { }
