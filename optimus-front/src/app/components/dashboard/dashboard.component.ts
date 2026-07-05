import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AuthService } from '../../services/auth.service';
import { AbonadoService } from '../../services/abonado.service';
import { DashboardService, DashboardKpis } from '../../services/dashboard.service';

import { ItDashComponent } from './sections/it-admin/it-dash.component';
import { DireccionDashComponent } from './sections/direccion/direccion.component';
import { MonitoreoDashComponent } from './sections/monitoreo/monitoreo.component';
import { ComercialComponent } from './sections/comercial/comercial.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MonitoreoDashComponent,
    ComercialComponent,
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
  public servicesCoordinados: any[] = []; 
  public seccionActiva: string = 'dashboard';

  public tecnicoSeleccionado: any = null;
  public mapUrlSafe: SafeResourceUrl | null = null;

  kpis: DashboardKpis = {
    totalAbonados: 0,
    eventosHoy: 0,
    ticketsAbiertos: 0,
    tecnicosActivos: 0,
    asignacionesHoy: 0 // 🎯 CORREGIDO: Volvió a español tal como lo tenías definido
  };

  loadingKpis: boolean = true;
  currentDate: string = '';
  
  private pdsIntervalId: any;

  constructor(
    private authService: AuthService,
    private abonadoService: AbonadoService,
    private dashboardService: DashboardService,
    private router: Router,
    private sanitizer: DomSanitizer
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
    this.cargarUsuarios(); 
    this.cargarAbonados();
    this.inicializarDatosSector();

    this.pdsIntervalId = setInterval(() => {
      this.inyectarPdsEnTiempoReal();
    }, 20000);
  }

  ngOnDestroy(): void {
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
        this.kpis = data;
        if (this.kpis) {
          this.kpis.eventosHoy = this.pdsPendientes.length;
          if ('asignacionesHoy' in this.kpis) {
            (this.kpis as any).asignacionesHoy = this.servicesCoordinados.length;
          }
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
    // Si se hace clic en la sección principal del dashboard
    if (seccion === 'dashboard') {
      this.seccionActiva = 'dashboard';
      if (this.contentArea) {
        this.contentArea.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    
    // Si el usuario del sector comercial hace clic en su sección específica
    if (seccion === 'comercial' || seccion === 'tickets') {
      this.seccionActiva = 'dashboard'; // Volvemos a dashboard para que se active el contenedor de sectores
      this.user.idSector = 2; // Forzamos el ID del sector comercial en la vista
      this.cargarPresupuestosComerciales();
      return;
    }
    
    this.seccionActiva = seccion;

    if (seccion === 'tecnicos') {
      this.filtrarTecnicosActivos();
      this.tecnicoSeleccionado = null;
      this.mapUrlSafe = null;
    }

    setTimeout(() => {
      const el = document.querySelector('.sector-content');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  private inicializarDatosSector(): void {
    // Forzamos que si el usuario pertenece al sector Comercial (ID 2 de base de datos) 
    // se configure por defecto su entorno correspondiente.
    if (this.user.idSector === 2) {
      this.seccionActiva = 'comercial';
      this.cargarPresupuestosComerciales();
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
        if (this.pdsPendientes.length === 0) {
          this.cargarPdsPendientes();
        }
      },
      error: (err: any) => console.error('Error al cargar abonados desde la base de datos:', err)
    });
  }

  cargarPdsPendientes(): void {
    const cantidadInicial = Math.floor(Math.random() * 3) + 2;
    this.generarPdsAleatorios(cantidadInicial);
  }

  inyectarPdsEnTiempoReal(): void {
    const cantidadNuevos = Math.floor(Math.random() * 2) + 1;
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
      const minutesAleatorios = Math.floor(Math.random() * 60);
      const fechaRandom = new Date();
      fechaRandom.setHours(fechaRandom.getHours() - horasAleatorias);
      fechaRandom.setMinutes(fechaRandom.getMinutes() - minutesAleatorios);

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
        ciudad: ciudadFinal,
        seleccionado: false      
      };
    });

    if (incremental) {
      this.pdsPendientes = [...nuevosElementos, ...this.pdsPendientes];
    } else {
      this.pdsPendientes = nuevosElementos;
    }

    this.actualizarKpisPdsYAsignaciones();
  }

  derivarPdsMantenimiento(pds: any): void {
    const serviceDerivado = {
      ...pds,
      fechaDerivacion: new Date()
    };

    this.servicesCoordinados = [serviceDerivado, ...this.servicesCoordinados];
    this.pdsPendientes = this.pdsPendientes.filter(item => item !== pds);
    this.actualizarKpisPdsYAsignaciones();
  }

  private actualizarKpisPdsYAsignaciones(): void {
    if (this.kpis) {
      this.kpis.eventosHoy = this.pdsPendientes.length;
      if ('asignacionesHoy' in this.kpis) {
        (this.kpis as any).asignacionesHoy = this.servicesCoordinados.length;
      }
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
      const { NombreRol, Activo } = u;
      const nombreRol = NombreRol ? String(NombreRol).trim().toLowerCase() : '';
      const tieneRolTecnico = (nombreRol === 'técnico' || nombreRol === 'tecnico');
      const estaActivo = (Activo === 1 || Activo === true || String(Activo) === '1');
      return tieneRolTecnico && estaActivo;
    });

    if (this.kpis) {
      this.kpis.tecnicosActivos = this.tecnicosActivos.length;
    }
  }

  verTecnicoEnMapa(tecnico: any): void {
    this.tecnicoSeleccionado = tecnico;

    const cabaLat = -34.6037;
    const cabaLng = -58.3816;
    
    if (!tecnico.latitudSimulada || !tecnico.longitudSimulada) {
      tecnico.latitudSimulada = cabaLat + (Math.random() - 0.5) * 0.05;
      tecnico.longitudSimulada = cabaLng + (Math.random() - 0.5) * 0.05;
    }

    // 🎯 CORREGIDO: Sintaxis limpia y uso de la URL de incrustación de Google Maps segura
    const urlMapa = `https://maps.google.com/maps?q=${tecnico.latitudSimulada},${tecnico.longitudSimulada}&z=15&output=embed`;
    
    this.mapUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(urlMapa);
  }
}