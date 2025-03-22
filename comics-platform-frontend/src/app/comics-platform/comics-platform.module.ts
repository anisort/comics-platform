import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ComicsPlatformRoutingModule } from './comics-platform-routing.module';
import { HomePageComponent } from './components/home-page/home-page.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ActivationComponent } from './components/activation/activation.component';
import { MyLibraryPageComponent } from './components/mylibrary-page/mylibrary-page.component';
import { ComicItemComponent } from './components/comic-item/comic-item.component';


@NgModule({
  declarations: [
    HomePageComponent,
    RegisterFormComponent,
    LoginFormComponent,
    ActivationComponent,
    MyLibraryPageComponent,
    ComicItemComponent,
  ],
  imports: [
    CommonModule,
    ComicsPlatformRoutingModule,
    ReactiveFormsModule
  ]
})
export class ComicsPlatformModule { }
