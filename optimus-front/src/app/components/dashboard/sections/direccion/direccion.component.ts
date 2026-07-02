import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DireccionInicioComponent } from './modules/inicio/direccion-inicio.component';
import { DireccionUsuariosComponent } from './modules/usuarios/direccion-usuarios.component';
import { DireccionAbonadosComponent } from './modules/abonados/direccion-abonados.component';
import { DireccionReportesComponent } from './modules/reportes/direccion-reportes.component';
import { DireccionMapaComponent } from './modules/mapa/direccion-mapa.component';

@Component({
  selector: 'app-direccion-dash',
  standalone: true,
  imports: [
    CommonModule,
    DireccionInicioComponent,
    DireccionUsuariosComponent,
    DireccionAbonadosComponent,
    DireccionReportesComponent,
    DireccionMapaComponent
  ],
  templateUrl: './direccion.component.html',
  styleUrls: ['./direccion.component.css']
})
export class DireccionDashComponent {
  // La navegación entre módulos la maneja el SidebarComponent — seccionActiva
  // llega ya con el id del módulo a mostrar, no hace falta estado local.
  @Input() abonados: any[] = [];
  @Input() usuarios: any[] = [];
  @Input() seccionActiva: string = '';

  // Relevo del evento de DireccionAbonadosComponent hasta DashboardComponent,
  // que es el único que sabe recargar la lista real de abonados.
  @Output() abonadoGuardado = new EventEmitter<void>();
}
