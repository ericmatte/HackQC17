import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { DetailPage } from '../detail/detail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  upcomingItems: any[];

  constructor(public navCtrl: NavController) {
    this.upcomingItems = [];
    for (let i = 0; i < 10; i++) {
      this.upcomingItems.push({title: 'Rendez-vous #' + i, icon: 'walk', address: '340 rue Lépine'});
    } 
  }

  showDetail(item) {
    this.navCtrl.push(DetailPage, {
      item: "the item"
    })
  }

}
