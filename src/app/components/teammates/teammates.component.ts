import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { commonPlayers, GameData } from '../../types';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';
import { catchError, forkJoin, Observable, throwError } from 'rxjs';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';

type ExportStructure = {
  gameId: number;
  playerId: number;
  teammateId: number;
  result: string;
  map: string;
  date: string;
  gamelink: string;
  alternativeGameLink: string;
};

@Component({
  selector: 'app-teammates',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule, MatSelectModule, MatTableModule, CurrencyPipe, MatProgressBarModule, MatSelectModule, MatRadioModule, MatPaginatorModule, DecimalPipe, MatSortModule, DatePipe],
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-AU' }],
  templateUrl: './teammates.component.html',
  styleUrl: './teammates.component.scss'
})

export class TeammatesComponent {
  outputTable = new MatTableDataSource<ExportStructure>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  players = commonPlayers;

  // Default ids
  playerIdsInput = '585764';
  teammatesIdsInput = '2942077';

  playerIds: number[] = [];
  teammatesIds: number[] = [];
  requests: any[] = [];

  mode: ProgressBarMode = 'determinate';
  ifLoading = false;

  constructor(private http: HttpClient, private changeDetectorRefs: ChangeDetectorRef) {
    this.players.sort((a, b) => a.name.localeCompare(b.name));
  }

  ngAfterViewInit() {
    this.outputTable.paginator = this.paginator;
    this.outputTable.sort = this.sort;
  }

  // Method called when a player is selected from the dropdown
  onPlayerChange(playerIds: any) {
    this.playerIdsInput = playerIds;
  }

  // Method called when an Teammate is selected from the dropdown
  onTeammateChange(teammateIds: any) {
    this.teammatesIdsInput = teammateIds;
  }

  getGamesPlayedWith() {
    this.outputTable.data = [];

    this.playerIdsInput = this.playerIdsInput.toString();
    this.teammatesIdsInput = this.teammatesIdsInput.toString();

    if (this.playerIdsInput.includes(' ')) {
      this.playerIdsInput = this.playerIdsInput.replace(/\s/g, "");
    }
    this.playerIds = this.playerIdsInput.split(',').map(Number);

    if (this.teammatesIdsInput.includes(' ')) {
      this.teammatesIdsInput = this.teammatesIdsInput.replace(/\s/g, "");
    }

    this.teammatesIds = this.teammatesIdsInput.split(',').map(Number);

    this.playerIds.forEach(playerElement => {
      this.teammatesIds.forEach(teammateElement => {
        this.requests.push('https://aoe4world.com/api/v0/players/' + playerElement + 'games?leaderboard=rm_2v2,rm_3v3,rm_4v4');
      });
    });

    let totalArray: ExportStructure[] = [];
    this.ifLoading = true;

    const initialRequests = forkJoin(this.requests.map(request => this.getData(request)));

    initialRequests.subscribe((multipleResponses) => {
      multipleResponses.forEach(response => {
        console.log('Response: ', response);
        let playerElement = response.filters.profile_ids[0];
        if (response.hasOwnProperty('total_count') && response.total_count > 0) {
          let newRequests = [];
          // get total_count divide by 50 and round up
          let pagesToSearch = Math.ceil(response.total_count / 50);
          for (let i = 1; i <= pagesToSearch; i++) {
            newRequests.push('https://aoe4world.com/api/v0/players/' + playerElement + 'games?leaderboard=rm_2v2,rm_3v3,rm_4v4&page=' + i);
          }

          // let resultArray: ExportStructure[] = [];
          // let formattedResponse: GameData = response as GameData;
          // formattedResponse.games.forEach(game => {
          //   if (game.leaderboard == 'rm_solo') {
          //     let newEntry: ExportStructure;
          //     newEntry = { gameId: game.game_id, playerId: formattedResponse.filters.profile_ids[0], teammateId: parseInt(formattedResponse.filters.Teammate_profile_id), result: '', map: '', date: '', gamelink: '', alternativeGameLink: '' };

          //     // console.log('profile_ids: ', formattedResponse.filters.profile_ids[0]);
          //     // console.log('The game profile Id: ', game.teams[0][0].player.profile_id);
          //     // console.log('Do they match: ', game.teams[0][0].player.profile_id == formattedResponse.filters.profile_ids[0]);
          //     // console.log('The game result: ', game.teams[0][0].player.result);

          //     if (game.teams[0][0].player.profile_id == formattedResponse.filters.profile_ids[0]) {
          //       if (game.teams[0][0].player.result == 'win') {
          //         newEntry.result = 'win';
          //       } else {
          //         newEntry.result = 'loss';
          //       }
          //     } else {
          //       if (game.teams[0][0].player.result == 'win') {
          //         newEntry.result = 'loss';
          //       } else {
          //         newEntry.result = 'win';
          //       }
          //     }
          //     newEntry.map = game.map;
          //     newEntry.date = game.updated_at;
          //     newEntry.gamelink = 'https://aoe4world.com/players/' + newEntry.playerId + '/games/' + newEntry.gameId;
          //     newEntry.alternativeGameLink = 'https://aoe4world.com/players/' + newEntry.teammateId + '/games/' + newEntry.gameId;

          //     resultArray.push(newEntry);
          //   }
          // });
          // totalArray.push(...resultArray);
        }
      });
      this.ifLoading = false;
      // this.outputTable.data = totalArray;
      // this.gamesWon = this.gamesWon + totalArray.filter(game => game.result == 'win').length;
      // this.totalGames = this.totalGames + totalArray.length;
      // this.winRate = (this.gamesWon / this.totalGames) * 100;
    });

  }

  getTeammateResults(inputString: GameData) {
    inputString.games.forEach(game => {
      // Determine the team
      let inTeamArray = 1;
      game.teams.forEach(team => {
        team.forEach(player => {
          console.log('Player: ', player);
        });

      });

      // [0].player.profile_id == inputString.filters.profile_ids[0]
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
