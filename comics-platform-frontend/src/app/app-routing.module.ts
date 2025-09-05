import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// const routes: Routes = [
//   {
//     path: 'comics-platform',
//     loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
//   },
//   {
//     path: 'comics-platform',
//     loadChildren: () => import('./features/comics/comics.module').then(m => m.ComicsModule)
//   },
//   {
//     path: 'comics-platform',
//     loadChildren: () => import('./features/pages/pages.module').then(m => m.PagesModule)
//   },
//   { path: '', redirectTo: 'comics-platform/home', pathMatch: 'full' }
// ];

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'comics',
    loadChildren: () => import('./features/comics/comics.module').then(m => m.ComicsModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./features/pages/pages.module').then(m => m.PagesModule)
  },
  { path: '', redirectTo: 'comics/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
