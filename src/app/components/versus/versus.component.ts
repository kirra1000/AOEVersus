import { AfterViewInit, ChangeDetectorRef, Component, output, ViewChild } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ProgressBarMode, MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { GameData } from '../../types';
import { catchError, forkJoin, Observable, throwError } from 'rxjs';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';


// import fetch from "node-fetch";
// import * as fs from 'fs';

type ExportStructure = {
  gameId: number;
  playerId: number;
  opponentId: number;
  result: string;
  map: string;
  date: string;
  gamelink: string;
  alternativeGameLink: string;
};

@Component({
  selector: 'app-versus',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule, MatSelectModule, MatTableModule, CurrencyPipe, MatProgressBarModule, MatSelectModule, MatRadioModule, MatRadioModule, MatPaginatorModule, DecimalPipe, MatSortModule, DatePipe],
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-AU' }],
  templateUrl: './versus.component.html',
  styleUrl: './versus.component.scss'
})

// gameID: 134024452 Opponent won: 8770503 The profile ID: 8770503 We are at 322 The updated at: 2024-06-25 The Map: Gorge Total games: 1 Player won :0 Opponent won :1 Game Ids: 134024452
// Last column: total wins, total losses, total games, win rate, 



export class VersusComponent implements AfterViewInit {

