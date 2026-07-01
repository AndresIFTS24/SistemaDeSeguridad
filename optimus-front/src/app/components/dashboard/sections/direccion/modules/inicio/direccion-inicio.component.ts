import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

import {
  DashboardService,
  ResumenDireccion,
  EvolucionAbonadosPunto,
  EventoReciente
} from '../../../../../../services/dashboard.service';
import { ArgentinaDatePipe } from '../../../../../../pipes/argentina-date.pipe';

Chart.register(...registerables);

@Component({
  selector: 'app-direccion-inicio',
  standalone: true,
  imports: [CommonModule, ArgentinaDatePipe],
  templateUrl: './direccion-inicio.component.html',
  styleUrls: ['./direccion-inicio.component.css']
})
export class DireccionInicioComponent implements OnInit, OnDestroy {

  @ViewChild('chartEvolucion') chartEvolucionRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartVolumen') chartVolumenRef?: ElementRef<HTMLCanvasElement>;

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
    this.cargarDashboard();
  }

  ngOnDestroy(): void {
    this.chartEvolucion?.destroy();
    this.chartVolumen?.destroy();
  }

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
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#0b0f19',
          pointHoverBorderColor: '#38bdf8',
          pointHoverBorderWidth: 2,
          borderWidth: 2
        }]
      },
      options: this.opcionesChartBase({
        label: (context: any) => `Acumulado: ${context.parsed.y}`,
        afterLabel: (context: any) => `Nuevos este mes: ${this.serieEvolucion[context.dataIndex].nuevos}`
      })
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
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#0b0f19',
          pointHoverBorderColor: '#a78bfa',
          pointHoverBorderWidth: 2,
          borderWidth: 2
        }]
      },
      options: this.opcionesChartBase({
        label: (context: any) => `Eventos: ${context.parsed.y}`
      })
    });
  }

  private opcionesChartBase(tooltipCallbacks: any): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#f1f5f9',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 4,
          titleFont: { size: 12, weight: '600' },
          bodyFont: { size: 12 },
          callbacks: tooltipCallbacks
        }
      },
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
