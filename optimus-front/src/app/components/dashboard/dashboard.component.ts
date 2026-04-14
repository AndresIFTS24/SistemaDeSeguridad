import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Datos del usuario logueado
  userName: string = '';
  userSectorNombre: string = '';
  idSector: number = 0;

  // Datos para las vistas
  listaUsuarios: any[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // 1. Recuperar info del localStorage
    this.userName = localStorage.getItem('userName') || 'Operador';
    this.userSectorNombre = localStorage.getItem('userSectorNombre') || 'General';
    this.idSector = Number(localStorage.getItem('userSector'));

    // 2. Si no hay token, redirigir al login (Seguridad básica)
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    // 3. Cargar datos específicos si es el sector IT (Sector 3) o Dirección (1)
    if (this.idSector === 1 || this.idSector === 3) {
      this.cargarUsuarios();
    }
  }

  cargarUsuarios(): void {
    this.authService.getUsers().subscribe({
      next: (res: any) => {
        this.listaUsuarios = res.usuarios;
      },
      error: (err) => console.error('Error cargando usuarios', err)
    });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}