  outputTable = new MatTableDataSource<ExportStructure>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.outputTable.paginator = this.paginator;
    this.outputTable.sort = this.sort;
  }


  mode: ProgressBarMode = 'determinate';
  ifLoading = false;

  displayedColumns: string[] = ['gameId', 'playerId', 'opponentId', 'result', 'map', 'date', 'gamelink', 'alternativeGameLink'];


  players = [
    { name: 'Anotand', profileIds: [8432378, 11443994, 15908244] },
    { name: 'Baltune', profileIds: [4583101, 11635995, 17669489] },
    { name: 'Beastyqt', profileIds: [1270139, 11962132, 17316252, 8139502] },
    { name: 'Big bees', profileIds: [3142875] },
    { name: 'Blade55555', profileIds: [193771] },
    { name: 'benghisKhan', profileIds: [7273067] },
    { name: 'Divine', profileIds: [585764, 9030482] },
    { name: 'Demu', profileIds: [6943917, 9087979] },
    { name: 'e.sorcerer', profileIds: [199837, 4067151, 5924659, 2138271] },
    { name: 'Faye', profileIds: [1036727] },
    { name: 'Fitzbro', profileIds: [16449840, 707064] },
    { name: 'GiveUAnxiety', profileIds: [3553830] },
    { name: 'Hatsimale', profileIds: [6989434, 11655695, 11621759, 11676991, 11770944, 5184393, 8507263] },
    { name: 'Kasva', profileIds: [1224481, 2759481, 10322245] },
    { name: 'Kiljardi', profileIds: [3813060, 8840075] },
    { name: 'Lash', profileIds: [3877183, 9860780] },
    { name: 'LoueMT', profileIds: [8354416] },
    { name: 'Matiz', profileIds: [3671968] },
    { name: 'MrMonday', profileIds: [3145086, 17144484] },
    { name: 'Myriad', profileIds: [769187, 11915979] },
    { name: 'Msn.dk', profileIds: [7614140] },
    { name: 'Peppino piggg', profileIds: [6552004] },
    { name: 'Praetorian', profileIds: [7188408] },
    { name: 'Puppypaw', profileIds: [8446710, 8783044, 3592906] },
    { name: 'Renion', profileIds: [5065284, 10939549, 11548504, 9287427, 10411496, 10832054, 17971186, 19563347, 15418341] },
    { name: 'Rob the viking', profileIds: [6914972] },
    { name: 'Sky-Fox', profileIds: [9189043, 10477434] },
    { name: 'Snoopa', profileIds: [3587904, 4492346] },
    { name: 'Steel Commander', profileIds: [8989957, 17256881] },
    { name: 'Steff', profileIds: [3549470] },
    { name: 'Stilicho', profileIds: [16400848, 1289057, 8770503] },
    { name: 'Valdemar', profileIds: [2942077, 10599576] },
    { name: 'wntdSAS', profileIds: [2347873] }
  ];

  // These are just defaults. Don't reset these in the program later.
  playerIdsInput = '585764';
  opponentsIdsInput = '2942077';

  // Method called when a player is selected from the dropdown
  onPlayerChange(playerIds: any) {
    this.playerIdsInput = playerIds;
  }

  // Method called when an opponent is selected from the dropdown
  onOpponentChange(opponentIds: any) {
    this.opponentsIdsInput = opponentIds;
  }

  constructor(private http: HttpClient, private changeDetectorRefs: ChangeDetectorRef) { }

  playerIds: number[] = [];
  opponentsIds: number[] = [];
  requests: any[] = [];
  requestResults = new Array();
  output: string = '';

  playerWins = 0;
  opponentsWins = 0;
  gameIds: any[] = [];
  playerName = '';
  opponentName = '';
  totalGames = 0;
  gamesWon = 0;
  winRate = 0;


  public delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  public getAllIndexes(arr: any[], val: any) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
      indexes.push(i);
    }
    return indexes;
  }



  public reset() {
    this.playerWins = 0;
    this.opponentsWins = 0;
    this.gameIds = [];
    this.output = '';
    this.requestResults = [];
    this.totalGames = 0;
    this.gamesWon = 0;
    this.winRate = 0;

    this.playerIds = [];
    this.opponentsIds = [];

    this.requests = [];

    this.output = '';
  }

  public getGameRecordBetweenNew() {

    this.outputTable.data = [];

    this.reset();

    this.playerIdsInput = this.playerIdsInput.toString();
    this.opponentsIdsInput = this.opponentsIdsInput.toString();

    if (this.playerIdsInput.includes(' ')) {
      this.playerIdsInput = this.playerIdsInput.replace(/\s/g, "");
    }
    this.playerIds = this.playerIdsInput.split(',').map(Number);

    if (this.opponentsIdsInput.includes(' ')) {
      this.opponentsIdsInput = this.opponentsIdsInput.replace(/\s/g, "");
    }

    this.opponentsIds = this.opponentsIdsInput.split(',').map(Number);

    this.playerIds.forEach(playerElement => {
      this.opponentsIds.forEach(oppoElement => {
        this.requests.push('https://aoe4world.com/api/v0/players/' + playerElement + '/games?opponent_profile_id=' + oppoElement);
      });
    });

    //   submit() {
    //     const combined = forkJoin([
    //         this.data.getUsers(),
    //         this.otherData.getUnitAssignments()
    //     ]);
    //     combined.subscribe((response) => {
    //         // you will get 2 arrays in response
    //         this.dataSource.push(response[0].rows);
    //         this.dataSource.push(response[1].rows);
    //     });
    // }

    let totalArray: ExportStructure[] = [];
    this.ifLoading = true;

    const combined = forkJoin(this.requests.map(request => this.getData(request)));

    combined.subscribe((multipleResponses) => {
      multipleResponses.forEach(response => {
        if (response.hasOwnProperty('count') && response.count > 0) {
          let resultArray: ExportStructure[] = [];
          let formattedResponse: GameData = response as GameData;
          formattedResponse.games.forEach(game => {
            if (game.leaderboard == 'rm_solo') {
              let newEntry: ExportStructure;
              newEntry = { gameId: game.game_id, playerId: formattedResponse.filters.profile_ids[0], opponentId: parseInt(formattedResponse.filters.opponent_profile_id), result: '', map: '', date: '', gamelink: '', alternativeGameLink: '' };

              // console.log('profile_ids: ', formattedResponse.filters.profile_ids[0]);
              // console.log('The game profile Id: ', game.teams[0][0].player.profile_id);
              // console.log('Do they match: ', game.teams[0][0].player.profile_id == formattedResponse.filters.profile_ids[0]);
              // console.log('The game result: ', game.teams[0][0].player.result);

              if (game.teams[0][0].player.profile_id == formattedResponse.filters.profile_ids[0]) {
                if (game.teams[0][0].player.result == 'win') {
                  newEntry.result = 'win';
                } else {
                  newEntry.result = 'loss';
                }
              } else {
                if (game.teams[0][0].player.result == 'win') {
                  newEntry.result = 'loss';
                } else {
                  newEntry.result = 'win';
                }
              }
              newEntry.map = game.map;
              newEntry.date = game.updated_at;
              newEntry.gamelink = 'https://aoe4world.com/players/' + newEntry.playerId + '/games/' + newEntry.gameId;
              newEntry.alternativeGameLink = 'https://aoe4world.com/players/' + newEntry.opponentId + '/games/' + newEntry.gameId;

              resultArray.push(newEntry);
            }
          });
          totalArray.push(...resultArray);
        }
      });
      this.ifLoading = false;
      this.outputTable.data = totalArray;
      this.gamesWon = this.gamesWon + totalArray.filter(game => game.result == 'win').length;
      this.totalGames = this.totalGames + totalArray.length;
      this.winRate = (this.gamesWon / this.totalGames) * 100;
    });


  }

  getData(request: string): Observable<any> {
    return this.http.get<any>(request).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }

    // Log the error to the console (or send it to a logging service)
    console.error(errorMessage);

    // Return a user-friendly error message
    return throwError(() => new Error(errorMessage));
  }

}
