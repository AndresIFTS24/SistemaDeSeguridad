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
  
  // Variable unificada para el Modal de Despacho
  public eventoSeleccionado: any = null;

  public stats = { activos: 0, suspendidos: 0, criticos: 5 };

  // LISTA 1: Feed de Alertas (Panel Lateral)
  public alertas = [
    { nro: 'A-1071', tipo: 'ALARMA DE ROBO', zona: 'Sector Depósito', tiempo: '19:02:15', critico: true, cliente: 'Adidas Argentina' },
    { nro: 'A-1004', tipo: 'PÁNICO ASISTIDO', zona: 'Caja Principal', tiempo: '18:55:30', critico: true, cliente: 'Schmidt & Co.' },
    { nro: 'A-1025', tipo: 'TEST DE COMUNICACIÓN', zona: 'Panel Central', tiempo: '18:50:12', critico: false, cliente: 'Café Tortoni' },
    { nro: 'A-1053', tipo: 'FALLO DE RED', zona: 'Router Rack 1', tiempo: '18:42:05', critico: false, cliente: 'Frigorífico El 10' },
    { nro: 'A-1096', tipo: 'CORTE DE ENERGÍA', zona: 'General', tiempo: '18:30:00', critico: true, cliente: 'Edenor S.A' }
  ];

  // LISTA 2: Consola Central
  public eventos = [
    { id: 1, cuenta: '1071', cliente: 'Adidas Argentina', evento: 'ROBO - ZONA 04', prioridad: 'alta', hora: '20:15:02', estado: 'pendiente' },
    { id: 2, cuenta: '1004', cliente: 'Schmidt & Co.', evento: 'PÁNICO ASISTIDO', prioridad: 'critica', hora: '20:10:30', estado: 'en-proceso' },
    { id: 3, cuenta: '1025', cliente: 'Café Tortoni', evento: 'FALLO DE RED', prioridad: 'media', hora: '20:05:12', estado: 'pendiente' },
    { id: 4, cuenta: '1053', cliente: 'Frigorífico El 10', evento: 'TEST PERIÓDICO', prioridad: 'baja', hora: '19:50:00', estado: 'atendido' }
  ];

  public vistaActual: string = 'abonados';

  constructor() {}

  ngOnInit(): void { this.actualizarVista(); }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['abonados'] && this.abonados) {
      this.actualizarVista();
      this.calcularStats();
      this.cargando = false;
    }
  }

  private actualizarVista(): void { this.abonadosFiltrados = [...this.abonados]; }

  cambiarVista(vista: string) { this.vistaActual = vista; }

  // ==========================================
  // LÓGICA DEL PANEL DE DESPACHO (NORMALIZADA)
  // ==========================================

  // Atrapa el clic de la tabla central
  procesarEvento(evento: any) {
    this.eventoSeleccionado = {
      origen: 'eventos',
      idOriginal: evento.id,
      cliente: evento.cliente,
      evento: evento.evento,
      hora: evento.hora,
      prioridad: evento.prioridad
    };
  }

  // Atrapa el clic del panel lateral y lo traduce para el mismo Modal
  atenderAlerta(alerta: any): void {
    this.eventoSeleccionado = {
      origen: 'alertas',
      idOriginal: alerta.nro,
      cliente: alerta.cliente,
      evento: alerta.tipo,
      hora: alerta.tiempo,
      prioridad: alerta.critico ? 'critica' : 'media'
    };
  }

  cerrarModalDespacho() {
    this.eventoSeleccionado = null;
  }

  // El botón "Generar OT y Despachar" ahora es inteligente
  despacharTecnico() {
    if (this.eventoSeleccionado) {
      
      if (this.eventoSeleccionado.origen === 'eventos') {
        // Si viene del centro, cambiamos la etiqueta a "EN-PROCESO"
        const ev = this.eventos.find(e => e.id === this.eventoSeleccionado.idOriginal);
        if (ev) ev.estado = 'en-proceso';
      
      } else if (this.eventoSeleccionado.origen === 'alertas') {
        // Si viene del lateral, la eliminamos de la lista para limpiar la cola
        this.alertas = this.alertas.filter(a => a.nro !== this.eventoSeleccionado.idOriginal);
      }

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

  seleccionarAbonado(abonado: any): void { this.abonadoSeleccionado = abonado; }
  cerrarFicha(): void { this.abonadoSeleccionado = null; }
}