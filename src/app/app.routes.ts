import { Routes } from '@angular/router';
import { VersusComponent } from './components/versus/versus.component';
import { AppComponent } from './app.component';
import { TeammatesComponent } from './components/teammates/teammates.component';
import { IdleTCtimeComponent } from './components/idle-tctime/idle-tctime.component';

export const routes: Routes = [
    { path: 'idletc', component: IdleTCtimeComponent },
    { path: 'versus', component: VersusComponent },
    { path: 'teammates', component: TeammatesComponent },
    { path: '**', component: VersusComponent }
];
