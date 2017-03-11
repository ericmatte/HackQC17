import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DetailPage } from '../detail/detail';
import { DataService } from '../../app/services/data.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [DataService]
})
export class HomePage {
  upcomingItems: any[];

  constructor(public navCtrl: NavController, public dataService: DataService) {
    this.upcomingItems = [];
    for (let i = 0; i < 10; i++) {
      this.upcomingItems.push({title: 'Rendez-vous #' + i, icon: 'walk', address: '340 rue Lépine'});
    } 
  }

  public getCrashRepports(item): void {
    this.dataService.getSAAQData().then( (a) => {
      console.log(a);
    });  
  }

  public showDetail(): void {
    this.navCtrl.push(DetailPage, {
      item: "the item"
    })
  }

}
