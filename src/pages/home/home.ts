import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DetailTabsPage } from '../detailTabs/detailTabs';
import { DataService } from '../../app/services/data.service';
import { WeatherService } from '../../app/services/weather.service';
import { GoogleService, travelModes } from "../../app/services/google.service";
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


  constructor(public navCtrl: NavController, public dataService: DataService, public weatherService: WeatherService, public googleService: GoogleService) {
    this.upcomingItems = [];

    for (let i = 0; i < 10; i++) {
      this.upcomingItems.push({
        title: 'Golf' + i, 
        description: "Meeting important au golf avec les dirigants.",
        icon: 'walk', 
        depart: '1600 Boulevard du Plateau-Saint-Joseph, Sherbrooke, QC J1L 0C8',
        destination: "3455 rue du Fer-Droit, Sherbrooke, QC J1H 0A8",
        date: "2017-03-12T19:10:31.236Z",
      });
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

      this.googleService.getGoogleEstimatedTime(travelModes.driving, "Gatineau, Quebec", "Sherbrooke, Quebec").then( (a) => {
        console.log("For some reason, we shoud never hit that ?.. Meh Whatever for now.");
      }).catch( (response) => {
        if (response.status == 200) {
          console.log(JSON.parse(response.responseText));
        }
        else {
          console.log("err fetching google api");
        }
      });
  }

  public showDetail(item): void {
    this.navCtrl.push(DetailTabsPage, {
      item: item
    })
  }

}
