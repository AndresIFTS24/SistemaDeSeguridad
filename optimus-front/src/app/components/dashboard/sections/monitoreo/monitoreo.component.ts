import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  // Estadísticas calculadas
  public stats = {
    activos: 0,
    suspendidos: 0,
    criticos: 5
  };

  // Feed de Alertas (Simulando recepción en tiempo real)
  public alertas = [
    { nro: 'A-1071', tipo: 'ALARMA DE ROBO', zona: 'Sector Depósito', tiempo: '19:02:15', critico: true, cliente: 'Adidas Argentina' },
    { nro: 'A-1004', tipo: 'PÁNICO ASISTIDO', zona: 'Caja Principal', tiempo: '18:55:30', critico: true, cliente: 'Schmidt & Co.' },
    { nro: 'A-1025', tipo: 'TEST DE COMUNICACIÓN', zona: 'Panel Central', tiempo: '18:50:12', critico: false, cliente: 'Café Tortoni' },
    { nro: 'A-1053', tipo: 'FALLO DE RED', zona: 'Router Rack 1', tiempo: '18:42:05', critico: false, cliente: 'Frigorífico El 10' },
    { nro: 'A-1096', tipo: 'CORTE DE ENERGÍA', zona: 'General', tiempo: '18:30:00', critico: true, cliente: 'Edenor S.A' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.actualizarVista();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['abonados'] && this.abonados) {
      this.actualizarVista();
      this.calcularStats();
      this.cargando = false;
    }
  }

  private actualizarVista(): void {
    this.abonadosFiltrados = [...this.abonados];
  }

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

  atenderAlerta(alerta: any): void {
    const confirmacion = confirm(
      `SISTEMA DE DESPACHO\n----------------------------\n` +
      `CLIENTE: ${alerta.cliente}\nEVENTO: ${alerta.tipo}\n` +
      `¿Confirmar envío de unidad de respuesta rápida?`
    );

    if (confirmacion) {
      this.alertas = this.alertas.filter(ev => ev.nro !== alerta.nro);
      alert(`Móvil en camino a ${alerta.cliente}. Evento cerrado.`);
    }
  }
}