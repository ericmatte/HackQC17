import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import * as q from "q";

export enum travelModes {
    driving,
    walking,
    bicycling,
    transit
}

@Injectable()
export class GoogleService {

    constructor() { }

    public getGoogleEstimatedTime(travelOption: travelModes, origin: string, destination: string) {
        return q.Promise((resolve, reject, notify) => {
            this._getGoogleEstimatedTime(travelOption, origin, destination).then( (a) => {
                console.log("For some reason, we shoud never hit that ?.. Meh Whatever for now.");
            }).catch( (response) => {
                if (response.status == 200) {
                    resolve(JSON.parse(response.responseText).rows[0].elements[0]);
                }
                else {
                    reject("err fetching google api");
                }
            });
        });
    }

    private _getGoogleEstimatedTime(travelOption: travelModes, origin: string, destination: string) {
        return q.Promise((resolve, reject, notify) => {
            let travelMode;
            if (travelOption == travelModes.driving) {
                travelMode = "driving";
            }
            if (travelOption == travelModes.walking) {
                travelMode = "walking";
            }
            if (travelOption == travelModes.bicycling) {
                travelMode = "bicycling";
            }
            if (travelOption == travelModes.transit) {
                travelMode = "transit";
            }

            let key = `AIzaSyARnX4lNqjy8CRsHy_6ZQmo8reegpbEzdE`;
            let origins = origin.replace(/\ /g, "+");
            let destinations = destination.replace(/\ /g, "+");

            $.ajax({ 
                url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&mode=${travelMode}&language=fr-FR&key=${key}`,
                type: "GET",   
                dataType: 'application/json',
                cache: false,
            }).always((response: string) => {
                resolve(response);
            });
        });


    }
}