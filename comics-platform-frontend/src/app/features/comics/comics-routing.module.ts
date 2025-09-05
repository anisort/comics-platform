import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from './components/home-page/home-page.component';
import {AllComicsPageComponent} from './components/all-comics-page/all-comics-page.component';
import {MyLibraryPageComponent} from './components/mylibrary-page/mylibrary-page.component';
import {AuthGuard} from '../../core/guards/auth.guard';
import {ComicSingleItemComponent} from './components/comic-single-item/comic-single-item.component';
import {CreateComicComponent} from './components/create-comic/create-comic.component';
import {EditComicPageComponent} from './components/edit-comic-page/edit-comic-page.component';

const routes: Routes = [
  { path: 'home', component: HomePageComponent},
  {path: 'all-comics', component: AllComicsPageComponent},
  { path: 'my-library', component: MyLibraryPageComponent, canActivate: [AuthGuard] },
  {path: 'comic-detail-info/:id', component: ComicSingleItemComponent},
  {path: 'add-comic', component: CreateComicComponent, canActivate: [AuthGuard]},
  { path: 'edit-comic/:id', component: EditComicPageComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComicsRoutingModule { }
