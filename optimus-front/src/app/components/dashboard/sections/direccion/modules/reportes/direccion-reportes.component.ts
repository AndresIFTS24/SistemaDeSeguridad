import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DireccionBitacoraComponent } from './bitacora/direccion-bitacora.component';

@Component({
  selector: 'app-direccion-reportes',
  standalone: true,
  imports: [CommonModule, DireccionBitacoraComponent],
  templateUrl: './direccion-reportes.component.html',
  styleUrls: ['./direccion-reportes.component.css']
})
export class DireccionReportesComponent {
  // Único módulo real hoy. "ordenes" y "remitos" quedan como stubs hasta que
  // existan las tablas de inventario/OT con GPS que documentó el compañero.
  public vistaActual: string = 'bitacora';

  cambiarVista(vista: string): void {
    this.vistaActual = vista;
  }
}
