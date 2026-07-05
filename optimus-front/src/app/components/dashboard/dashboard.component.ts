import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AbonadoService } from '../../services/abonado.service';
import { DashboardService, DashboardKpis } from '../../services/dashboard.service';
import { ItService } from '../../services/it.service';

import { ItDashComponent } from './sections/it-admin/it-dash.component';
import { DireccionDashComponent } from './sections/direccion/direccion.component';
import { MonitoreoDashComponent } from './sections/monitoreo/monitoreo.component';
import { ComercialComponent } from './sections/comercial/comercial.component';
import { TecnicaComponent } from './sections/tecnica/tecnica.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MENUS_POR_SECTOR } from '../../config/menus-sector';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MonitoreoDashComponent,
    ItDashComponent,
    DireccionDashComponent,
    ComercialComponent,
    TecnicaComponent,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('contentArea') contentArea!: ElementRef;

  public user = {
    nombre: '',
    sectorNombre: '',
    idSector: 0
  };

  public abonados: any[] = [];
  public listaUsuarios: any[] = [];
  public seccionActiva: string = 'dashboard';

  // Sector que se está MOSTRANDO en el content-area. Hoy arranca siempre
  // igual a user.idSector (no hay navegación de supervisión todavía, eso
  // quedó fuera de este alcance) — existe como variable separada para que
  // el switch de sectores no dependa de user.idSector directo.
  public sectorVisual: number = 0;

  // Contadores para los badges del sidebar (hoy solo se usan en Dirección).
  get badgesSidebar(): Record<string, number> {
    return this.user.idSector === 1
      ? { usuarios: this.listaUsuarios.length, abonados: this.abonados.length }
      : {};
  }

  // Nombre del módulo activo para mostrar en el encabezado (fuente única con SidebarComponent).
  get moduloActivoLabel(): string {
    const items = MENUS_POR_SECTOR[this.user.idSector] || [];
    const activo = items.find(i => (i.seccion || i.id) === this.seccionActiva);
    return activo?.label || '';
  }

  kpis: DashboardKpis = {
    totalAbonados: 0,
    eventosHoy: 0,
    ticketsAbiertos: 0,
    tecnicosActivos: 0,
    asignacionesHoy: 0
  };

  loadingKpis: boolean = true;
  currentDate: string = '';

  constructor(
    private authService: AuthService,
    private abonadoService: AbonadoService,
    private dashboardService: DashboardService,
    private itService: ItService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return;
    }

    this.user.nombre = localStorage.getItem('userName') || 'Operador';
    this.user.sectorNombre = localStorage.getItem('userSectorNombre') || 'General';
    const savedSector = localStorage.getItem('userSector');
    this.user.idSector = savedSector ? parseInt(savedSector, 10) : 0;
    this.sectorVisual = this.user.idSector;

    this.setCurrentDate();
    if (this.user.idSector !== 1) {
      // Dirección tiene su propio bloque de KPIs (/direccion/resumen);
      // no hace falta pedir también las KPIs genéricas.
      this.loadKpis();
    }
    this.inicializarDatosSector();
  }

  setCurrentDate(): void {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  loadKpis(): void {
    this.loadingKpis = true;
    this.dashboardService.getKpis().subscribe({
      next: (data) => {
        this.kpis = data;
        this.loadingKpis = false;
      },
      error: (err) => {
        console.error('Error al cargar KPIs:', err);
        this.loadingKpis = false;
      }
    });
  }

  onSeccionSeleccionada(seccion: string): void {
    this.seccionActiva = seccion;
    if (this.contentArea) {
      this.contentArea.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Bridge: TecnicaComponent es dueño de sus propios datos (PDS, servicios,
  // técnicos activos) — acá solo se reflejan sus conteos en las KPI cards
  // genéricas.
  onPdsActualizados(pds: any[]): void {
    if (this.kpis) this.kpis.eventosHoy = pds.length;
  }

  onServicesActualizados(services: any[]): void {
    if (this.kpis) (this.kpis as any).asignacionesHoy = services.length;
  }

  onTecnicosActivosActualizados(cantidad: number): void {
    if (this.kpis) this.kpis.tecnicosActivos = cantidad;
  }

  private inicializarDatosSector(): void {
    switch (this.user.idSector) {
      case 1:
        this.cargarUsuarios();
        this.cargarAbonados();
        break;
      case 3:
        break;
      case 4:
        this.cargarAbonados();
        break;
      case 5: // Técnica y Campo — vista de supervisión de todo el equipo:
        // necesita usuarios (para el roster de técnicos activos) y
        // abonados (fuente de datos del simulador de PDS).
        this.cargarUsuarios();
        this.cargarAbonados();
        break;
      case 6: // Comercial
        break;
      default:
        console.warn('Sector sin panel configurado:', this.user.idSector);
        break;
    }
  }

  cargarUsuarios(): void {
    this.itService.getUsuarios().subscribe({
      next: (res: any) => {
        this.listaUsuarios = res.usuarios || res;
      },
      error: (err: any) => console.error('Error cargando usuarios:', err)
    });
  }

  cargarAbonados(): void {
    this.abonadoService.getAllAbonados().subscribe({
      next: (response: any) => {
        this.abonados = response.abonados || [];
      },
      error: (err: any) => console.error('Error al cargar abonados:', err)
    });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}