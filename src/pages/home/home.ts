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
        address: "28 rue des chênes",
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
    this.dataService.getAccidentRate("rate").then((accident) => {
      console.log(accident);
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

      this.googleService.getGoogleEstimatedTime(travelModes.driving, "1600 Boulevard du Plateau-Saint-Joseph, Sherbrooke", "9 Rue du Cégep, Sherbrooke, QC J1E 2J4").then( (response) => {
        console.log("Car", response);
      }).catch( (error) => {
        console.log(error);
      });

      this.googleService.getGoogleEstimatedTime(travelModes.bicycling, "1600 Boulevard du Plateau-Saint-Joseph, Sherbrooke", "9 Rue du Cégep, Sherbrooke, QC J1E 2J4").then( (response) => {
        console.log("Bike", response);
      }).catch( (error) => {
        console.log(error);
      });

      this.googleService.getGoogleEstimatedTime(travelModes.transit, "1600 Boulevard du Plateau-Saint-Joseph, Sherbrooke", "9 Rue du Cégep, Sherbrooke, QC J1E 2J4").then( (response) => {
        console.log("Bus", response);
      }).catch( (error) => {
        console.log(error);
      });

      this.googleService.getGoogleEstimatedTime(travelModes.walking, "1600 Boulevard du Plateau-Saint-Joseph, Sherbrooke", "9 Rue du Cégep, Sherbrooke, QC J1E 2J4").then( (response) => {
        console.log("Walkreing" ,response);
      }).catch( (error) => {
        console.log(error);
      });
  }

  public showDetail(item): void {
    this.navCtrl.push(DetailTabsPage, {
      item: item
    })
  }

}