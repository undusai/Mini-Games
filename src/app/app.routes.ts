import { GameOneComponent } from './minigames/game-one/game-one.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'game-one',
        component: GameOneComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    }
];
