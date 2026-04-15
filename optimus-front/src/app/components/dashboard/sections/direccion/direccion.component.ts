import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-direccion-dash',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; color: white;">
      <h2 style="color: #10b981;">Panel de Dirección Operativo</h2>
      <p>Bienvenido al sector de gerencia. Aquí se verán las métricas críticas.</p>
    </div>
  `
})
export class DireccionDashComponent { }