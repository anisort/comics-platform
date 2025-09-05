import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
//import { ComicsPlatformModule } from './comics-platform/comics-platform.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HeaderComponent } from './core/components/header/header.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {ComicsModule} from './features/comics/comics.module';
import {AuthModule} from './features/auth/auth.module';
import {EpisodesModule} from './features/episodes/episodes.module';
import {PagesModule} from './features/pages/pages.module';
import {CoreModule} from './core/core.module';
import {NotificationsModule} from './features/notifications/notifications.module';
import {SubscriptionsModule} from './features/subscriptions/subscriptions.module';
import {SharedModule} from './shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    //ComicsPlatformModule,

    CoreModule,
    AuthModule,
    ComicsModule,
    EpisodesModule,
    PagesModule,
    NotificationsModule,
    SubscriptionsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
