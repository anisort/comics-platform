import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComicsPlatformRoutingModule } from './comics-platform-routing.module';
import { HomePageComponent } from './components/home-page/home-page.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ActivationComponent } from './components/activation/activation.component';
import { MyLibraryPageComponent } from './components/mylibrary-page/mylibrary-page.component';
import { ComicItemComponent } from './components/comic-item/comic-item.component';
import { ComicItemMylibraryComponent } from './components/comic-item-mylibrary/comic-item-mylibrary.component';
import { ComicSingleItemComponent } from './components/comic-single-item/comic-single-item.component';
import { CreateComicComponent } from './components/create-comic/create-comic.component';
import { SearchComponent } from './components/search/search.component';
import { AllComicsPageComponent } from './components/all-comics-page/all-comics-page.component';
import { EditComicPageComponent } from './components/edit-comic-page/edit-comic-page.component';


@NgModule({
  declarations: [
    HomePageComponent,
    RegisterFormComponent,
    LoginFormComponent,
    ActivationComponent,
    MyLibraryPageComponent,
    ComicItemComponent,
    ComicItemMylibraryComponent,
    ComicSingleItemComponent,
    CreateComicComponent,
    SearchComponent,
    AllComicsPageComponent,
    EditComicPageComponent,
  ],
  imports: [
    CommonModule,
    ComicsPlatformRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [SearchComponent]
})
export class ComicsPlatformModule { }
