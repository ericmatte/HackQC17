import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as moment from "moment";
import 'moment/locale/fr-ca';

/*
  Generated class for the Detail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html'
})
export class DetailPage {
  item:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.item = navParams.data;
  }

  public getTime(date) {
    moment.locale("fr-ca");
    return moment(date).fromNow();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

}
