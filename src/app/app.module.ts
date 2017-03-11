import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { DetailTabsPage } from '../pages/detailTabs/detailTabs';
import { DetailPage } from '../pages/detail/detail';
import { MapPage } from '../pages/map/map';
import { StatsPage } from '../pages/stats/stats';
import { DataService } from './services/data.service';
import { WeatherService } from './services/weather.service';
import { GoogleService } from "./services/google.service";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    HomePage,
    DetailTabsPage,
    DetailPage,
    MapPage,
    StatsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    HomePage,
    DetailTabsPage,
    DetailPage,
    MapPage,
    StatsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, DataService, WeatherService, GoogleService]
})
export class AppModule {}
