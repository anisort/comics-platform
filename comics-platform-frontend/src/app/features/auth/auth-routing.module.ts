import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterFormComponent} from './components/register-form/register-form.component';
import {NoAuthGuard} from '../../core/guards/noauth.guard';
import {LoginFormComponent} from './components/login-form/login-form.component';
import {ActivationComponent} from './components/activation/activation.component';

const routes: Routes = [
  {path: 'register', component: RegisterFormComponent, canActivate: [NoAuthGuard]},
  {path: 'login', component: LoginFormComponent, canActivate: [NoAuthGuard]},
  {path: 'activate', component: ActivationComponent, canActivate: [NoAuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
