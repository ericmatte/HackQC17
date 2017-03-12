import { Component, Input, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataService } from '../../app/services/data.service';
import * as moment from "moment";
import 'moment/locale/fr-ca';

/*
  Generated class for the Detail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
  providers: [DataService]
})
export class DetailPage {
  @Input() item: any;
  triviaCard: string = "";

  constructor(public _ngZone : NgZone, public dataService: DataService, public navCtrl: NavController, public navParams: NavParams) {
    this.item = navParams.data.myContainer.item;
    this.getTrivia();
  }

  getTrivia() {
    // Choose a random trivia category
    var selection = Math.floor(Math.random() * 3);
    //selection = 3;
    switch(selection) {
      case 0:
          this.dataService.getPisteCyclableSherbrooke().then((response) => {
            this.triviaCard = "La ville de Sherbrooke compte un total de "+response.features.length+" pistes cyclabes.";
            this._ngZone.run(() => {console.log('Outside Done!') });
         });
          break;
      case 1:
          this.dataService.getPisteCyclableSherbrooke().then((response) => {
            var total = 0;
            for (let i = 0; i < response.features.length; i++) {
              total += parseFloat(response.features[i].properties.Shape_length);
            }
            this.triviaCard = "La ville de Sherbrooke plus de "+Math.round(total / 1000)+"km de pistes cyclabes.";
            this._ngZone.run(() => {console.log('Outside Done!') });
         });
          break;
      case 2:
          this.dataService.getHorodateurSherbrooke().then((response) => {
            this.triviaCard = "La ville de Sherbrooke possède beaucoup de stationnements payants à travers toute la ville. On y compte "+response.features.length+" horodateurs.";
            this._ngZone.run(() => {console.log('Outside Done!') });
         });
          break;
      default:
          this.dataService.getSAAQData().then((response) => {
            var totalPieton = 0, totalVelo = 0;
            for (let i = 0; i < response.length; i++) {
              totalPieton += (parseInt(response[i].NB_VICTIMES_PIETON) || 0);
              totalVelo += (parseInt(response[i].NB_VICTIMES_VELO) || 0);
            }
            if (totalPieton > totalVelo) {
              this.triviaCard = "En 2015, il y a eu plus de victimes piétons ("+totalPieton
                  +") impliqué dans un accident que de victimes en vélo ("+totalVelo+").";
            } else {
              this.triviaCard = "En 2015, il y a eu plus de victimes en vélo ("+totalVelo
                  +") impliqué dans un accident que de victimes piétons ("+totalPieton+").";
            }
            this._ngZone.run(() => {console.log('Outside Done!') });
          });
    }

  }

  public getTime(date) {
    if(date) {
      moment.locale("fr-ca");
      return moment(date).fromNow();
    }
    return '';
  }

  changeItem(number) {
    this.navParams.data.callback(number);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

}
