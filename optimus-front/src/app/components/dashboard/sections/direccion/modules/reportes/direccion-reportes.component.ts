import { Component } from '@angular/core';

@Component({
  selector: 'app-direccion-reportes',
  standalone: true,
  template: `
    <div class="modulo-vacio fade-in">
      <i class="fas fa-clipboard-list"></i>
      <h3>Reportes y Auditoría</h3>
      <p>Este módulo está en construcción. Próximamente vas a poder generar reportes y consultar el historial de auditoría del sistema.</p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .modulo-vacio {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 80px 20px;
      text-align: center;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
    }
    .modulo-vacio i { font-size: 2.5rem; color: #64748b; }
    .modulo-vacio h3 { color: #f1f5f9; font-size: 1.1rem; margin: 0; }
    .modulo-vacio p { color: #94a3b8; font-size: 0.85rem; max-width: 420px; margin: 0; }
    .fade-in { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class DireccionReportesComponent {}
