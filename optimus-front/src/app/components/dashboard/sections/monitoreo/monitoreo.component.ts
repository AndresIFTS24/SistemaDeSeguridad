import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService, Evento } from '../../../../services/evento.service';

@Component({
  selector: 'app-monitoreo-dash',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.css']
})
export class MonitoreoDashComponent implements OnInit, OnChanges {

  @Input() abonados: any[] = [];

  public filtroBusqueda: string = '';
  public abonadosFiltrados: any[] = [];
  public cargando: boolean = true;
  public abonadoSeleccionado: any = null;
  public eventoSeleccionado: any = null;
  public vistaActual: string = 'abonados';

  public stats = { activos: 0, suspendidos: 0, criticos: 0 };

  // Eventos reales desde la BD
  public eventos: Evento[] = [];
  public cargandoEventos: boolean = true;

  // Feed lateral — derivado de eventos reales
  public get alertas(): Evento[] {
    return this.eventos.filter(e => e.Estado === 'Pendiente');
  }

  public get eventosCriticos(): number {
    return this.eventos.filter(e =>
      e.NivelCriticidad === 'Crítico' && e.Estado === 'Pendiente'
    ).length;
  }

  constructor(private eventoService: EventoService) {}

  ngOnInit(): void {
    this.actualizarVista();
    this.cargarEventos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['abonados'] && this.abonados) {
      this.actualizarVista();
      this.calcularStats();
      this.cargando = false;
    }
  }

  cargarEventos(): void {
    this.cargandoEventos = true;
    this.eventoService.getEventos().subscribe({
      next: (response: any) => {
        this.eventos = response.eventos || [];
        this.cargandoEventos = false;
      },
      error: (err: any) => {
        console.error('Error al cargar eventos:', err);
        this.cargandoEventos = false;
      }
    });
  }

  private actualizarVista(): void {
    this.abonadosFiltrados = [...this.abonados];
  }

  cambiarVista(vista: string): void {
    this.vistaActual = vista;
  }

  // ==========================================
  // LÓGICA DEL PANEL DE DESPACHO
  // ==========================================

  procesarEvento(evento: Evento): void {
    this.eventoSeleccionado = {
      origen: 'eventos',
      idOriginal: evento.ID_Evento,
      cliente: evento.NombreAbonado,
      evento: evento.DescripcionEvento,
      hora: new Date(evento.FechaHoraRecepcion).toLocaleTimeString('es-AR'),
      prioridad: evento.NivelCriticidad === 'Crítico' ? 'critica' :
                 evento.NivelCriticidad === 'Alta' ? 'alta' : 'media',
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
        next: () => {
          this.cargarEventos();
        },
        error: (err: any) => console.error('Error al actualizar evento:', err)
      });
    }
    this.cerrarModalDespacho();
  }

  // ==========================================
  // LÓGICA DE DIRECTORIO DE ABONADOS
  // ==========================================

  private calcularStats(): void {
    this.stats.activos = this.abonados.filter(a => a.Activo).length;
    this.stats.suspendidos = this.abonados.filter(a => !a.Activo).length;
  }

  filtrarAbonados(): void {
    if (!this.filtroBusqueda.trim()) {
      this.abonadosFiltrados = [...this.abonados];
      return;
    }
    const term = this.filtroBusqueda.toLowerCase().trim();
    this.abonadosFiltrados = this.abonados.filter(a => {
      const nro = a.NumeroDeAbonado?.toString().toLowerCase() || '';
      const razon = a.RazonSocial?.toLowerCase() || '';
      const email = a.EmailContacto?.toLowerCase() || '';
      return nro.includes(term) || razon.includes(term) || email.includes(term);
    });
  }

  seleccionarAbonado(abonado: any): void {
    this.abonadoSeleccionado = abonado;
  }

  cerrarFicha(): void {
    this.abonadoSeleccionado = null;
  }

  getPrioridadClass(criticidad: string): string {
    switch (criticidad) {
      case 'Crítico': return 'critica';
      case 'Alta': return 'alta';
      case 'Baja': return 'baja';
      default: return 'media';
    }
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Pendiente': return 'pendiente';
      case 'En Progreso': return 'en-proceso';
      case 'Cerrado': return 'atendido';
      default: return 'pendiente';
    }
  }
}