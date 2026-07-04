import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AbonadosComponent } from './components/abonados/abonados.component';
import { TecnicaComponent } from './components/dashboard/sections/tecnica/tecnica.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'abonados', component: AbonadosComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
  { path: 'dashboard/sections/tecnica', component: TecnicaComponent },
];