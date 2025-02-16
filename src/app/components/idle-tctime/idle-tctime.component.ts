import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DatePipe } from '@angular/common';


// import {MatTimepickerModule, MatTimepickerOption} from '@angular/material/timepicker';

export interface Time {
  value: number;
  viewValue: string;
}


@Component({
  selector: 'app-idle-tctime',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, FormsModule, MatProgressBarModule, MatOptionModule, MatSelectModule, MatFormFieldModule, DatePipe],
  templateUrl: './idle-tctime.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './idle-tctime.component.scss'
})

export class IdleTCtimeComponent {


  idleTCTime?: number = 0;

  // Winter game TC at like 8 minutes
  // profileId?: number = 12220294;
  // gameId?: number = 166077802;

  // Beasty game On French TC at 15 minutes
  // profileId?: number = 1270139;
  // gameId?: number = 165802812;

  // Beasty game on Malian
  profileId?: number = 1270139;
  gameId?: number = 165808346;

  startTime: any;
  villagerTrainTime: number = 20;
  perfectAmountOfVills: number = 0;
  totalvillCount: number = 0;

  // French Values
  frenchFeudal = 1.15;
  frenchCastle = 1.20;
  frenchImperial = 1.25;

  times: Time[] = [];
  selectedTime: number = 0;

  villagerId: string = '11119068';
  townCenterId: string = '11119069';
  isLoading = false;

  constructor(private http: HttpClient) {
    for (let i = 0; i < 361; i++) {
      this.times.push({ value: i * 20, viewValue: this.timeConvertToString(i * 20) });
    }
  }

  calculateIdleTC() {
    this.resetValues();
    this.isLoading = true;

    // let url = '/api/players/1270139/games/165940460/summary';

    let url = '/api/players/' + this.profileId + '/games/' + this.gameId + '/summary';
    // this.http.get(url).subscribe((data: any) => {
    //   let theData = data;
    //   console.log(theData);
    //   this.isLoading = false;
    // });

    this.http.get<any>(url).subscribe((data: any) => {
      let theData = data;

      theData.players.forEach((player: any) => {
        if (player.profile_id === this.profileId) {

          console.log(player);

          switch (player.civilization) {
            case 'french':
              this.villagerTrainTime = this.villagerTrainTime / this.frenchFeudal;
              console.log('French');
              break;
            case 'english':
              break;
            case 'hre':
              break;
            case 'ayyubid':
              break;
            case 'mongol':
              break;
            case 'delhi':
              break;
            case 'ootd':
              break;
            default:
          }

          player.build_order.forEach((bo: any) => {
            if (bo.id == this.villagerId) {
              // Setup and choosing duration
              let villagerArray = bo.finished
              let totalDuration = theData.duration;
              let actualTimeUsed = 0;
              if (this.selectedTime >= totalDuration) {
                actualTimeUsed = totalDuration;
              } else {
                actualTimeUsed = this.selectedTime;
              }

              console.log('Actual time use: ' + actualTimeUsed);

              // Get the length of the finished vills up to the actualTimeUsed
              this.totalvillCount = 0;
              villagerArray.forEach((villagerTime: any) => {
                // convert duration to number if string
                let durationNumber = 0;
                if (typeof villagerTime === 'string') {
                  durationNumber = parseInt(villagerTime);
                } else {
                  durationNumber = villagerTime;
                }

                if (durationNumber <= actualTimeUsed) {
                  this.totalvillCount += 1;
                } else { }

              });

              // Multiple TCs
              let additionalTimeIdle = 0;
              player.build_order.forEach((bo: any) => {
                if (bo.id == this.townCenterId) {
                  let townCenterArray = bo.constructed;
                  // for each towncenter, work out how much vills could be made up until the actualTimeUsed
                  townCenterArray.forEach((townCenterTime: any) => {
                    // Theoretical vills made
                    if (townCenterTime != 0) {
                      console.log('Actual Time used: ' + actualTimeUsed);
                      console.log('Town Center Time: ' + townCenterTime);
                      let additionalVills = Math.floor((actualTimeUsed - townCenterTime) / this.villagerTrainTime);

                      console.log('Additional vills: ' + additionalVills);
                      if (additionalVills > 0) {
                        this.perfectAmountOfVills += additionalVills;
                        additionalTimeIdle = additionalVills * this.villagerTrainTime;

                      }
                    }
                  });
                }
              });

              console.log('Perfect amount of vills: ' + this.perfectAmountOfVills);

              // console.log('Last villager made: ' + lastVillagerMade);
              // console.log('Total vills made: ' + this.totalvillCount);
              // console.log('Perfect amount of vills: ' + this.perfectAmountOfVills);

              // Last imperfect vill train time


              console.log('Total vills made: ' + this.totalvillCount);
              console.log('Last trained vill in the time: ' + villagerArray[this.totalvillCount - 1]);

              let lastPerfectVillTrainTime = this.villagerTrainTime * Math.floor(actualTimeUsed / this.villagerTrainTime);
              console.log('Last perfect vill train time: ' + lastPerfectVillTrainTime);

              // If the vill count is the same the perfect amount of vills
              this.perfectAmountOfVills = this.perfectAmountOfVills + Math.floor(actualTimeUsed / this.villagerTrainTime) + 6;
              console.log('Perfect amount of vills: ' + this.perfectAmountOfVills);

              // Get the perfect vill amount and get the most recent vill count
              console.log('adsf: ' + (this.totalvillCount - 6) * this.villagerTrainTime);
              console.log('adsf: ' + villagerArray[this.totalvillCount - 1]);

              this.idleTCTime = 1000 * (Math.floor(villagerArray[this.totalvillCount - 1] - ((this.totalvillCount - 6) * this.villagerTrainTime)) + additionalTimeIdle);
            }
          });

          this.isLoading = false;
        }
      }
      );
    })
  };

  timeConvertToString(time: number) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) {
      return minutes + ':0' + seconds;
    }

    return minutes + ':' + seconds;
  }

  checkAdditionalModifiers() {
    // French 15%, 15%, 20%, 25%
    // Song and exit song
    // Japan
    // English castle landmark
    // HRE Swabia
    // Ottoman vizier
    // Ayyubid
    // Mongol Double Produce
    // Delhi Keeps when the tech researches
    // OOTD speed and swabia
  }

  resetValues() {
    this.villagerTrainTime = 20;
    this.perfectAmountOfVills = 0;
    this.totalvillCount = 0;
  }



}
