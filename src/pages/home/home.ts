import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DetailPage } from '../detail/detail';
import { DataService } from '../../app/services/data.service';
import { WeatherService } from '../../app/services/weather.service';
import 'rxjs/add/operator/map';

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

  public getCrashRepports(item): void {
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

  public showDetail(): void {
    this.navCtrl.push(DetailPage, {
      item: "the item"
    })
  }

}
