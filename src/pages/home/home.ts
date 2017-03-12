import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DetailTabsPage } from '../detailTabs/detailTabs';
import { DataService } from '../../app/services/data.service';
import { WeatherService } from '../../app/services/weather.service';
import { GoogleService, travelModes } from "../../app/services/google.service";
import 'rxjs/add/operator/map';
import { Gauge, needle } from "../../assets/js/gauge";
import * as $ from "jquery";
import * as moment from "moment";
import 'moment/locale/fr-ca';
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

    for (let i = 0; i < 1; i++) {
      let _depart       = '1600 Boulevard du Plateau-Saint-Joseph, Sherbrooke, QC J1L 0C8';
      let _destination  = "3455 rue du Fer-Droit, Sherbrooke, QC J1H 0A8";
      let _date         = "2017-03-17T19:10:31.236Z";   

      this.calculatePercent(_depart,_destination,_date).then( (percentage) => {
          let type = this.getItemType(percentage);
          let icon = "walk";
          let transport = 0;
          if (type === "auto") {
            icon = "car";
            transport = 0; 
          }
          if (type === "marche") {
            icon = "walk";
            transport = 1;
          }
          if (type === "bus") {
            icon = "bus";
            transport = 3;
          }
          if (type === "velo") {
            icon = "bicycle";
            transport = 2;
          }

          this.upcomingItems.push({
            title: 'Golf Meetup', 
            description: "Meeting important au golf avec les dirigants.",
            icon: icon, 
            depart: _depart,
            destination: _destination,
            address: "28 Rue Des Chênes",
            date: _date,
            pourcentage : percentage,
            transport: transport
          });
          this._ngZone.run(() => { });
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
    if ($event.srcElement.value) {
      let _date         = "2017-03-17T19:10:31.236Z"; 
      let _depart = '1600 Boulevard du Plateau-Saint-Joseph, Sherbrooke, QC J1L 0C8';
      this.calculatePercent(_depart, $event.srcElement.value, _date).then( (percent) => {

          let type = this.getItemType(percent);
          let icon = "walk";
          let transport = 0;
          if (type === "auto") {
            icon = "car";
            transport = 0; 
          }
          if (type === "marche") {
            icon = "walk";
            transport = 1;
          }
          if (type === "bus") {
            icon = "bus";
            transport = 3;
          }
          if (type === "velo") {
            icon = "bicycle";
            transport = 2;
          }

          this.upcomingItems.unshift({
            title: $event.srcElement.value, 
            description: "",
            icon: icon, 
            depart: _depart,
            destination: $event.srcElement.value,
            address: $event.srcElement.value,
            date: _date,
            pourcentage : percent,
            transport: transport
          });

          this.navCtrl.push(DetailTabsPage, {
            item: this.upcomingItems[0]
          });
             
          this._ngZone.run(() => { });
      });

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

  public getTime(item) {
    moment.locale("fr-ca");
    var b = this.getItemType(item);

    return moment().add(item[b].time, 'seconds').fromNow();
  }

  public getHealth(item) {
    var b = this.getItemType(item.pourcentage);
    if (b === "auto") {
      return 0;
    }
    else if (b === "bus") {
      return (10 * item.pourcentage[this.getItemType(item.pourcentage)].time) / 3600 /1000;
    }
    else if (b === "marche") {
      return (180 * item.pourcentage[this.getItemType(item.pourcentage)].time) / 3600 /1000;
    }
    else {
      return (700 * item.pourcentage[this.getItemType(item.pourcentage)].time) / 3600 / 1000;
    }


  }

  public getDistance(item) {
    return item.pourcentage[this.getItemType(item.pourcentage)].distance;
  }

  public getItemType(item) {
    if ((item['auto'].nb > item['bus'].nb 
        && item['auto'].nb > item['marche'].nb 
        && item['auto'].nb > item['velo'].nb)) {
        return "auto";
    }

    if (item['marche'].nb > item['velo'].nb 
        && item['marche'].nb > item['bus'].nb) {
        return "marche";
    }
    
    if (item['bus'].nb != 0 && item['bus'].nb > item['velo'].nb) {
        return "bus";
    }

    //Else.. Its CAR
    return "velo"
  }
}