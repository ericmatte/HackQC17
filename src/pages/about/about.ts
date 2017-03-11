import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  usedDatabases: any[]
  usedLibrairies: any[]

  constructor(public navCtrl: NavController) {
    this.usedDatabases = [{name: "Données de la SAAQ"},
                          {name: "Piste cysclable de la ville de Sherbrooke"}];
    this.usedLibrairies = [{name: "Ionic"},
                           {name: "D3js gauge"}];
  }

}
