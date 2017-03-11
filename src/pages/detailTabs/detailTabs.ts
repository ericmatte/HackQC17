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
  
  constructor(public navParams: NavParams) {
    this.item = navParams.get("item");
  }
}
