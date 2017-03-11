import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DetailTabsPage } from '../detailTabs/detailTabs';
import { DataService } from '../../app/services/data.service';
import { WeatherService } from '../../app/services/weather.service';
import 'rxjs/add/operator/map';
import { Gauge } from "../../assets/js/gauge";
import * as $ from "jquery";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [DataService]
})
export class HomePage {
  upcomingItems: any[];

  constructor(public navCtrl: NavController, public dataService: DataService, public weatherService: WeatherService) {
    this.upcomingItems = [];
    for (let i = 0; i < 10; i++) {
      this.upcomingItems.push({title: 'Rendez-vous #' + i, icon: 'walk', address: '340 rue Lépine'});
    }
  }

  ngOnInit() {
    setTimeout( () => {
      Gauge($(".chart-gauge")[0]);
    }, 0);
  }

  public getCrashRepports(): void {
    this.dataService.getSAAQData().then( (a) => {
      console.log(a);
    });

    //Example to get data from the forecast.
    this.weatherService.forecast(7)
      .map(data => data.json())
      .subscribe(
        data => {
          console.log(data.list);
        },
        err => console.log('err: ' + err),
        () => console.log('forecast complete')
      );
  }

  public showDetail(item): void {
    this.navCtrl.push(DetailTabsPage, {
      item: item
    })
  }

}
