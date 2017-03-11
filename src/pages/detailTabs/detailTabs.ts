import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { DetailPage } from '../detail/detail';
import { MapPage } from '../map/map';

@Component({
  templateUrl: 'detailTabs.html'
})
export class DetailTabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  item: any;
  tab1Root: any = DetailPage;
  tab2Root: any = MapPage;
  functionCall: any = null;
  
  myContainer: { item?: any } = {};

  constructor(public navParams: NavParams) {
    this.myContainer.item = navParams.get("item");
  }

  public callback(number) {
    this.myContainer.item = {
        title: 'Golfer', 
        description: "Meeting important au golf avec les dirigants.",
        icon: 'walk', 
        depart: '1600 Boulevard du Plateau-Saint-Joseph, Sherbrooke, QC J1L 0C8',
        destination: "3455 rue du Fer-Droit, Sherbrooke, QC J1H 0A8",
        date: "2017-03-12T19:10:31.236Z",
        transport: number
      };
  }
}
