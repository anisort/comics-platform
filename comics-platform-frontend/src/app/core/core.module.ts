import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {SharedModule} from '../shared/shared.module';
import {HeaderComponent} from './components/header/header.component';
import {ComicsModule} from '../features/comics/comics.module';
import {NotificationsModule} from '../features/notifications/notifications.module';



@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    SharedModule,
    ComicsModule,
    NotificationsModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  exports: [
    HeaderComponent
  ]
})
export class CoreModule { }
