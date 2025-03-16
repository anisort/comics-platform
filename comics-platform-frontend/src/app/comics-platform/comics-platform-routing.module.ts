import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';

const routes: Routes = [
  { path: 'comics-platform/home', component: HomePageComponent},
  { path: 'comics-platform', redirectTo: 'comics-platform/home', pathMatch: 'full'},
  { path: '', redirectTo: 'comics-platform/home', pathMatch: 'full'},

  {path: 'comics-platform/register', component: RegisterFormComponent},
  {path: 'comics-platform/login', component: LoginFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComicsPlatformRoutingModule { }
