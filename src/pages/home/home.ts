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
  gaugeComment: string;
  gaugeIcon: string;

  constructor(public navCtrl: NavController, public dataService: DataService, public weatherService: WeatherService, public googleService: GoogleService, public _ngZone : NgZone) {
    this.upcomingItems = [];

    for (let i = 0; i < 2; i++) {
      let _depart       = '1600 Boulevard du Plateau-Saint-Joseph, Sherbrooke, QC J1L 0C8';
      let _destination  = "3455 rue du Fer-Droit, Sherbrooke, QC J1H 0A8";
      let _date         = "2017-03-17T19:10:31.236Z";   
      let percentage    = null;
      this.calculatePercent(_depart,_destination,_date).then( (percentage) => {
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
          
          this._ngZone.run(() => {});
      });
    }
    
  }


  public calculatePercent(depart, destination, date) {
      var choise = [];
        choise["velo"]    = 0;
        choise["bus"]     = 0;
        choise["marche"]  = 0;
        choise["auto"]    = 0;

      return q.Promise((resolve, reject, notify) => {
          let i = 0;
          this.dataService.getAccidentRate("rate").then((accident) => {
              choise[Object.keys(accident)[0]]+=2;  
              choise[Object.keys(accident)[1]]+=1;   
              
              i++;  
              if(i == 6)  resolve(choise);      
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
                i++;  
                if(i == 6)  resolve(choise); 
              },
              err => console.log('err: ' + err)
            );
          }

          this.googleService.getGoogleEstimatedTime(travelModes.walking, depart, destination).then( (response) => {
            if((response.duration.value/60/60) < 15)  choise["marche"] += 3;
            else if((response.duration.value/60/60) < 30)  choise["marche"] += 2;
            else if((response.duration.value/60/60) < 50)  choise["marche"] += 1;
           
            i++;  
            if(i == 6)  resolve(choise);
          }).catch( (error) => {
            console.log(error);
          });

          this.googleService.getGoogleEstimatedTime(travelModes.transit, depart, destination).then( (response) => {
            if (!response && !response.status && response.status != "ZERO_RESULTS") {
              if((response.duration.value/60/60) < 15)  choise["bus"] += 3;
              else if((response.duration.value/60/60) < 30)  choise["bus"] += 2;
              else if((response.duration.value/60/60) < 50)  choise["bus"] += 1;
            }
            i++;  
            if(i == 6)  resolve(choise);
          }).catch( (error) => {
            console.log(error);
          });

          this.googleService.getGoogleEstimatedTime(travelModes.bicycling, depart, destination).then( (response) => {
            if((response.duration.value/60/60) < 15)  choise["bus"] += 3;
            else if((response.duration.value/60/60) < 30)  choise["bus"] += 2;
            else if((response.duration.value/60/60) < 50)  choise["bus"] += 1;
          
            i++;  
            if(i == 6)  resolve(choise);
          }).catch( (error) => {
            console.log(error);
          });

          this.googleService.getGoogleEstimatedTime(travelModes.driving, depart, destination).then( (response) => {
            if((response.duration.value/60/60) < 15)  choise["auto"] += 3;
            else if((response.duration.value/60/60) < 30)  choise["auto"] += 2;
            else if((response.duration.value/60/60) < 50)  choise["auto"] += 1;
          
            i++;  
            if(i == 6)  resolve(choise);
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
    if ($event.srcElement.value) {
      let _date         = "2017-03-17T19:10:31.236Z"; 
      let _depart = '1600 Boulevard du Plateau-Saint-Joseph, Sherbrooke, QC J1L 0C8';
      this.calculatePercent(_depart, $event.srcElement.value, _date).then( (percent) => {
          this.upcomingItems.unshift({
              title: $event.srcElement.value,
              description: "",
              icon: 'walk', 
              depart: _depart,
              destination: $event.srcElement.value,
              address: $event.srcElement.value,
              date: _date,
              transport: 1,
              percent: percent
          });

          this.navCtrl.push(DetailTabsPage, {
            item: this.upcomingItems[0]
          });
          
          this._ngZone.run(() => {});
      });


    }
  }

  setShameGauge() {
    var gaugePercent = Math.random();
    needle.moveTo(gaugePercent);
    this.gaugeIcon = (gaugePercent > 0.5) ? "thumbs-up" : "thumbs-down";
    var comments = ["Putain, mais quest-ce que tu fais de ta vie?", // < 10 %
                    "Wow, tu devrais vraiment te prendre en main.", // < 20 %
                    "La vache, essait dont de faire un effort.", // < 30 %
                    "Un petit peu plus de transports alternatifs, et tu es en business!", // < 40 %
                    "Ne lâche surtout pas, tu deviendras un être proactif!", // < 50 %
                    "Je sais que tu peux faire mieux.", // < 60 %
                    "Une bonne moyenne.", // < 70 %
                    "Super score mon ami!", // < 80 %
                    "Du monde proactif comme toi, ça en prends plus!", // < 90 %
                    "WOW. Toi tu es un super de bon humain!"]
    gaugePercent = Math.round(gaugePercent*10);
    gaugePercent = gaugePercent<0 ? 0 : (gaugePercent>10 ? 10 : gaugePercent);
    this.gaugeComment = comments[gaugePercent];
  }

  public showDetail(item): void {
    this.navCtrl.push(DetailTabsPage, {
      item: item
    });
  }
}