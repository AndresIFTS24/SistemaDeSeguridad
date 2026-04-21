import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Servicios
import { AuthService } from '../../services/auth.service';
import { AbonadoService } from '../../services/abonado.service'; 

// Componentes de Sectores (Rutas según tu estructura de carpetas)
import { ItDashComponent } from './sections/it-admin/it-dash.component'; 
import { DireccionDashComponent } from './sections/direccion/direccion.component';
import { MonitoreoDashComponent } from './sections/monitoreo/monitoreo.component';

// Componentes Globales (Navbar y Sidebar)
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
    NavbarComponent, 
    SidebarComponent 
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  /**
   * Objeto de usuario que se pasa a Navbar y Sidebar.
   * idSector es vital para el [ngSwitch] del HTML.
   */
  public user = {
    nombre: '',
    sectorNombre: '',
    idSector: 0
  };

  // Listas de datos para los sub-componentes
  public abonados: any[] = [];
  public listaUsuarios: any[] = [];

  constructor(
    private authService: AuthService, 
    private abonadoService: AbonadoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Verificación de seguridad básica
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return;
    }

    // 2. Carga de datos desde LocalStorage (guardados durante el Login)
    this.user.nombre = localStorage.getItem('userName') || 'Operador';
    this.user.sectorNombre = localStorage.getItem('userSectorNombre') || 'General';
    
    // Convertimos a número para que el ngSwitchCase funcione correctamente
    const savedSector = localStorage.getItem('userSector');
    this.user.idSector = savedSector ? parseInt(savedSector, 10) : 0;

    console.log('--- Dashboard Inicializado ---');
    console.log('Usuario:', this.user.nombre);
    console.log('Sector ID:', this.user.idSector);

    // 3. Disparar carga de datos según corresponda
    this.inicializarDatosSector();
  }

  /**
   * Decide qué datos pedir a la API según quién esté logueado
   */
  private inicializarDatosSector(): void {
    switch (this.user.idSector) {
      case 1: // Dirección General
        this.cargarUsuarios();
        this.cargarAbonados();
        break;
      case 3: // Infraestructura e IT
        this.cargarUsuarios();
        break;
      case 4: // Monitoreo
        this.cargarAbonados();
        break;
      default:
        console.warn('El sector actual no tiene peticiones de datos asignadas.');
        break;
    }
  }

  /**
   * Carga la lista de usuarios para los paneles administrativos
   */
  cargarUsuarios(): void {
    this.authService.getUsers().subscribe({
      next: (res: any) => {
        // Adaptamos a tu respuesta de API (Array directo o propiedad usuarios)
        this.listaUsuarios = res.usuarios || res;
      },
      error: (err: any) => console.error('Error cargando usuarios:', err)
    });
  }

  /**
   * Carga la lista de abonados desde Clever Cloud
   */
  cargarAbonados(): void {
    this.abonadoService.getAllAbonados().subscribe({
      next: (response: any) => {
        // Extraemos el array desde la propiedad 'abonados' del JSON
        this.abonados = response.abonados || []; 
        console.log('Abonados cargados:', this.abonados.length);
      },
      error: (err: any) => {
        console.error('Error al cargar abonados:', err);
      }
    });
  }

  /**
   * Limpia la sesión y vuelve al login
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}