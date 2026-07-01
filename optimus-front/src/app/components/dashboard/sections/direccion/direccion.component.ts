import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

import {
  DashboardService,
  ResumenDireccion,
  EvolucionAbonadosPunto,
  EventoReciente
} from '../../../../services/dashboard.service';
import { ArgentinaDatePipe } from '../../../../pipes/argentina-date.pipe';

Chart.register(...registerables);

@Component({
  selector: 'app-direccion-dash',
  standalone: true,
  imports: [CommonModule, FormsModule, ArgentinaDatePipe],
  templateUrl: './direccion.component.html',
  styleUrls: ['./direccion.component.css']
})
export class DireccionDashComponent implements OnInit {

  @Input() abonados: any[] = [];
  @Input() usuarios: any[] = [];
  @Input() seccionActiva: string = '';

  @ViewChild('chartEvolucion') chartEvolucionRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartVolumen') chartVolumenRef?: ElementRef<HTMLCanvasElement>;

  public vistaActual: string = 'dashboard';
  public filtroBusqueda: string = '';
  public usuariosFiltrados: any[] = [];
  public abonadosFiltrados: any[] = [];

  public cargandoResumen: boolean = true;
  public resumen: ResumenDireccion | null = null;

  public mesesEvolucion: 3 | 6 | 12 = 6;
  private serieEvolucion: EvolucionAbonadosPunto[] = [];
  private volumenSerie: { hora: string; cantidad: number }[] = [];

  public eventosRecientes: EventoReciente[] = [];
  public cargandoEventosRecientes: boolean = true;

  private chartEvolucion: Chart | null = null;
  private chartVolumen: Chart | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.usuariosFiltrados = [...this.usuarios];
    this.abonadosFiltrados = [...this.abonados];
    this.cargarDashboard();
  }

  ngOnChanges(): void {
    this.usuariosFiltrados = [...this.usuarios];
    this.abonadosFiltrados = [...this.abonados];
    if (this.seccionActiva) {
      this.cambiarVista(this.seccionActiva);
    }
  }

  cambiarVista(vista: string): void {
    this.vistaActual = vista;
    this.filtroBusqueda = '';
    this.filtrar();
    if (vista === 'dashboard' && (this.serieEvolucion.length || this.eventosRecientes.length)) {
      // El canvas se recrea al volver a esta pestaña (*ngIf), hay que redibujar
      // los charts contra los datos ya cargados.
      setTimeout(() => this.renderizarCharts(), 0);
    }
  }

  filtrar(): void {
    const term = this.filtroBusqueda.toLowerCase().trim();
    if (this.vistaActual === 'usuarios') {
      this.usuariosFiltrados = term
        ? this.usuarios.filter(u =>
            u.Nombre?.toLowerCase().includes(term) ||
            u.Email?.toLowerCase().includes(term) ||
            u.NombreRol?.toLowerCase().includes(term) ||
            u.NombreSector?.toLowerCase().includes(term)
          )
        : [...this.usuarios];
    } else if (this.vistaActual === 'abonados') {
      this.abonadosFiltrados = term
        ? this.abonados.filter(a =>
            a.RazonSocial?.toLowerCase().includes(term) ||
            a.NumeroDeAbonado?.toString().includes(term) ||
            a.EmailContacto?.toLowerCase().includes(term)
          )
        : [...this.abonados];
    }
  }

  // =====================================================
  // DASHBOARD — KPIs, gráficos y resumen ejecutivo
  // =====================================================

  private cargarDashboard(): void {
    this.cargandoResumen = true;
    this.dashboardService.getResumenDireccion().subscribe({
      next: (data) => {
        this.resumen = data;
        this.cargandoResumen = false;
      },
      error: (err) => {
        console.error('Error al cargar el resumen de Dirección:', err);
        this.cargandoResumen = false;
      }
    });

    this.cargarEvolucionAbonados();
    this.cargarVolumenEventos();

    this.cargandoEventosRecientes = true;
    this.dashboardService.getEventosRecientes(6).subscribe({
      next: (data) => {
        this.eventosRecientes = data.eventos;
        this.cargandoEventosRecientes = false;
        setTimeout(() => this.renderizarCharts(), 0);
      },
      error: (err) => {
        console.error('Error al cargar eventos recientes:', err);
        this.cargandoEventosRecientes = false;
      }
    });
  }

  cambiarPeriodoEvolucion(meses: 3 | 6 | 12): void {
    if (meses === this.mesesEvolucion) return;
    this.mesesEvolucion = meses;
    this.cargarEvolucionAbonados();
  }

  private cargarEvolucionAbonados(): void {
    this.dashboardService.getEvolucionAbonados(this.mesesEvolucion).subscribe({
      next: (data) => {
        this.serieEvolucion = data.serie;
        setTimeout(() => this.renderizarCharts(), 0);
      },
      error: (err) => console.error('Error al cargar evolución de abonados:', err)
    });
  }

  private cargarVolumenEventos(): void {
    this.dashboardService.getVolumenEventos().subscribe({
      next: (data) => {
        this.volumenSerie = data.serie;
        setTimeout(() => this.renderizarCharts(), 0);
      },
      error: (err) => console.error('Error al cargar volumen de eventos:', err)
    });
  }

  private renderizarCharts(): void {
    this.renderizarChartEvolucion();
    this.renderizarChartVolumen();
  }

  private renderizarChartEvolucion(): void {
    const canvas = this.chartEvolucionRef?.nativeElement;
    if (!canvas || this.serieEvolucion.length === 0) return;

    this.chartEvolucion?.destroy();
    this.chartEvolucion = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.serieEvolucion.map(p => this.formatearPeriodo(p.periodo)),
        datasets: [{
          label: 'Abonados acumulados',
          data: this.serieEvolucion.map(p => p.acumulado),
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: 2
        }]
      },
      options: this.opcionesChartBase()
    });
  }

  private renderizarChartVolumen(): void {
    const canvas = this.chartVolumenRef?.nativeElement;
    if (!canvas || this.volumenSerie.length === 0) return;

    this.chartVolumen?.destroy();
    this.chartVolumen = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.volumenSerie.map(p => p.hora.slice(11, 16)),
        datasets: [{
          label: 'Eventos',
          data: this.volumenSerie.map(p => p.cantidad),
          borderColor: '#a78bfa',
          backgroundColor: 'rgba(167, 139, 250, 0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: 2
        }]
      },
      options: this.opcionesChartBase()
    });
  }

  private opcionesChartBase(): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#64748b', font: { size: 10 }, maxRotation: 0 }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#64748b', font: { size: 10 } }
        }
      }
    };
  }

  private formatearPeriodo(periodo: string): string {
    const [anio, mes] = periodo.split('-');
    const nombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${nombres[parseInt(mes, 10) - 1]} ${anio.slice(2)}`;
  }

  formatearMoneda(valor: number): string {
    return '$' + Math.round(valor).toLocaleString('es-AR');
  }
}
