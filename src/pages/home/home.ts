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

  constructor(public navCtrl: NavController, public dataService: DataService) {
    dataService.getSAAQData().then( (a) => {
      console.log(a);
    });
    
  }

  

  public showDetail(): void {
    this.navCtrl.push(DetailPage, {
      item: "the item"
    })
  }

}
