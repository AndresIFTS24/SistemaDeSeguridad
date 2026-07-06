import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges,
  OnDestroy, SimpleChanges, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { EventoService, Evento, CodigoEvento } from '../../../../services/evento.service';
import { SocketService } from '../../../../services/socket.service';
import { DashboardService, ResumenMonitoreo } from '../../../../services/dashboard.service';
import { ArgentinaDatePipe } from '../../../../pipes/argentina-date.pipe';

@Component({
  selector: 'app-monitoreo-dash',
  standalone: true,
  imports: [CommonModule, FormsModule, ArgentinaDatePipe],
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.css']
})
export class MonitoreoDashComponent implements OnInit, OnChanges, OnDestroy {

  @Input() abonados: any[] = [];
  @Input() seccionActiva: string = '';
  @Output() alertasPendientesActualizadas = new EventEmitter<number>();

  @ViewChild('contenidoVista') contenidoVista!: ElementRef<HTMLDivElement>;

  public filtroBusqueda: string = '';
  public abonadosFiltrados: any[] = [];
  public cargando: boolean = true;
  public abonadoSeleccionado: any = null;
  public eventoSeleccionado: any = null;
  public vistaActual: string = 'abonados';

  public stats = { activos: 0, suspendidos: 0 };

  public eventos: Evento[] = [];
  public cargandoEventos: boolean = true;

  public nuevoEventoRecibido: boolean = false;

  public mostrarFormEvento: boolean = false;
  public dispositivos: any[] = [];
  public codigosEvento: CodigoEvento[] = [];
  public guardandoEvento: boolean = false;
  public mensajeEventoExito: string = '';
  public mensajeEventoError: string = '';

  public nuevoEvento = {
    ID_Dispositivo: 0,
    ID_CodigoEvento: 0
  };

  public resumenMonitoreo: ResumenMonitoreo | null = null;

  public paginaEventos = 1;
  public readonly limiteEventos = 15;

  private socketSubs: Subscription[] = [];

  public get alertas(): Evento[] {
    return this.eventos.filter(e => e.Estado === 'Pendiente');
  }

  get totalPaginasEventos(): number {
    return Math.max(1, Math.ceil(this.eventos.length / this.limiteEventos));
  }

  get eventosPagina(): Evento[] {
    const inicio = (this.paginaEventos - 1) * this.limiteEventos;
    return this.eventos.slice(inicio, inicio + this.limiteEventos);
  }

  irAPaginaEventos(n: number): void {
    if (n < 1 || n > this.totalPaginasEventos || n === this.paginaEventos) return;
    this.paginaEventos = n;
  }

  get paginasVisiblesEventos(): number[] {
    const inicio = Math.max(1, this.paginaEventos - 2);
    const fin = Math.min(this.totalPaginasEventos, inicio + 4);
    const paginas: number[] = [];
    for (let i = inicio; i <= fin; i++) paginas.push(i);
    return paginas;
  }

  constructor(
    private eventoService: EventoService,
    private socketService: SocketService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.actualizarVista();
    this.cargarEventos();
    this.cargarDispositivos();
    this.cargarCodigosEvento();
    this.cargarResumenMonitoreo();
    this.iniciarWebSocket();
  }

