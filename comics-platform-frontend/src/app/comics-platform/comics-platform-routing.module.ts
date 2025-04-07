import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivationComponent } from './components/activation/activation.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { MyLibraryPageComponent } from './components/mylibrary-page/mylibrary-page.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/noauth.guard';
import { ComicSingleItemComponent } from './components/comic-single-item/comic-single-item.component';
import { CreateComicComponent } from './components/create-comic/create-comic.component';
import { AllComicsPageComponent } from './components/all-comics-page/all-comics-page.component';
import { EditComicPageComponent } from './components/edit-comic-page/edit-comic-page.component';

const routes: Routes = [
  { path: 'comics-platform/home', component: HomePageComponent},
  { path: 'comics-platform', redirectTo: 'comics-platform/home', pathMatch: 'full'},
  { path: '', redirectTo: 'comics-platform/home', pathMatch: 'full'},

  {path: 'comics-platform/register', component: RegisterFormComponent, canActivate: [NoAuthGuard]},
  {path: 'comics-platform/login', component: LoginFormComponent, canActivate: [NoAuthGuard]},
  {path: 'comics-platform/activate', component: ActivationComponent, canActivate: [NoAuthGuard]},
  {path: 'comics-platform/all-comics', component: AllComicsPageComponent},
  { path: 'comics-platform/my-library', component: MyLibraryPageComponent, canActivate: [AuthGuard] },

  {path: 'comics-platform/comic-detail-info/:id', component: ComicSingleItemComponent},
  {path: 'comics-platform/add-comic', component: CreateComicComponent, canActivate: [AuthGuard]},
  { path: 'comics-platform/edit-comic/:id', component: EditComicPageComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class ComicsPlatformRoutingModule { }
