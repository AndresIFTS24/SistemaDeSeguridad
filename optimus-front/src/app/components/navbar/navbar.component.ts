import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar">
      <div class="logo-container">
        <div class="logo-icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="logo-text">
          <span class="brand">OPTIMUS</span>
          <span class="tech">FRONT</span>
        </div>
      </div>

      <div class="user-controls">
        <div class="session-info">
          <div class="text-data">
            <span class="welcome-msg">Bienvenido,</span>
            <span class="user-name">{{ user?.name || 'Cargando...' }}</span>
          </div>
          <div class="sector-badge" [title]="'Sector: ' + (user?.sectorNombre || 'No definido')">
            <i class="fas fa-network-wired"></i>
            {{ user?.sectorNombre || 'S/D' }}
          </div>
        </div>

        <div class="divider"></div>

        <button class="btn-logout" (click)="onLogoutClick()" title="Cerrar sesión segura">
          <i class="fas fa-sign-out-alt"></i>
          <span>Salir</span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .navbar {
      height: 65px;
      background: #1e293b;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;
      border-bottom: 2px solid #3b82f6; /* Línea de acento Optimus */
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      color: white;
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    /* LOGO STYLES */
    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }

    .logo-icon {
      background: #3b82f6;
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-size: 1.2rem;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    }

    .brand { font-weight: 900; letter-spacing: 1.5px; font-size: 1.2rem; color: #f8fafc; }
    .tech { font-weight: 300; color: #3b82f6; font-size: 1.2rem; margin-left: 2px; }

    /* USER INFO STYLES */
    .user-controls {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .session-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .text-data {
      display: flex;
      flex-direction: column;
      text-align: right;
    }

    .welcome-msg { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; }
    .user-name { font-size: 0.95rem; font-weight: 600; color: #f1f5f9; }

    .sector-badge {
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: #60a5fa;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .divider {
      width: 1px;
      height: 30px;
      background: rgba(255, 255, 255, 0.1);
    }

    /* LOGOUT BUTTON */
    .btn-logout {
      background: transparent;
      border: 1px solid #ef4444;
      color: #ef4444;
      padding: 8px 18px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-logout:hover {
      background: #ef4444;
      color: white;
      box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
      transform: translateY(-1px);
    }

    .btn-logout:active {
      transform: translateY(0);
    }

    /* Responsive */
    @media (max-width: 600px) {
      .welcome-msg, .divider, .btn-logout span { display: none; }
      .navbar { padding: 0 15px; }
    }
  `]
})
export class NavbarComponent {
  @Input() user: any = null;
  @Output() logout = new EventEmitter<void>();

  onLogoutClick() {
    this.logout.emit();
  }
}