// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { ActivationComponent } from '../features/auth/components/activation/activation.component';
// import { HomePageComponent } from '../features/comics/components/home-page/home-page.component';
// import { LoginFormComponent } from '../features/auth/components/login-form/login-form.component';
// import { RegisterFormComponent } from '../features/auth/components/register-form/register-form.component';
// import { MyLibraryPageComponent } from '../features/comics/components/mylibrary-page/mylibrary-page.component';
// import { AuthGuard } from '../core/guards/auth.guard';
// import { NoAuthGuard } from '../core/guards/noauth.guard';
// import { ComicSingleItemComponent } from '../features/comics/components/comic-single-item/comic-single-item.component';
// import { CreateComicComponent } from '../features/comics/components/create-comic/create-comic.component';
// import { AllComicsPageComponent } from '../features/comics/components/all-comics-page/all-comics-page.component';
// import { EditComicPageComponent } from '../features/comics/components/edit-comic-page/edit-comic-page.component';
// import { EpisodePageViewerComponent } from '../features/pages/components/episode-page-viewer/episode-page-viewer.component';
//
// const routes: Routes = [
//   // { path: 'comics-platform/home', component: HomePageComponent},
//   // { path: 'comics-platform', redirectTo: 'comics-platform/home', pathMatch: 'full'},
//   // { path: '', redirectTo: 'comics-platform/home', pathMatch: 'full'},
//
//   // {path: 'comics-platform/register', component: RegisterFormComponent, canActivate: [NoAuthGuard]},
//   // {path: 'comics-platform/login', component: LoginFormComponent, canActivate: [NoAuthGuard]},
//   // {path: 'comics-platform/activate', component: ActivationComponent, canActivate: [NoAuthGuard]},
//   // {path: 'comics-platform/all-comics', component: AllComicsPageComponent},
//   // { path: 'comics-platform/my-library', component: MyLibraryPageComponent, canActivate: [AuthGuard] },
//
//   // {path: 'comics-platform/comic-detail-info/:id', component: ComicSingleItemComponent},
//   // {path: 'comics-platform/add-comic', component: CreateComicComponent, canActivate: [AuthGuard]},
//   // { path: 'comics-platform/edit-comic/:id', component: EditComicPageComponent, canActivate: [AuthGuard]},
//
//   {path: 'comics-platform/read/:episodeId', component: EpisodePageViewerComponent }
// ];
//
// @NgModule({
//   imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
//   exports: [RouterModule]
// })
// export class ComicsPlatformRoutingModule { }
