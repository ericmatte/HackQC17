import { NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
declare var google: any;

@Component({
  templateUrl: 'map.html'
})
export class MapPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  private directionService: any;
  private directionsDisplay: any;
  protected item;
  private map: any;
  private container: {item: any};
  private oldContainer: any;

  constructor(public navParams: NavParams) {
    this.item = this.navParams.data.container;
    this.container = this.navParams.data.container;
  }

  ngDoCheck() {   
    if (this.directionsDisplay && this.directionService) {
      if (!this.oldContainer || this.oldContainer.item.transport != this.container.item.transport) {
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
        });
        this.directionsDisplay.setMap(this.map);
        this.setRoute(this.container.item.transport, this.container.item.depart, this.container.item.destination);
        this.oldContainer = Object.assign({}, this.container);
      }
    }
  }

  ngOnInit() {
      setTimeout( (): void => {
        this.directionService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
        });
        this.setRoute(this.container.item.transport, this.container.item.depart, this.container.item.destination);
        this.directionsDisplay.setMap(this.map);
      }, 0);
    }

    setRoute(transport: number, start:string, end:string) {
      let travelMode: string = "DRIVING";

      if(transport == 1) {
        travelMode = "WALKING";
      }
      if (transport == 2) {
        travelMode = "BICYCLING";
      }
      if (transport == 3) {
        travelMode = "TRANSIT";
      }

      this.directionService.route({
        origin: start,
        destination: end,
        travelMode: travelMode
      }, (response, status) => {
        if (status === 'OK') {
          this.directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    }
}