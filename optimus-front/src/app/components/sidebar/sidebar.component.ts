import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar">
      <div class="menu-section">
        <p class="section-title">MENÚ PRINCIPAL</p>
        <ul class="nav-list">
          <li class="active"><i class="fas fa-th-large"></i> Dashboard</li>
          
          <ng-container [ngSwitch]="idSector">
            <li *ngSwitchCase="1"><i class="fas fa-chart-pie"></i> Estadísticas Globales</li>
            
            <li *ngSwitchCase="3"><i class="fas fa-user-shield"></i> Control de Usuarios</li>
            
            <li *ngSwitchCase="4"><i class="fas fa-broadcast-tower"></i> Consola de Alarmas</li>
          </ng-container>

          <li><i class="fas fa-cog"></i> Configuración</li>
        </ul>
      </div>

      <div class="sidebar-footer">
        <button class="logout-btn">
          <i class="fas fa-power-off"></i> Cerrar Sesión
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: calc(100vh - 65px);
      background: #0f172a;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-right: 1px solid rgba(255,255,255,0.05);
    }
    .menu-section { padding: 20px; }
    .section-title { color: #475569; font-size: 0.7rem; font-weight: 700; margin-bottom: 15px; letter-spacing: 1px; }
    .nav-list { list-style: none; padding: 0; }
    .nav-list li { 
      padding: 12px 15px; color: #94a3b8; margin-bottom: 5px; 
      border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px;
      transition: all 0.2s;
    }
    .nav-list li:hover { background: #1e293b; color: white; }
    .nav-list li.active { background: #3b82f6; color: white; }
    .sidebar-footer { padding: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
    .logout-btn { 
      width: 100%; padding: 10px; background: transparent; 
      border: 1px solid #ef4444; color: #ef4444; border-radius: 8px;
      cursor: pointer; font-weight: 600; transition: 0.3s;
    }
    .logout-btn:hover { background: #ef4444; color: white; }
  `]
})
export class SidebarComponent {
  @Input() idSector: number = 0; // Este recibe el ID para filtrar el menú
}