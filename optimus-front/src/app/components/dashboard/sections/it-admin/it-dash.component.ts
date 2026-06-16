import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItService } from '../../../../services/it.service';

@Component({
  selector: 'app-it-dash',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './it-dash.component.html',
  styleUrls: ['./it-dash.component.css']
})
export class ItDashComponent implements OnInit {

  public vistaActual: string = 'usuarios';

  // ===== PESTAÑA 1: USUARIOS =====
  public usuarios: any[] = [];
  public usuariosFiltrados: any[] = [];
  public filtroUsuarios: string = '';
  public cargandoUsuarios: boolean = true;

  public mostrarModalUsuario: boolean = false;
  public modoModalUsuario: 'nuevo' | 'editar' = 'nuevo';
  public usuarioSeleccionado: any = null;
  public guardandoUsuario: boolean = false;
  public mensajeUsuarioExito: string = '';
  public mensajeUsuarioError: string = '';

  public formUsuario = {
    Nombre: '',
    Email: '',
    PasswordHash: '',
    Telefono: '',
    ID_Sector: 0,
    ID_Rol: 0
  };

  // ===== PESTAÑA 2: ESTADO DEL SISTEMA =====
  public status: any = null;
  public cargandoStatus: boolean = true;

  // ===== PESTAÑA 3: AUDITORÍA =====
  public seguimientos: any[] = [];
  public topDispositivos: any[] = [];
  public cargandoAuditoria: boolean = true;

  // ===== PESTAÑA 4: INFRAESTRUCTURA =====
  public infraestructura: any = null;
  public cargandoInfraestructura: boolean = true;

  // ===== PESTAÑA 5: ROLES Y SECTORES =====
  public roles: any[] = [];
  public sectores: any[] = [];
  public cargandoRolesSectores: boolean = true;

  constructor(private itService: ItService) {}

  ngOnInit(): void {
    setTimeout(() => {
        this.cambiarVista('usuarios');
    }, 800);
}
  cambiarVista(vista: string): void {
    this.vistaActual = vista;

    switch (vista) {
      case 'usuarios':
        if (this.usuarios.length === 0) this.cargarUsuarios();
        break;
      case 'sistema':
        this.cargarStatus();
        break;
      case 'auditoria':
        if (this.seguimientos.length === 0) this.cargarAuditoria();
        break;
      case 'infraestructura':
        if (!this.infraestructura) this.cargarInfraestructura();
        break;
      case 'roles':
        if (this.roles.length === 0) this.cargarRolesSectores();
        break;
    }
  }

  // =====================================================
  // PESTAÑA 1 — USUARIOS
  // =====================================================

  cargarUsuarios(): void {
    this.cargandoUsuarios = true;
    this.itService.getUsuarios().subscribe({
      next: (res: any) => {
        this.usuarios = res.usuarios || [];
        this.usuariosFiltrados = [...this.usuarios];
        this.cargandoUsuarios = false;
      },
      error: (err: any) => {
        console.error('Error al cargar usuarios:', err);
        this.cargandoUsuarios = false;
      }
    });
  }

