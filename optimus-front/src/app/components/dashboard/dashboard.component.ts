import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AbonadoService } from '../../services/abonado.service';
import { DashboardService, DashboardKpis } from '../../services/dashboard.service';

import { ItDashComponent } from './sections/it-admin/it-dash.component';
import { DireccionDashComponent } from './sections/direccion/direccion.component';
import { MonitoreoDashComponent } from './sections/monitoreo/monitoreo.component';

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
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild('contentArea') contentArea!: ElementRef;

  public user = {
    nombre: '',
    sectorNombre: '',
    idSector: 0
  };

  public abonados: any[] = [];
  public pdsPendientes: any[] = []; 
  public presupuestos: any[] = [];  
  public tecnicosActivos: any[] = [];
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
  
  // Referencia del temporizador para evitar fugas de memoria
  private pdsIntervalId: any;

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
    
    // 1. Desencadenamos las cargas de la base de datos
    this.loadKpis();
    this.cargarUsuarios(); 
    this.cargarAbonados();

    this.inicializarDatosSector();

    // 2. ⏳ INCREMENTO AUTOMÁTICO: Cada 20 segundos genera e integra 1 o 2 PDS nuevos
    this.pdsIntervalId = setInterval(() => {
      this.inyectarPdsEnTiempoReal();
    }, 20000);
  }

  ngOnDestroy(): void {
    // Limpiamos el intervalo cuando el usuario sale del componente o cierra sesión
    if (this.pdsIntervalId) {
      clearInterval(this.pdsIntervalId);
    }
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
        // Al pisar el objeto completo, respaldamos de inmediato la cantidad de PDS simulados en el array local
        this.kpis = data;
        if (this.kpis) {
          this.kpis.eventosHoy = this.pdsPendientes.length;
        }
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

    if (seccion === 'tickets') {
      this.cargarPresupuestosComerciales();
    }

    if (seccion === 'tecnicos') {
      this.filtrarTecnicosActivos();
    }

    setTimeout(() => {
      const el = document.querySelector('.sector-content');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  private inicializarDatosSector(): void {
    switch (this.user.idSector) {
      case 1:
        break;
      case 3: 
      case 4:
        break;
      default:
        console.warn('Sector sin panel configurado:', this.user.idSector);
        break;
    }
  }

  cargarUsuarios(): void {
    this.authService.getUsers().subscribe({
      next: (res: any) => {
        if (res && res.usuarios && Array.isArray(res.usuarios)) {
          this.listaUsuarios = res.usuarios;
        } else if (Array.isArray(res)) {
          this.listaUsuarios = res;
        } else if (res && res.data && Array.isArray(res.data)) {
          this.listaUsuarios = res.data;
        } else {
          this.listaUsuarios = [];
        }

        if (this.seccionActiva === 'tecnicos') {
          this.ejecutarFiltroUsuarios();
        }
      },
      error: (err: any) => console.error('Error cargando usuarios generales:', err)
    });
  }

  cargarAbonados(): void {
    this.abonadoService.getAllAbonados().subscribe({
      next: (response: any) => {
        this.abonados = response.abonados || response || [];
        
        // Si no se inicializaron todavía, forzamos la carga inicial inmediata
        if (this.pdsPendientes.length === 0) {
          this.cargarPdsPendientes();
        }
      },
      error: (err: any) => console.error('Error al cargar abonados desde la base de datos:', err)
    });
  }

  cargarPdsPendientes(): void {
    // Forzamos una base inicial de entre 2 y 4 PDS al abrir la sesión
    const cantidadInicial = Math.floor(Math.random() * 3) + 2;
    this.generarPdsAleatorios(cantidadInicial);
  }

  /**
   * Genera de forma incremental e inyecta PDS nuevos sin borrar los existentes
   */
  inyectarPdsEnTiempoReal(): void {
    const cantidadNuevos = Math.floor(Math.random() * 2) + 1; // Genera 1 o 2 nuevos
    this.generarPdsAleatorios(cantidadNuevos, true);
    console.log(`[Timer] Se añadieron ${cantidadNuevos} nuevos PDS en tiempo real.`);
  }

  private generarPdsAleatorios(cantidad: number, incremental: boolean = false): void {
    const catalogoAlarmas = [
      { evento: 'Pérdida de Conexión: Dispositivo offline', prioridad: 'Crítico' },
      { evento: 'Manipulación Detectada: Apertura de chasis', prioridad: 'Alta' },
      { evento: 'Batería Baja: Nivel inferior al 20%', prioridad: 'Baja' },
      { evento: 'Disparo de Alarma: Zona 02 Intrusión / Perimetral', prioridad: 'Crítico' },
      { evento: 'Falla de Sirena: Cortocorticuito o cable cortado', prioridad: 'Alta' },
      { evento: 'Falla de Energía: Corte de red eléctrica 220V', prioridad: 'Baja' },
      { evento: 'Alarma de Incendio: Sensor de humo / calor activado', prioridad: 'Crítico' },
      { evento: 'Falla de Comunicación: Línea telefónica/GPRS cortada', prioridad: 'Crítico' }
    ];

    const listaClientes = this.abonados && this.abonados.length > 0 ? this.abonados : [
      { NumeroDeAbonado: '1076', RazonSocial: 'YPF Central', TelefonoContacto: '11-6679-8757', Calle: 'Av. Corrientes', Numero: '1234', Ciudad: 'Buenos Aires' },
      { NumeroDeAbonado: '1091', RazonSocial: 'Personal Flow', TelefonoContacto: '11-4455-6677', Calle: 'Av. Santa Fe', Numero: '5678', Ciudad: 'Buenos Aires' },
      { NumeroDeAbonado: '1074', RazonSocial: 'Starbucks Palermo', TelefonoContacto: '11-2383-7645', Calle: 'Av. Rivadavia', Numero: '9012', Ciudad: 'Buenos Aires' },
      { NumeroDeAbonado: '1029', RazonSocial: 'Café Tortoni', TelefonoContacto: '11-9876-5432', Calle: 'Av. Cabildo', Numero: '3456', Ciudad: 'Buenos Aires' },
      { NumeroDeAbonado: '1067', RazonSocial: 'Techint S.A', TelefonoContacto: '11-1234-5678', Calle: 'Florida', Numero: '789', Ciudad: 'Buenos Aires' }
    ];

    const nuevosElementos = Array.from({ length: cantidad }).map(() => {
      const clienteRandom = listaClientes[Math.floor(Math.random() * listaClientes.length)];
      const alarmaRandom = catalogoAlarmas[Math.floor(Math.random() * catalogoAlarmas.length)];
      
      const horasAleatorias = Math.floor(Math.random() * 24);
      const minutosAleatorios = Math.floor(Math.random() * 60);
      const fechaRandom = new Date();
      fechaRandom.setHours(fechaRandom.getHours() - horasAleatorias);
      fechaRandom.setMinutes(fechaRandom.getMinutes() - minutosAleatorios);

      const calle = clienteRandom.Calle || clienteRandom.calle || clienteRandom.CALLE || '';
      const numero = clienteRandom.Numero || clienteRandom.numero || clienteRandom.NUMERO || '';
      
      let direccionFinal = 'Sin Dirección';
      if (calle) {
        direccionFinal = `${calle} ${numero}`.trim();
      } else if (clienteRandom.Direccion || clienteRandom.direccion || clienteRandom.DIRECCION) {
        direccionFinal = clienteRandom.Direccion || clienteRandom.direccion || clienteRandom.DIRECCION;
      }

      const ciudadFinal = clienteRandom.Ciudad || clienteRandom.ciudad || clienteRandom.CIUDAD || 'Desconocida';

      return {
        nroCuenta: clienteRandom.NumeroDeAbonado || clienteRandom.nroCuenta || clienteRandom.Numero_Abonado || 'S/N',
        razonSocial: clienteRandom.RazonSocial || clienteRandom.razonSocial || clienteRandom.Nombre || 'Cliente Temporal',
        telefono: clienteRandom.TelefonoContacto || clienteRandom.telefono || '11-0000-0000',
        evento: alarmaRandom.evento,
        prioridad: alarmaRandom.prioridad,
        fecha: fechaRandom,
        direccion: direccionFinal, 
        ciudad: ciudadFinal      
      };
    });

    if (incremental) {
      // Unimos los nuevos eventos arriba de la lista existente sin romper lo anterior
      this.pdsPendientes = [...nuevosElementos, ...this.pdsPendientes];
    } else {
      this.pdsPendientes = nuevosElementos;
    }

    // Sincronizamos de inmediato la variable del KPI mapeada a la tarjeta del template
    if (this.kpis) {
      this.kpis.eventosHoy = this.pdsPendientes.length;
    }
  }

  cargarPresupuestosComerciales(): void {
    this.dashboardService.getPresupuestosComerciales().subscribe({
      next: (data: any[]) => {
        this.presupuestos = data || [];
        if (this.kpis) {
          this.kpis.ticketsAbiertos = this.presupuestos.length;
        }
      },
      error: (err) => {
        console.error('Error al cargar presupuestos reales desde la BD:', err);
        this.presupuestos = [];
        if (this.kpis) this.kpis.ticketsAbiertos = 0;
      }
    });
  }

  iniciarChatCliente(pds: any): void {
    const mensaje = encodeURIComponent(
      `Hola ${pds.razonSocial}, nos comunicamos de Optimus Systems. Detectamos una señal de "${pds.evento}" en tu cuenta Nro ${pds.nroCuenta}. ¿Te queda bien que coordinemos una visita técnica para revisarlo?`
    );
    const telefonoLimpio = pds.telefono.replace(/[^0-9]/g, '');
    const urlWhatsApp = `https://web.whatsapp.com/send?phone=${telefonoLimpio}&text=${mensaje}`;
    window.open(urlWhatsApp, '_blank');
  }

  coordinarPresupuesto(presupuesto: any): void {
    const identificadorCliente = presupuesto.ID_Abonado 
      ? `Abonado Nro ${presupuesto.ID_Abonado} (${presupuesto.RazonSocial})` 
      : `la nueva instalación solicitada por ${presupuesto.RazonSocial} en ${presupuesto.Direccion}`;

    const mensaje = encodeURIComponent(
      `Hola, nos comunicamos del área técnica de Optimus Systems para coordinar el armado del equipamiento aprobado bajo el Presupuesto ${presupuesto.NroPresupuesto} correspondiente a ${identificadorCliente}. ¿Qué día de la semana te quedaría cómodo para que asistan los técnicos?`
    );

    const telefonoLimpio = presupuesto.TelefonoContacto ? presupuesto.TelefonoContacto.replace(/[^0-9]/g, '') : '';
    const urlWhatsApp = `https://web.whatsapp.com/send?phone=${telefonoLimpio}&text=${mensaje}`;
    window.open(urlWhatsApp, '_blank');
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  filtrarTecnicosActivos(): void {
    if (!this.listaUsuarios || this.listaUsuarios.length === 0) {
      this.authService.getUsers().subscribe({
        next: (res: any) => {
          if (res && res.usuarios && Array.isArray(res.usuarios)) {
            this.listaUsuarios = res.usuarios;
          } else if (Array.isArray(res)) {
            this.listaUsuarios = res;
          } else {
            this.listaUsuarios = [];
          }
          this.ejecutarFiltroUsuarios();
        },
        error: (err) => {
          console.error('Error al re-cargar usuarios para técnicos:', err);
          this.tecnicosActivos = [];
          if (this.kpis) this.kpis.tecnicosActivos = 0;
        }
      });
    } else {
      this.ejecutarFiltroUsuarios();
    }
  }

  private ejecutarFiltroUsuarios(): void {
    if (!this.listaUsuarios || this.listaUsuarios.length === 0) {
      this.tecnicosActivos = [];
      if (this.kpis) this.kpis.tecnicosActivos = 0;
      return;
    }

    this.tecnicosActivos = this.listaUsuarios.filter((u: any) => {
      const nombreRol = u.NombreRol ? String(u.NombreRol).trim().toLowerCase() : '';
      const tieneRolTecnico = (nombreRol === 'técnico' || nombreRol === 'tecnico');
      const estaActivo = (u.Activo === 1 || u.Activo === true || String(u.Activo) === '1');
      return tieneRolTecnico && estaActivo;
    });

    if (this.kpis) {
      this.kpis.tecnicosActivos = this.tecnicosActivos.length;
    }
  }
}