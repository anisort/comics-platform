import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ComicsPlatformRoutingModule } from './comics-platform-routing.module';
import { HomePageComponent } from './components/home-page/home-page.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ActivationComponent } from './components/activation/activation.component';
import { MylibraryPageComponent } from './components/mylibrary-page/mylibrary-page.component';


@NgModule({
  declarations: [
    HomePageComponent,
    RegisterFormComponent,
    LoginFormComponent,
    ActivationComponent,
    MylibraryPageComponent,
  ],
  imports: [
    CommonModule,
    ComicsPlatformRoutingModule,
    ReactiveFormsModule
  ]
})
export class ComicsPlatformModule { }
