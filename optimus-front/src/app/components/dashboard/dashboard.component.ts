import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Servicios
import { AuthService } from '../../services/auth.service';
import { AbonadoService } from '../../services/abonado.service'; 

// Componentes de Sectores
import { ItDashComponent } from './sections/it-admin/it-dash.component'; 
import { DireccionDashComponent } from './sections/direccion/direccion.component';
import { MonitoreoDashComponent } from './sections/monitoreo/monitoreo.component';

// Componentes Globales (Navbar y Sidebar)
// NOTA: Ajusta estas rutas según donde tengas guardados estos componentes
import { NavbarComponent } from '../navbar/navbar.component'; 
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MonitoreoDashComponent,
    ItDashComponent,
    DireccionDashComponent,
    NavbarComponent, // <--- Agregado para quitar error NG8001
    SidebarComponent // <--- Agregado para quitar error NG8001
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  // Objeto unificado para el usuario
  public user = {
    name: '',
    sectorNombre: '',
    idSector: 0
  };

  // Listas de datos
  public abonados: any[] = [];
  public listaUsuarios: any[] = [];

  constructor(
    private authService: AuthService, 
    private abonadoService: AbonadoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Verificación de seguridad
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return;
    }

    // 2. Carga de datos del usuario desde LocalStorage
    this.user.name = localStorage.getItem('userName') || 'Operador';
    this.user.sectorNombre = localStorage.getItem('userSectorNombre') || 'General';
    this.user.idSector = Number(localStorage.getItem('userSector'));

    // 3. Inicializar datos según el sector
    this.inicializarDatosSector();
  }

  private inicializarDatosSector(): void {
    switch (this.user.idSector) {
      case 1: // Dirección
        this.cargarUsuarios();
        this.cargarAbonados();
        break;
      case 3: // IT / Administración
        this.cargarUsuarios();
        break;
      case 4: // Monitoreo
        this.cargarAbonados();
        break;
    }
  }

  cargarUsuarios(): void {
    this.authService.getUsers().subscribe({
      next: (res: any) => {
        // Ajustamos según la respuesta típica de tu API
        this.listaUsuarios = res.usuarios || res;
      },
      error: (err: any) => console.error('Error cargando usuarios', err)
    });
  }

  cargarAbonados(): void {
    this.abonadoService.getAllAbonados().subscribe({
      next: (res: any) => {
        this.abonados = res;
      },
      error: (err: any) => console.error('Error cargando abonados', err)
    });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}