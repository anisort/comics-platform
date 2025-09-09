import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import {ComicsModule} from './features/comics/comics.module';
import {AuthModule} from './features/auth/auth.module';
import {EpisodesModule} from './features/episodes/episodes.module';
import {PagesModule} from './features/pages/pages.module';
import {CoreModule} from './core/core.module';
import {NotificationsModule} from './features/notifications/notifications.module';
import {SubscriptionsModule} from './features/subscriptions/subscriptions.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
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
