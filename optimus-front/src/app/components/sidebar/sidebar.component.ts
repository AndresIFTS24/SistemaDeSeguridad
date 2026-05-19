import { Component, Input, Output, EventEmitter } from '@angular/core';
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
          <li [class.active]="menuActivo === 'dashboard'" (click)="seleccionarMenu('dashboard')">
            <i class="fas fa-th-large"></i> Dashboard
          </li>
          
          <ng-container [ngSwitch]="idSector">
            <li *ngSwitchCase="1" [class.active]="menuActivo === 'estadisticas'" (click)="seleccionarMenu('estadisticas')">
              <i class="fas fa-chart-pie"></i> Estadísticas Globales
            </li>
            
            <li *ngSwitchCase="3" [class.active]="menuActivo === 'usuarios'" (click)="seleccionarMenu('usuarios')">
              <i class="fas fa-user-shield"></i> Control de Usuarios
            </li>
            
            <li *ngSwitchCase="4" [class.active]="menuActivo === 'monitoreo'" (click)="seleccionarMenu('monitoreo')">
              <i class="fas fa-broadcast-tower"></i> Panel de Monitoreo
            </li>
          </ng-container>

          <li [class.active]="menuActivo === 'config'" (click)="seleccionarMenu('config')">
            <i class="fas fa-cog"></i> Configuración
          </li>
        </ul>
      </div>

      <div class="sidebar-footer">
        <button class="logout-btn" (click)="cerrarSesion()">
          <i class="fas fa-power-off"></i> Cerrar Sesión
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar { width: 260px; height: calc(100vh - 65px); background: #0f172a; display: flex; flex-direction: column; justify-content: space-between; border-right: 1px solid rgba(255,255,255,0.05); }
    .menu-section { padding: 20px; }
    .section-title { color: #475569; font-size: 0.7rem; font-weight: 700; margin-bottom: 15px; letter-spacing: 1px; }
    .nav-list { list-style: none; padding: 0; }
    .nav-list li { padding: 12px 15px; color: #94a3b8; margin-bottom: 5px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: all 0.2s; }
    .nav-list li:hover { background: #1e293b; color: white; }
    .nav-list li.active { background: #3b82f6; color: white; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3); }
    .sidebar-footer { padding: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
    .logout-btn { width: 100%; padding: 10px; background: transparent; border: 1px solid #ef4444; color: #ef4444; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.3s; display: flex; justify-content: center; align-items: center; gap: 8px;}
    .logout-btn:hover { background: #ef4444; color: white; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4); transform: translateY(-2px); }
  `]
})
export class SidebarComponent {
  @Input() idSector: number = 0;
  @Output() logout = new EventEmitter<void>();

  // Variable para saber qué menú está seleccionado
  menuActivo: string = 'dashboard';

  seleccionarMenu(menu: string) {
    this.menuActivo = menu;
  }

  cerrarSesion() {
    console.log("Cerrando sesión de usuario...");
    this.logout.emit();
    
    // Fallback de seguridad
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login'; 
  }
}