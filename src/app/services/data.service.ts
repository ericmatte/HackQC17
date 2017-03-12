import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import * as q from "q";

@Injectable()
export class DataService {
    saaq: boolean = false;
    saaqData: string = null;
    constructor() { }

    public getSAAQData() {
        return q.Promise((resolve, reject, notify) => {
            if(this.saaq) {
                resolve(this.saaqData);
            }
            else {
                $.ajax({
                    url: '../assets/data/rapports-accident-2015.csv',
                    dataType: 'text',
                }).done((csvResponse: string) => {
                    resolve(JSON.parse(this.CSV2JSON(csvResponse)));
                }).fail( (e): void => {
                    reject(e);
                });
            }
        });
    }

     public getAccidentRate(needed: string) {
        return q.Promise((resolve, reject, notify) => {
            this.getSAAQData().then( (report) => {
                if(!this.saaq) {
                    this.saaq = true;
                    this.saaqData = report;
                }
                let statsCity     = [];
                let statsSpeed    = [];
                let statsMeteo    = [];
                let totalAccident = 0;
                let totalAuto     = 0;
                let totalBike     = 0;
                let totalPieton   = 0;
                let totalBus      = 0;

                let conditionMeteo = [];
                    conditionMeteo[11] = "Ensoleillé";
                    conditionMeteo[12] = "Couvert";
                    conditionMeteo[13] = "Brouillard";
                    conditionMeteo[14] = "Pluie";
                    conditionMeteo[15] = "Averse";
                    conditionMeteo[16] = "Vent Fort";
                    conditionMeteo[17] = "Neige";
                    conditionMeteo[18] = "Poudrerie";
                    conditionMeteo[19] = "Verglas";
                    conditionMeteo[99] = "Autre";

                for(var k in report) {
                    totalAccident++;
                    let city = {
                        Dead          : parseInt(report[k].NB_MORTS),
                        VictimeTotal  : parseInt(report[k].NB_VICTIMES_TOTAL),
                        VictimePieton : parseInt(report[k].NB_VICTIMES_PIETON),
                        VictimeVelo   : parseInt(report[k].NB_VICTIMES_VELO),
                        Region        : report[k].REG_ADM,
                        Bus           : parseInt(report[k].nb_tous_autobus_minibus),
                        Bike          : parseInt(report[k].nb_bicyclette),
                    }

                    if(city.Bus) totalBus++;
                    if(city.VictimePieton) totalPieton++;
                    if(city.Bike) totalBike++;

                    if(!statsCity[report[k].MRC]) statsCity[report[k].MRC] = city;
                    else {
                        statsCity[report[k].MRC].Dead          += city.Dead;
                        statsCity[report[k].MRC].VictimeTotal  += city.VictimeTotal;
                        statsCity[report[k].MRC].VictimePieton += city.VictimePieton;
                        statsCity[report[k].MRC].VictimeVelo   += city.VictimeVelo;
                        statsCity[report[k].MRC].Bus           += city.Bus;
                        statsCity[report[k].MRC].Bike          += city.Bike;
                    }

                    if(!statsSpeed[report[k].VITESSE_AUTOR]) statsSpeed[report[k].VITESSE_AUTOR] = 1;
                    else statsSpeed[report[k].VITESSE_AUTOR]++;

                    if(!statsMeteo[report[k].CD_COND_METEO]) statsMeteo[report[k].CD_COND_METEO] = 1;
                    else statsMeteo[report[k].CD_COND_METEO]++;
                }

                totalAuto = totalAccident - totalBike - totalPieton - totalBus;

                if(needed == "rate")                 
                    resolve({"velo":totalBike/totalAccident*100,"marche":totalPieton/totalAccident*100,"bus":totalBus/totalAccident*100,"auto":totalAuto/totalAccident*100})
                else if (needed == "general") resolve({"velo":totalBike, "marche":totalPieton, "bus":totalBus, "auto":totalAuto, "total":totalAccident});
                else if (needed == "ville") resolve(statsCity);
                else if (needed == "meteo") resolve(statsMeteo);
                else if (needed == "speed") resolve(statsSpeed);
            });  
        });  
    }
    
    public getPisteCyclableSherbrooke() {
        return q.Promise((resolve, reject, notify) => {
            $.ajax({
                url: '../assets/data/Piste-Cyclable-Standard.json',
                dataType: 'text',
            }).done((jsonResponse: string) => {
                resolve(JSON.parse(jsonResponse));
            }).fail( (e): void => {
                reject(e);
            });
        });
    }
    
    public getHorodateurSherbrooke() {
        return q.Promise((resolve, reject, notify) => {
            $.ajax({
                url: '../assets/data/Horodateur-Standard.json',
                dataType: 'text',
            }).done((jsonResponse: string) => {
                resolve(JSON.parse(jsonResponse));
            }).fail( (e): void => {
                reject(e);
            });
        });
    }

    public getCout(type: string, distance: number) {
        if(type == "auto") return distance * (7/100) * 1.05;
        else if (type == "bus") return 1;
        else return 0;
    }

    private CSVToArray(strData, strDelimiter?) {
      // Check to see if the delimiter is defined. If not,
      // then default to comma.
      strDelimiter = (strDelimiter || ",");
      // Create a regular expression to parse the CSV values.
      var objPattern = new RegExp((
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
      // Create an array to hold our data. Give the array
      // a default empty first row.
      var arrData = [[]];
      // Create an array to hold our individual pattern
      // matching groups.
      var arrMatches = null;
      // Keep looping over the regular expression matches
      // until we can no longer find a match.
      while (arrMatches = objPattern.exec(strData)) {
          // Get the delimiter that was found.
          var strMatchedDelimiter = arrMatches[1];
          // Check to see if the given delimiter has a length
          // (is not the start of string) and if it matches
          // field delimiter. If id does not, then we know
          // that this delimiter is a row delimiter.
          if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
              // Since we have reached a new row of data,
              // add an empty row to our data array.
              arrData.push([]);
          }
          // Now that we have our delimiter out of the way,
          // let's check to see which kind of value we
          // captured (quoted or unquoted).
          if (arrMatches[2]) {
              // We found a quoted value. When we capture
              // this value, unescape any double quotes.
              var strMatchedValue = arrMatches[2].replace(
              new RegExp("\"\"", "g"), "\"");
          } else {
              // We found a non-quoted value.
              var strMatchedValue = arrMatches[3];
          }
          // Now that we have our value string, let's add
          // it to the data array.
          arrData[arrData.length - 1].push(strMatchedValue);
      }
      // Return the parsed data.
      return (arrData);
  }

  private CSV2JSON(csv) {
      var array = this.CSVToArray(csv);
      var objArray = [];
      for (var i = 1; i < array.length; i++) {
          objArray[i - 1] = {};
          for (var k = 0; k < array[0].length && k < array[i].length; k++) {
              var key = array[0][k];
              objArray[i - 1][key] = array[i][k]
          }
      }

      var json = JSON.stringify(objArray);
      var str = json.replace(/},/g, "},\r\n");

      return str;
  }
}