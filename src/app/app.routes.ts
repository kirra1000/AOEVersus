import { Routes } from '@angular/router';
import { VersusComponent } from './components/versus/versus.component';
import { AppComponent } from './app.component';
import { TeammatesComponent } from './components/teammates/teammates.component';

export const routes: Routes = [
    { path: '**', component: VersusComponent },
    { path: 'versus', component: VersusComponent },
    { path: 'teammates', component: TeammatesComponent },
    { path: '', component: AppComponent },
];
