import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  DashboardService,
  EventoAuditoria,
  AuditoriaEventosFiltros,
  AuditoriaEventosResponse
} from '../../../../../../../services/dashboard.service';
import { AbonadoService } from '../../../../../../../services/abonado.service';
import { ArgentinaDatePipe } from '../../../../../../../pipes/argentina-date.pipe';

const PRIORIDADES = ['Baja', 'Alta', 'Crítico'];
const ESTADOS = ['Pendiente', 'En Progreso', 'Cerrado'];

@Component({
  selector: 'app-direccion-bitacora',
  standalone: true,
  imports: [CommonModule, FormsModule, ArgentinaDatePipe],
  templateUrl: './direccion-bitacora.component.html',
  styleUrls: ['./direccion-bitacora.component.css']
})
export class DireccionBitacoraComponent implements OnInit {

  public prioridadesDisponibles = PRIORIDADES;
  public estadosDisponibles = ESTADOS;

  public fechaDesde: string = '';
  public fechaHasta: string = '';
  public prioridadesSeleccionadas: string[] = [];
  public estadosSeleccionados: string[] = [];

  public busquedaAbonado: string = '';
  private abonados: any[] = [];
  public sugerenciasAbonado: any[] = [];
  public abonadoSeleccionado: any | null = null;
  public mostrarSugerencias: boolean = false;

  public pagina: number = 1;
  public limite: number = 25;
  public total: number = 0;
  public totalPaginas: number = 1;
  public eventos: EventoAuditoria[] = [];
  public cargando: boolean = true;

  constructor(
    private dashboardService: DashboardService,
    private abonadoService: AbonadoService
  ) {}

  ngOnInit(): void {
    this.abonadoService.getAllAbonados().subscribe({
      next: (res: any) => { this.abonados = res.abonados || []; },
      error: (err: any) => console.error('Error al cargar abonados para el filtro:', err)
    });
    this.buscar();
  }

  get hayFiltrosActivos(): boolean {
    return !!(this.fechaDesde || this.fechaHasta || this.abonadoSeleccionado
      || this.prioridadesSeleccionadas.length || this.estadosSeleccionados.length);
  }

  buscarAbonado(): void {
    const term = this.busquedaAbonado.toLowerCase().trim();
    if (!term) {
      this.sugerenciasAbonado = [];
      this.mostrarSugerencias = false;
      return;
    }
    this.sugerenciasAbonado = this.abonados
      .filter(a => a.RazonSocial?.toLowerCase().includes(term) || a.NumeroDeAbonado?.toString().includes(term))
      .slice(0, 8);
    this.mostrarSugerencias = true;
  }

  seleccionarAbonado(abonado: any): void {
    this.abonadoSeleccionado = abonado;
    this.busquedaAbonado = abonado.RazonSocial;
    this.mostrarSugerencias = false;
    this.pagina = 1;
    this.buscar();
  }

  quitarAbonado(): void {
    this.abonadoSeleccionado = null;
    this.busquedaAbonado = '';
    this.sugerenciasAbonado = [];
    this.pagina = 1;
    this.buscar();
  }

  togglePrioridad(p: string): void {
    this.prioridadesSeleccionadas = this.prioridadesSeleccionadas.includes(p)
      ? this.prioridadesSeleccionadas.filter(x => x !== p)
      : [...this.prioridadesSeleccionadas, p];
    this.pagina = 1;
    this.buscar();
  }

  toggleEstado(e: string): void {
    this.estadosSeleccionados = this.estadosSeleccionados.includes(e)
      ? this.estadosSeleccionados.filter(x => x !== e)
      : [...this.estadosSeleccionados, e];
    this.pagina = 1;
    this.buscar();
  }

  aplicarFechas(): void {
    this.pagina = 1;
    this.buscar();
  }

  limpiarFiltros(): void {
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.prioridadesSeleccionadas = [];
    this.estadosSeleccionados = [];
    this.quitarAbonado();
  }

  irAPagina(n: number): void {
    if (n < 1 || n > this.totalPaginas || n === this.pagina) return;
    this.pagina = n;
    this.buscar();
  }

  get paginasVisibles(): number[] {
    const inicio = Math.max(1, this.pagina - 2);
    const fin = Math.min(this.totalPaginas, inicio + 4);
    const paginas: number[] = [];
    for (let i = inicio; i <= fin; i++) paginas.push(i);
    return paginas;
  }

  claseBadgePrioridad(p: string): string {
    if (p === 'Crítico') return 'badge-rojo';
    if (p === 'Alta') return 'badge-naranja';
    return 'badge-gris';
  }

  claseBadgeEstado(e: string): string {
    if (e === 'Cerrado') return 'badge-verde';
    if (e === 'En Progreso') return 'badge-violeta';
    return 'badge-sky';
  }

  private buscar(): void {
    this.cargando = true;
    const filtros: AuditoriaEventosFiltros = {
      page: this.pagina,
      limit: this.limite,
      fechaDesde: this.fechaDesde || undefined,
      fechaHasta: this.fechaHasta || undefined,
      idAbonado: this.abonadoSeleccionado?.ID_Abonado,
      prioridad: this.prioridadesSeleccionadas.length ? this.prioridadesSeleccionadas : undefined,
      estado: this.estadosSeleccionados.length ? this.estadosSeleccionados : undefined,
    };
    this.dashboardService.getAuditoriaEventos(filtros).subscribe({
      next: (data: AuditoriaEventosResponse) => {
        this.eventos = data.eventos;
        this.total = data.total;
        this.totalPaginas = data.totalPaginas;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar la bitácora de eventos:', err);
        this.cargando = false;
      }
    });
  }
}
