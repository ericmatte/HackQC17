import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DetailTabsPage } from '../detailTabs/detailTabs';
import { DataService } from '../../app/services/data.service';
import { WeatherService } from '../../app/services/weather.service';
import { GoogleService, travelModes } from "../../app/services/google.service";
import 'rxjs/add/operator/map';
import { Gauge, needle } from "../../assets/js/gauge";
import * as $ from "jquery";
import * as q from "q";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [DataService]
})
export class HomePage {
  upcomingItems: any[];
  progress: number = 0;

  searchBox: string = "";

  constructor(public navCtrl: NavController, public dataService: DataService, public weatherService: WeatherService, public googleService: GoogleService, public _ngZone : NgZone) {
    this.upcomingItems = [];

    for (let i = 0; i < 2; i++) {
      let _depart       = '1600 Boulevard du Plateau-Saint-Joseph, Sherbrooke, QC J1L 0C8';
      let _destination  = "3455 rue du Fer-Droit, Sherbrooke, QC J1H 0A8";
      let _date         = "2017-03-17T19:10:31.236Z";   
      let percentage    = null;
      this.calculatePercent(_depart,_destination,_date).then( (a) => {
          percentage = a;
          console.log(percentage);

          this.upcomingItems.push({
            title: 'Golf' + i, 
            description: "Meeting important au golf avec les dirigants.",
            icon: 'walk', 
            depart: _depart,
            destination: _destination,
            address: "28 rue des chênes",
            date: _date,
            pourcentage : percentage,
          });
          
          this._ngZone.run(() => {console.log('Outside Done!') });
      });
    }
    
  }

  public calculatePercent(depart, destination, date) {
      return q.Promise((resolve, reject, notify) => {
          let choise            = [];
              choise["velo"]    = 0;
              choise["bus"]     = 0;
              choise["marche"]  = 0;
              choise["auto"]    = 0;

          this.dataService.getAccidentRate("rate").then((accident) => {
                accident.sort();
                choise[Object.keys(accident)[0]]+=2;       
                choise[Object.keys(accident)[1]]+=1;            
          });

          var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
          var firstDate = new Date();
          var secondDate = new Date(date);

          var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));

          if(diffDays < 7) {
             this.weatherService.forecast(diffDays)
            .map(data => data.json())
            .subscribe(
              data => {
                if(firstDate.getMonth() != 12 && firstDate.getMonth() != 1 && firstDate.getMonth() != 2) {
                  let temp = data.list[diffDays-1].temp.day - 273;
                  if(temp < -25) {
                    choise["bus"] += 2; 
                    choise["auto"] += 3; 
                  }
                  else if (temp < -10)  {
                    choise["auto"] += 1; 
                    choise["marche"] += 1; 
                    choise["bus"] += 3;
                  }
                  else if (temp < -10)  {
                    choise["bus"] += 3;
                    choise["marche"] += 2;
                  }
                  else {
                    choise["bus"] += 3;
                    choise["marche"] += 3;
                  }
                }                
              },
              err => console.log('err: ' + err)
            );
          }

          let i = 0;
          this.googleService.getGoogleEstimatedTime(travelModes.walking, "1600 Boulevard du Plateau-Saint-Joseph, Sherbrooke", "9 Rue du Cégep, Sherbrooke, QC J1E 2J4").then( (response) => {
            if((response.duration.value/60/60) < 15)  choise["marche"] += 3;
            else if((response.duration.value/60/60) < 30)  choise["marche"] += 2;
            else if((response.duration.value/60/60) < 50)  choise["marche"] += 1;
           
            i++;  
            if(i == 4)  resolve(choise);
          }).catch( (error) => {
            console.log(error);
          });

          this.googleService.getGoogleEstimatedTime(travelModes.transit, "1600 Boulevard du Plateau-Saint-Joseph, Sherbrooke", "9 Rue du Cégep, Sherbrooke, QC J1E 2J4").then( (response) => {
            if((response.duration.value/60/60) < 15)  choise["bus"] += 3;
            else if((response.duration.value/60/60) < 30)  choise["bus"] += 2;
            else if((response.duration.value/60/60) < 50)  choise["bus"] += 1;
            
            i++;  
            if(i == 4)  resolve(choise);
          }).catch( (error) => {
            console.log(error);
          });

          this.googleService.getGoogleEstimatedTime(travelModes.bicycling, "1600 Boulevard du Plateau-Saint-Joseph, Sherbrooke", "9 Rue du Cégep, Sherbrooke, QC J1E 2J4").then( (response) => {
            if((response.duration.value/60/60) < 15)  choise["bus"] += 3;
            else if((response.duration.value/60/60) < 30)  choise["bus"] += 2;
            else if((response.duration.value/60/60) < 50)  choise["bus"] += 1;
          
            i++;  
            if(i == 4)  resolve(choise);
          }).catch( (error) => {
            console.log(error);
          });

          this.googleService.getGoogleEstimatedTime(travelModes.driving, "1600 Boulevard du Plateau-Saint-Joseph, Sherbrooke", "9 Rue du Cégep, Sherbrooke, QC J1E 2J4").then( (response) => {
            if((response.duration.value/60/60) < 15)  choise["auto"] += 3;
            else if((response.duration.value/60/60) < 30)  choise["auto"] += 2;
            else if((response.duration.value/60/60) < 50)  choise["auto"] += 1;
          
            i++;  
            if(i == 4)  resolve(choise);
          }).catch( (error) => {
            console.log(error);
          });
      });
  }

  ngOnInit() {
    setTimeout( () => {
      Gauge($(".chart-gauge")[0]);
      this.setShameGauge();
    }, 0);
  }

  public onFocus($event) {

    this.upcomingItems.unshift({
        title: $event.srcElement.value,
        description: "",
        icon: 'walk', 
        depart: 'Sherbrooke, Quebec',
        destination: $event.srcElement.value,
        address: $event.srcElement.value,
        date: new Date().toUTCString(),
        transport: 1
    });

    this.navCtrl.push(DetailTabsPage, {
      item: this.upcomingItems[0]
    });
  }

  setShameGauge() {
    needle.moveTo(.25)
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
  
  }

  public showDetail(item): void {
    this.navCtrl.push(DetailTabsPage, {
      item: item
    });
  }
}