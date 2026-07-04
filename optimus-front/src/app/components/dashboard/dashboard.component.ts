import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AbonadoService } from '../../services/abonado.service';
import { DashboardService, DashboardKpis } from '../../services/dashboard.service';

import { ItDashComponent } from './sections/it-admin/it-dash.component';
import { DireccionDashComponent } from './sections/direccion/direccion.component';
import { MonitoreoDashComponent } from './sections/monitoreo/monitoreo.component';
import { TecnicaComponent } from './sections/tecnica/tecnica.component'; 
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MonitoreoDashComponent,
    ItDashComponent,
    DireccionDashComponent,
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
  public pdsPendientes: any[] = []; // 🎯 Lista para los Pedidos de Servicio técnicos
  public listaUsuarios: any[] = [];
  public seccionActiva: string = 'dashboard';

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

    this.setCurrentDate();
    this.loadKpis();
    
    // Ejecutamos la carga general de la base de datos de abonados al arrancar
    this.cargarAbonados();
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
    if (seccion === 'dashboard') {
      this.seccionActiva = 'dashboard';
      if (this.contentArea) {
        this.contentArea.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    
    this.seccionActiva = seccion;

    // Si seleccionan la tarjeta de eventos (PDS Pendientes), generamos la lista aleatoria
    if (seccion === 'eventos') {
      this.cargarPdsPendientes();
    }

    setTimeout(() => {
      const el = document.querySelector('.sector-content');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  private inicializarDatosSector(): void {
    switch (this.user.idSector) {
      case 1:
        this.cargarUsuarios();
        break;
      case 3: 
      case 4:
        // Removido duplicado de cargarAbonados() porque ahora es global en el ngOnInit
        break;
      default:
        console.warn('Sector sin panel configurado:', this.user.idSector);
        break;
    }
  }

  cargarUsuarios(): void {
    this.authService.getUsers().subscribe({
      next: (res: any) => {
        this.listaUsuarios = res.usuarios || res;
      },
      error: (err: any) => console.error('Error cargando usuarios:', err)
    });
  }

  cargarAbonados(): void {
    this.abonadoService.getAllAbonados().subscribe({
      next: (response: any) => {
        this.abonados = response.abonados || response || [];
      },
      error: (err: any) => console.error('Error al cargar abonados desde la base de datos:', err)
    });
  }

  // 🎯 Generador Dinámico de PDS cruzando datos de alarmas y abonados reales
  cargarPdsPendientes(): void {
    // Catálogo tomado directamente de las descripciones de tu tabla CODIGOS_EVENTOS
    const catalogoAlarmas = [
      { evento: 'Pérdida de Conexión: Dispositivo offline', prioridad: 'Crítico' },
      { evento: 'Manipulación Detectada: Apertura de chasis', prioridad: 'Alta' },
      { evento: 'Batería Baja: Nivel inferior al 20%', prioridad: 'Baja' },
      { evento: 'Disparo de Alarma: Zona 02 Intrusión / Perimetral', prioridad: 'Crítico' },
      { evento: 'Falla de Sirena: Cortocircuito o cable cortado', prioridad: 'Alta' },
      { evento: 'Falla de Energía: Corte de red eléctrica 220V', prioridad: 'Baja' },
      { evento: 'Alarma de Inendio: Sensor de humo / calor activado', prioridad: 'Crítico' },
      { evento: 'Falla de Comunicación: Línea telefónica/GPRS cortada', prioridad: 'Crítico' }
    ];

    // Si por timing de red los abonados de la base de datos no bajaron, usamos un fallback preventivo
    const listaClientes = this.abonados && this.abonados.length > 0 ? this.abonados : [
      { NumeroDeAbonado: '1110', RazonSocial: 'Pepito Perez', TelefonoContacto: '11-6679-8757' },
      { NumeroDeAbonado: '1112', RazonSocial: 'Elixir S.A', TelefonoContacto: '11-4455-6677' },
      { NumeroDeAbonado: '1109', RazonSocial: 'Perozii Fiambreria', TelefonoContacto: '11-2383-7645' }
    ];

    // Mapeamos 6 registros mezclados de forma aleatoria con fechas de las últimas 24hs
    this.pdsPendientes = Array.from({ length: 6 }).map(() => {
      const clienteRandom = listaClientes[Math.floor(Math.random() * listaClientes.length)];
      const alarmaRandom = catalogoAlarmas[Math.floor(Math.random() * catalogoAlarmas.length)];
      
      const horasAleatorias = Math.floor(Math.random() * 24);
      const minutosAleatorios = Math.floor(Math.random() * 60);
      const fechaRandom = new Date();
      fechaRandom.setHours(fechaRandom.getHours() - horasAleatorias);
      fechaRandom.setMinutes(fechaRandom.getMinutes() - minutosAleatorios);

      return {
        nroCuenta: clienteRandom.NumeroDeAbonado || clienteRandom.nroCuenta,
        razonSocial: clienteRandom.RazonSocial || clienteRandom.razonSocial,
        telefono: clienteRandom.TelefonoContacto || clienteRandom.telefono || '11-0000-0000',
        evento: alarmaRandom.evento,
        prioridad: alarmaRandom.prioridad,
        fecha: fechaRandom
      };
    });
  }

  // 🎯 Canal Directo de Chat con plantilla prearmada para coordinación técnica rápida
  iniciarChatCliente(pds: any): void {
    console.log(`Abriendo canal de coordinación con: ${pds.razonSocial}`);
    const mensaje = encodeURIComponent(
      `Hola ${pds.razonSocial}, nos comunicamos de Optimus Systems. Detectamos una señal de "${pds.evento}" en tu cuenta Nro ${pds.nroCuenta}. ¿Te queda bien que coordinemos una visita técnica para revisarlo?`
    );
    const telefonoLimpio = pds.telefono.replace(/[^0-9]/g, '');
    const urlWhatsApp = `https://web.whatsapp.com/send?phone=${telefonoLimpio}&text=${mensaje}`;
    window.open(urlWhatsApp, '_blank');
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}