  filtrarUsuarios(): void {
    const term = this.filtroUsuarios.toLowerCase().trim();
    if (!term) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }
    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.Nombre?.toLowerCase().includes(term) ||
      u.Email?.toLowerCase().includes(term) ||
      u.NombreRol?.toLowerCase().includes(term) ||
      u.NombreSector?.toLowerCase().includes(term)
    );
  }

  abrirNuevoUsuario(): void {
    this.modoModalUsuario = 'nuevo';
    this.usuarioSeleccionado = null;
    this.formUsuario = { Nombre: '', Email: '', PasswordHash: '', Telefono: '', ID_Sector: 0, ID_Rol: 0 };
    this.mensajeUsuarioExito = '';
    this.mensajeUsuarioError = '';
    this.mostrarModalUsuario = true;
  }

  abrirEditarUsuario(usuario: any): void {
    this.modoModalUsuario = 'editar';
    this.usuarioSeleccionado = usuario;
    this.formUsuario = {
      Nombre: usuario.Nombre,
      Email: usuario.Email,
      PasswordHash: '',
      Telefono: usuario.Telefono || '',
      ID_Sector: usuario.ID_Sector || 0,
      ID_Rol: usuario.ID_Rol
    };
    this.mensajeUsuarioExito = '';
    this.mensajeUsuarioError = '';
    this.mostrarModalUsuario = true;
  }

  cerrarModalUsuario(): void {
    this.mostrarModalUsuario = false;
  }

  guardarUsuario(): void {
    if (!this.formUsuario.Nombre || !this.formUsuario.Email || !this.formUsuario.ID_Rol) {
      this.mensajeUsuarioError = 'Nombre, Email y Rol son obligatorios.';
      return;
    }

    if (this.modoModalUsuario === 'nuevo' && !this.formUsuario.PasswordHash) {
      this.mensajeUsuarioError = 'La contraseña es obligatoria para usuarios nuevos.';
      return;
    }

    this.guardandoUsuario = true;
    this.mensajeUsuarioError = '';

    if (this.modoModalUsuario === 'nuevo') {
      this.itService.crearUsuario(this.formUsuario).subscribe({
        next: () => {
          this.mensajeUsuarioExito = '✅ Usuario creado exitosamente.';
          this.guardandoUsuario = false;
          this.cargarUsuarios();
          setTimeout(() => this.cerrarModalUsuario(), 1200);
        },
        error: (err: any) => {
          this.mensajeUsuarioError = err.error?.message || 'Error al crear el usuario.';
          this.guardandoUsuario = false;
        }
      });
    } else {
      this.itService.actualizarUsuario(this.usuarioSeleccionado.ID_Usuario, this.formUsuario).subscribe({
        next: () => {
          this.mensajeUsuarioExito = '✅ Usuario actualizado exitosamente.';
          this.guardandoUsuario = false;
          this.cargarUsuarios();
          setTimeout(() => this.cerrarModalUsuario(), 1200);
        },
        error: (err: any) => {
          this.mensajeUsuarioError = err.error?.message || 'Error al actualizar el usuario.';
          this.guardandoUsuario = false;
        }
      });
    }
  }

  toggleUsuario(usuario: any): void {
    const accion = usuario.Activo ? 'desactivar' : 'activar';
    if (!confirm(`¿${accion.charAt(0).toUpperCase() + accion.slice(1)} a ${usuario.Nombre}?`)) return;

    this.itService.toggleUsuario(usuario.ID_Usuario).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err: any) => console.error('Error al cambiar estado del usuario:', err)
    });
  }

  // =====================================================
  // PESTAÑA 2 — ESTADO DEL SISTEMA
  // =====================================================

  cargarStatus(): void {
    this.cargandoStatus = true;
    this.itService.getStatus().subscribe({
      next: (res: any) => {
        this.status = res;
        this.cargandoStatus = false;
      },
      error: (err: any) => {
        console.error('Error al cargar status:', err);
        this.cargandoStatus = false;
      }
    });
  }

  formatUptime(segundos: number): string {
    if (!segundos) return '0s';
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = Math.floor(segundos % 60);
    return `${h}h ${m}m ${s}s`;
  }

  // =====================================================
  // PESTAÑA 3 — AUDITORÍA
  // =====================================================

  cargarAuditoria(): void {
    this.cargandoAuditoria = true;
    this.itService.getAuditoria().subscribe({
      next: (res: any) => {
        this.seguimientos = res.seguimientos || [];
        this.topDispositivos = res.topDispositivos || [];
        this.cargandoAuditoria = false;
      },
      error: (err: any) => {
        console.error('Error al cargar auditoría:', err);
        this.cargandoAuditoria = false;
      }
    });
  }

  // =====================================================
  // PESTAÑA 4 — INFRAESTRUCTURA
  // =====================================================

  cargarInfraestructura(): void {
    this.cargandoInfraestructura = true;
    this.itService.getInfraestructura().subscribe({
      next: (res: any) => {
        this.infraestructura = res;
        this.cargandoInfraestructura = false;
      },
      error: (err: any) => {
        console.error('Error al cargar infraestructura:', err);
        this.cargandoInfraestructura = false;
      }
    });
  }

  // =====================================================
  // PESTAÑA 5 — ROLES Y SECTORES
  // =====================================================

  cargarRolesSectores(): void {
    this.cargandoRolesSectores = true;
    this.itService.getRolesSectores().subscribe({
      next: (res: any) => {
        this.roles = res.roles || [];
        this.sectores = res.sectores || [];
        this.cargandoRolesSectores = false;
      },
      error: (err: any) => {
        console.error('Error al cargar roles y sectores:', err);
        this.cargandoRolesSectores = false;
      }
    });
  }
}