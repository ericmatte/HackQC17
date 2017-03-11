import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Geolocation} from 'ionic-native';
import {Observable} from 'rxjs/Observable';
import {Platform} from 'ionic-angular';

@Injectable()
export class WeatherService {
  private appId = '3ff3069fc015f239926bcc5c20f3ca4a';
  private baseUrl = 'http://api.openweathermap.org/data/2.5/';

  constructor(public http: Http, public platform: Platform) {}
  
  forecast(numOfDays: number) {
    let url = this.baseUrl + 'forecast/daily';
    url += '?appId=' + this.appId;
    url += '&id=6146143'; //HARD CODE TO SHERBROOKE :)
    url += '&cnt=' + numOfDays;
    
    return this.http.get(url);
  }

}
