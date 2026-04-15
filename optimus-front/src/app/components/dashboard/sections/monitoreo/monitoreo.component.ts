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
  
  // 1. Recibimos los 100 abonados desde el Dashboard Padre
  @Input() abonados: any[] = [];
  
  // 2. Variables para el buscador y visualización
  public filtroBusqueda: string = '';
  public abonadosFiltrados: any[] = [];
  public cargando: boolean = true;

  // 3. Feed de Alertas Dinámico (Con datos de los abonados que insertamos)
  public alertas = [
    { nro: '1071', tipo: 'ALARMA DE ROBO', zona: 'Sector Depósito', tiempo: '19:02:15', critico: true, cliente: 'Adidas Argentina' },
    { nro: '1004', tipo: 'PÁNICO ASISTIDO', zona: 'Caja Principal', tiempo: '18:55:30', critico: true, cliente: 'Schmidt & Co.' },
    { nro: '1025', tipo: 'TEST DE COMUNICACIÓN', zona: 'Panel Central', tiempo: '18:50:12', critico: false, cliente: 'Café Tortoni' },
    { nro: '1053', tipo: 'FALLO DE RED', zona: 'Router Rack 1', tiempo: '18:42:05', critico: false, cliente: 'Frigorífico El 10' },
    { nro: '1096', tipo: 'CORTE DE ENERGÍA', zona: 'General', tiempo: '18:30:00', critico: true, cliente: 'Edenor S.A' }
  ];

  constructor() {}

  ngOnInit(): void {
    // Inicialización inicial
    this.actualizarVista();
  }

  /**
   * Detecta cambios en el Input. Es vital porque los abonados 
   * llegan desde una API asíncrona en el Dashboard principal.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['abonados'] && this.abonados) {
      this.actualizarVista();
      this.cargando = false;
    }
  }

  private actualizarVista(): void {
    this.abonadosFiltrados = [...this.abonados];
  }

  /**
   * Filtrar la lista de 100 abonados en tiempo real.
   * Maneja nulos y convierte a minúsculas para búsqueda exacta.
   */
  filtrarAbonados(): void {
    if (!this.filtroBusqueda.trim()) {
      this.abonadosFiltrados = [...this.abonados];
      return;
    }

    const term = this.filtroBusqueda.toLowerCase().trim();
    
    this.abonadosFiltrados = this.abonados.filter(a => {
      const nro = a.NumeroDeAbonado ? a.NumeroDeAbonado.toString().toLowerCase() : '';
      const razon = a.RazonSocial ? a.RazonSocial.toLowerCase() : '';
      const contacto = a.ContactoPrincipal ? a.ContactoPrincipal.toLowerCase() : '';
      const rut = a.RUT ? a.RUT.toLowerCase() : '';

      return nro.includes(term) || razon.includes(term) || contacto.includes(term) || rut.includes(term);
    });
  }

  /**
   * Simulación de despacho de unidad
   */
  atenderAlerta(alerta: any): void {
    // Estética de consola corporativa
    const confirmacion = confirm(
      `SISTEMA DE DESPACHO\n` +
      `----------------------------\n` +
      `CLIENTE: ${alerta.cliente}\n` +
      `EVENTO: ${alerta.tipo}\n` +
      `ZONA: ${alerta.zona}\n\n` +
      `¿Confirmar envío de móvil de seguridad?`
    );

    if (confirmacion) {
      console.log(`Móvil enviado a: ${alerta.cliente}`);
      // Eliminamos la alerta de la lista simulando que ya fue tomada
      this.alertas = this.alertas.filter(ev => ev.nro !== alerta.nro);
    }
  }

  /**
   * Helper para el color del estado en la tabla
   */
  getEstadoClase(activo: number | boolean): string {
    return activo ? 'status-online' : 'status-offline';
  }
}