  private cargarResumenMonitoreo(): void {
    this.dashboardService.getResumenMonitoreo().subscribe({
      next: (data) => { this.resumenMonitoreo = data; },
      error: (err: any) => console.error('Error al obtener resumen de Monitoreo:', err)
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['abonados'] && this.abonados) {
      this.actualizarVista();
      this.calcularStats();
      this.cargando = false;
    }
    if (changes['seccionActiva'] && this.seccionActiva && this.seccionActiva !== 'dashboard') {
      this.cambiarVista(this.seccionActiva);
    }
  }

  ngOnDestroy(): void {
    this.socketSubs.forEach(sub => sub.unsubscribe());
    this.socketService.disconnect();
    console.log('🔌 WebSocket desconectado al salir del módulo Monitoreo.');
  }

  // =====================================================
  // WEBSOCKET
  // =====================================================

  private iniciarWebSocket(): void {
    this.socketService.connect();

    const subNuevo = this.socketService.on<Evento>('nuevo_evento').subscribe({
      next: (evento) => {
        console.log('📡 nuevo_evento recibido:', evento);
        this.eventos = [evento, ...this.eventos];
        this.alertasPendientesActualizadas.emit(this.alertas.length);
        this.activarIndicadorNuevo();
        if (evento.NivelCriticidad === 'Crítico') {
          this.socketService.reproducirAlarmaCritica();
        } else {
          this.socketService.reproducirAlarmaNormal();
        }
      }
    });

    const subActualizado = this.socketService.on<Evento>('evento_actualizado').subscribe({
      next: (eventoActualizado) => {
        console.log('📡 evento_actualizado recibido:', eventoActualizado);
        this.eventos = this.eventos.map(e =>
          e.ID_Evento === eventoActualizado.ID_Evento ? eventoActualizado : e
        );
        this.alertasPendientesActualizadas.emit(this.alertas.length);
      }
    });

    this.socketSubs.push(subNuevo, subActualizado);
  }

  private activarIndicadorNuevo(): void {
    this.nuevoEventoRecibido = true;
    setTimeout(() => { this.nuevoEventoRecibido = false; }, 4000);
  }

  // =====================================================
  // HTTP — carga inicial
  // =====================================================

  cargarEventos(): void {
    this.cargandoEventos = true;
    this.eventoService.getEventos().subscribe({
      next: (response: any) => {
        this.eventos = response.eventos || [];
        this.cargandoEventos = false;
        this.alertasPendientesActualizadas.emit(this.alertas.length);
        if (this.paginaEventos > this.totalPaginasEventos) {
          this.paginaEventos = Math.max(1, this.totalPaginasEventos);
        }
      },
      error: (err: any) => {
        console.error('Error al cargar eventos:', err);
        this.cargandoEventos = false;
      }
    });
  }

  cargarDispositivos(): void {
    this.eventoService.getDispositivos().subscribe({
      next: (response: any) => { this.dispositivos = response.dispositivos || []; },
      error: (err: any) => console.error('Error al cargar dispositivos:', err)
    });
  }

  cargarCodigosEvento(): void {
    this.eventoService.getCodigosEvento().subscribe({
      next: (response: any) => { this.codigosEvento = response.codigos || []; },
      error: (err: any) => console.error('Error al cargar códigos:', err)
    });
  }

  // =====================================================
  // FORMULARIO NUEVO EVENTO
  // =====================================================

  abrirFormEvento(): void {
    this.mostrarFormEvento = true;
    this.nuevoEvento = { ID_Dispositivo: 0, ID_CodigoEvento: 0 };
    this.mensajeEventoExito = '';
    this.mensajeEventoError = '';
  }

  cerrarFormEvento(): void {
    this.mostrarFormEvento = false;
  }

  registrarEvento(): void {
    if (!this.nuevoEvento.ID_Dispositivo || !this.nuevoEvento.ID_CodigoEvento) {
      this.mensajeEventoError = 'Seleccioná un dispositivo y un tipo de evento.';
      return;
    }
    this.guardandoEvento = true;
    this.mensajeEventoError = '';

    this.eventoService.crearEvento(this.nuevoEvento).subscribe({
      next: () => {
        this.mensajeEventoExito = '✅ Evento registrado. Actualizando consola...';
        this.guardandoEvento = false;
        setTimeout(() => this.cerrarFormEvento(), 1500);
      },
      error: (err: any) => {
        this.mensajeEventoError = err.error?.message || 'Error al registrar el evento.';
        this.guardandoEvento = false;
      }
    });
  }

  // =====================================================
  // DESPACHO
  // =====================================================

  procesarEvento(evento: Evento): void {
    this.eventoSeleccionado = {
      origen: 'eventos',
      idOriginal: evento.ID_Evento,
      cliente: evento.NombreAbonado,
      evento: evento.DescripcionEvento,
      hora: new Date(evento.FechaHoraRecepcion).toLocaleTimeString('es-AR'),
      prioridad: evento.NivelCriticidad === 'Crítico' ? 'critica' :
                 evento.NivelCriticidad === 'Alta'    ? 'alta'    : 'media',
      dispositivo: evento.NombreDispositivo,
      tipoEvento: evento.TipoEvento
    };
  }

  atenderAlerta(evento: Evento): void {
    this.procesarEvento(evento);
  }

  cerrarModalDespacho(): void {
    this.eventoSeleccionado = null;
  }

  despacharTecnico(): void {
    if (this.eventoSeleccionado) {
      this.eventoService.updateEstado(
        this.eventoSeleccionado.idOriginal,
        'En Progreso'
      ).subscribe({
        error: (err: any) => console.error('Error al actualizar evento:', err)
      });
    }
    this.cerrarModalDespacho();
  }

  // =====================================================
  // UTILIDADES
  // =====================================================

  private actualizarVista(): void {
    this.abonadosFiltrados = [...this.abonados];
  }

  cambiarVista(vista: string): void {
    this.vistaActual = vista;
    // Los KPIs generales quedan siempre visibles arriba — el scroll baja
    // hasta donde arranca el contenido específico de la pestaña elegida
    // (el propio [ngSwitch]), no hasta el tope de la página.
    this.contenidoVista?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  filtrarAbonados(): void {
    if (!this.filtroBusqueda.trim()) {
      this.abonadosFiltrados = [...this.abonados];
      return;
    }
    const term = this.filtroBusqueda.toLowerCase().trim();
    this.abonadosFiltrados = this.abonados.filter(a =>
      a.NumeroDeAbonado?.toString().toLowerCase().includes(term) ||
      a.RazonSocial?.toLowerCase().includes(term) ||
      a.EmailContacto?.toLowerCase().includes(term)
    );
  }

  seleccionarAbonado(abonado: any): void { this.abonadoSeleccionado = abonado; }
  cerrarFicha(): void { this.abonadoSeleccionado = null; }

  private calcularStats(): void {
    this.stats.activos     = this.abonados.filter(a =>  a.Activo).length;
    this.stats.suspendidos = this.abonados.filter(a => !a.Activo).length;
  }

  getPrioridadClass(criticidad: string): string {
    switch (criticidad) {
      case 'Crítico': return 'critica';
      case 'Alta':    return 'alta';
      case 'Baja':    return 'baja';
      default:        return 'media';
    }
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Pendiente':   return 'pendiente';
      case 'En Progreso': return 'en-proceso';
      case 'Cerrado':     return 'atendido';
      default:            return 'pendiente';
    }
  }
}