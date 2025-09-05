import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import {RegisterFormComponent} from './components/register-form/register-form.component';
import {ActivationComponent} from './components/activation/activation.component';
import {LoginFormComponent} from './components/login-form/login-form.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    RegisterFormComponent,
    ActivationComponent,
    LoginFormComponent
  ],
  imports: [
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
