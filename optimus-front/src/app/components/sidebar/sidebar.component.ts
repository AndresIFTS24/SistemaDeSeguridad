import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  seccion?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">

      <!-- TOGGLE BUTTON -->
      <button class="toggle-btn" (click)="toggleSidebar()" [title]="isCollapsed ? 'Expandir menú' : 'Colapsar menú'">
        <i class="fas" [ngClass]="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
      </button>

      <div class="menu-section">
        <p class="section-title" *ngIf="!isCollapsed">MENÚ PRINCIPAL</p>
        <ul class="nav-list">
          <li
            *ngFor="let item of menuItems"
            [class.active]="menuActivo === item.id"
            (click)="seleccionar(item)"
            [title]="isCollapsed ? item.label : ''">
            <i class="fas {{ item.icon }}"></i>
            <span class="nav-label" *ngIf="!isCollapsed">{{ item.label }}</span>
          </li>
        </ul>
      </div>

      <div class="sidebar-footer">
        <button class="logout-btn" (click)="cerrarSesion()" [title]="isCollapsed ? 'Cerrar Sesión' : ''">
          <i class="fas fa-power-off"></i>
          <span *ngIf="!isCollapsed"> Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100%;
      background: #0f172a;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-right: 1px solid rgba(255,255,255,0.05);
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      flex-shrink: 0;
      overflow: hidden;
    }

    .sidebar.collapsed {
      width: 64px;
    }

    /* TOGGLE BUTTON */
    .toggle-btn {
      position: absolute;
      top: 16px;
      right: 10px;
      width: 24px;
      height: 24px;
      background: #3b82f6;
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.6rem;
      z-index: 10;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
      transition: all 0.2s;
    }
    .toggle-btn:hover {
      background: #2563eb;
      transform: scale(1.1);
    }

    .menu-section { padding: 20px 12px; margin-top: 20px; }

    .section-title {
      color: #475569;
      font-size: 0.7rem;
      font-weight: 700;
      margin-bottom: 15px;
      letter-spacing: 1px;
      white-space: nowrap;
      overflow: hidden;
    }

    .nav-list { list-style: none; padding: 0; }

    .nav-list li {
      padding: 12px;
      color: #94a3b8;
      margin-bottom: 5px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.2s;
      font-size: 0.9rem;
      white-space: nowrap;
      overflow: hidden;
    }

    .nav-list li i {
      flex-shrink: 0;
      width: 18px;
      text-align: center;
    }

    .nav-label {
      overflow: hidden;
      opacity: 1;
      transition: opacity 0.2s;
    }

    .collapsed .nav-label { opacity: 0; }

    .nav-list li:hover { background: #1e293b; color: white; }

    .nav-list li.active {
      background: #3b82f6;
      color: white;
      box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
    }

    .sidebar-footer {
      padding: 16px 12px;
      border-top: 1px solid rgba(255,255,255,0.05);
    }

    .logout-btn {
      box-sizing: border-box;
      width: 100%;
      padding: 10px 12px;
      background: transparent;
      border: 1px solid #ef4444;
      color: #ef4444;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      overflow: hidden;
    }

    .logout-btn:hover {
      background: #ef4444;
      color: white;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
      transform: translateY(-2px);
    }
  `]
})
export class SidebarComponent implements OnChanges {
  @Input() idSector: number = 0;
  @Input() seccionActiva: string = 'dashboard';
  @Output() logout = new EventEmitter<void>();
  @Output() seccionSeleccionada = new EventEmitter<string>();

  menuActivo: string = 'dashboard';
  menuItems: MenuItem[] = [];
  isCollapsed: boolean = false;

  private menusPorSector: Record<number, MenuItem[]> = {
    1: [
      { id: 'dashboard', label: 'Dashboard',              icon: 'fa-th-large',     seccion: 'dashboard' },
      { id: 'usuarios',  label: 'Directorio de Usuarios', icon: 'fa-users',        seccion: 'usuarios'  },
      { id: 'abonados',  label: 'Directorio de Abonados', icon: 'fa-address-book', seccion: 'abonados'  },
    ],
    3: [
      { id: 'dashboard',       label: 'Dashboard',          icon: 'fa-th-large',  seccion: 'dashboard'       },
      { id: 'usuarios',        label: 'Usuarios',           icon: 'fa-users-cog', seccion: 'usuarios'        },
      { id: 'sistema',         label: 'Estado del Sistema', icon: 'fa-server',    seccion: 'sistema'         },
      { id: 'auditoria',       label: 'Auditoría',          icon: 'fa-history',   seccion: 'auditoria'       },
      { id: 'infraestructura', label: 'Infraestructura',    icon: 'fa-chart-pie', seccion: 'infraestructura' },
    ],
    4: [
      { id: 'dashboard', label: 'Dashboard',           icon: 'fa-th-large',        seccion: 'dashboard' },
      { id: 'central',   label: 'Central de Abonados', icon: 'fa-broadcast-tower', seccion: 'central'   },
      { id: 'alarmas',   label: 'Consola de Alarmas',  icon: 'fa-bell',            seccion: 'alarmas'   },
      { id: 'eventos',   label: 'Registro de Eventos', icon: 'fa-list-alt',        seccion: 'eventos'   },
    ]
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idSector']) {
      this.menuItems = this.menusPorSector[this.idSector] || [
        { id: 'dashboard', label: 'Dashboard', icon: 'fa-th-large', seccion: 'dashboard' }
      ];
      this.menuActivo = 'dashboard';

      // Sector Monitoreo arranca colapsado por defecto
      const savedState = localStorage.getItem(`sidebar_collapsed_${this.idSector}`);
      if (savedState !== null) {
        this.isCollapsed = savedState === 'true';
      } else {
        this.isCollapsed = this.idSector === 4;
      }
    }

    if (changes['seccionActiva'] && this.seccionActiva) {
      this.menuActivo = this.seccionActiva;
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem(`sidebar_collapsed_${this.idSector}`, String(this.isCollapsed));
  }

  seleccionar(item: MenuItem): void {
    this.menuActivo = item.id;
    this.seccionSeleccionada.emit(item.seccion || item.id);
  }

  cerrarSesion(): void {
    this.logout.emit();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  }
}