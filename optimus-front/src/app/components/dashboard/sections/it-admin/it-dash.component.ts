import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
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
export class ItDashComponent implements OnInit, OnChanges {

  @Input() seccionActiva: string = '';
  public vistaActual: string = 'usuarios';

  // ===== VISTA USUARIOS =====
  public vistaUsuarios: 'tabla' | 'organigrama' = 'organigrama';
  public usuarios: any[] = [];
  public usuariosFiltrados: any[] = [];
  public filtroTexto: string = '';
  public sectorFiltroActivo: string = '';
  public cargandoUsuarios: boolean = true;
  public sectoresStats: any[] = [];

  // ===== PANEL ACTIVIDAD USUARIO =====
  public mostrarPanelActividad: boolean = false;
  public usuarioActividad: any = null;
  public actividadData: any = null;
  public cargandoActividad: boolean = false;

  // ===== MODAL USUARIO =====
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
    ID_Sector: null as number | null,
    ID_Rol: null as number | null
  };

  // ===== ROLES Y SECTORES (para dropdowns) =====
  public roles: any[] = [];
  public sectores: any[] = [];

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

  private coloresSector: Record<string, string> = {
    'Técnica y Campo':      '#10b981',
    'Monitoreo':            '#3b82f6',
    'Infraestructura e IT': '#00d4ff',
    'Operaciones':          '#f59e0b',
    'Comercial':            '#8b5cf6',
    'Dirección General':    '#ef4444',
    'Recursos Humanos':     '#64748b'
  };

  constructor(private itService: ItService) {}

 ngOnInit(): void {
    // Aseguramos que los filtros arranquen limpios para que muestre a todos
    this.sectorFiltroActivo = '';
    this.filtroTexto = '';
    setTimeout(() => this.cambiarVista('usuarios'), 800);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['seccionActiva'] && this.seccionActiva && this.seccionActiva !== 'dashboard') {
      this.cambiarVista(this.seccionActiva);
    }
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
        this.aplicarFiltros();
        this.computarSectoresStats();
        this.cargandoUsuarios = false;
        if (this.roles.length === 0) this.cargarDropdowns();
      },
      error: (err: any) => {
        console.error('Error al cargar usuarios:', err);
        this.cargandoUsuarios = false;
      }
    });
  }

  private cargarDropdowns(): void {
    this.itService.getRolesSectores().subscribe({
      next: (res: any) => {
        this.roles = res.roles || [];
        this.sectores = res.sectores || [];
      },
      error: (err: any) => console.error('Error al cargar dropdowns:', err)
    });
  }

  private computarSectoresStats(): void {
    const sectorMap: Record<string, { total: number; activos: number; inactivos: number }> = {};
    this.usuarios.forEach(u => {
      const s = u.NombreSector || 'Sin sector';
      if (!sectorMap[s]) sectorMap[s] = { total: 0, activos: 0, inactivos: 0 };
      sectorMap[s].total++;
      if (u.Activo) sectorMap[s].activos++;
      else sectorMap[s].inactivos++;
    });

    const totalUsuarios = this.usuarios.length;
    this.sectoresStats = Object.entries(sectorMap)
      .map(([nombre, data]) => ({
        nombre,
        total: data.total,
        activos: data.activos,
        inactivos: data.inactivos,
        porcentaje: Math.round(data.total / totalUsuarios * 100),
        color: this.coloresSector[nombre] || '#64748b'
      }))
      .sort((a, b) => b.total - a.total);
  }

  toggleVistaUsuarios(): void {
    this.vistaUsuarios = this.vistaUsuarios === 'tabla' ? 'organigrama' : 'tabla';
    if (this.vistaUsuarios === 'organigrama') {
      this.sectorFiltroActivo = '';
      this.filtroTexto = '';
      this.aplicarFiltros();
    }
  }

  filtrarPorSector(sectorNombre: string): void {
    this.sectorFiltroActivo = sectorNombre;
    this.vistaUsuarios = 'tabla';
    this.filtroTexto = '';
    this.aplicarFiltros();
  }

  limpiarFiltroSector(): void {
    this.sectorFiltroActivo = '';
    this.aplicarFiltros();
  }

  filtrarUsuarios(): void {
    this.aplicarFiltros();
  }

private aplicarFiltros(): void {
    // Si todavía no cargaron los usuarios, salimos para evitar romper el array
    if (!this.usuarios || this.usuarios.length === 0) {
      this.usuariosFiltrados = [];
      return;
    }

    let resultado = [...this.usuarios];

    // Filtrar por sector (solo si realmente hay un filtro activo)
    if (this.sectorFiltroActivo && this.sectorFiltroActivo.trim() !== '') {
      resultado = resultado.filter(u => u.NombreSector === this.sectorFiltroActivo);
    }

    // Filtrar por texto de búsqueda
    const term = this.filtroTexto ? this.filtroTexto.toLowerCase().trim() : '';
    if (term) {
      resultado = resultado.filter(u =>
        u.Nombre?.toLowerCase().includes(term) ||
        u.Email?.toLowerCase().includes(term) ||
        u.NombreRol?.toLowerCase().includes(term) ||
        u.NombreSector?.toLowerCase().includes(term)
      );
    }

    this.usuariosFiltrados = resultado;
  }

  getColorSector(nombre: string): string {
    return this.coloresSector[nombre] || '#64748b';
  }

  getUserCountForRol(idRol: number): number {
    return this.usuarios.filter(u => u.ID_Rol === idRol).length;
  }

  // =====================================================
  // MODAL USUARIO
  // =====================================================

  abrirNuevoUsuario(): void {
    this.modoModalUsuario = 'nuevo';
    this.usuarioSeleccionado = null;
    this.formUsuario = { Nombre: '', Email: '', PasswordHash: '', Telefono: '', ID_Sector: null, ID_Rol: null };
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
      ID_Sector: usuario.ID_Sector || null,
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
  // ACTIVIDAD POR USUARIO
  // =====================================================

  verActividad(usuario: any): void {
    this.usuarioActividad = usuario;
    this.mostrarPanelActividad = true;
    this.actividadData = null;
    this.cargandoActividad = true;

    this.itService.getActividadUsuario(usuario.ID_Usuario).subscribe({
      next: (res: any) => {
        this.actividadData = res;
        this.cargandoActividad = false;
      },
      error: (err: any) => {
        console.error('Error al cargar actividad:', err);
        this.cargandoActividad = false;
      }
    });
  }

  cerrarPanelActividad(): void {
    this.mostrarPanelActividad = false;
    this.usuarioActividad = null;
    this.actividadData = null;
  }

  getCriticidadClass(criticidad: string): string {
    switch (criticidad) {
      case 'Crítico': return 'critica';
      case 'Alta':    return 'alta';
      case 'Baja':    return 'baja';
      default:        return 'media';
    }
  }

  // =====================================================
  // PESTAÑA 2 — ESTADO DEL SISTEMA
  // =====================================================

  cargarStatus(): void {
    this.cargandoStatus = true;
    this.itService.getStatus().subscribe({
      next: (res: any) => { this.status = res; this.cargandoStatus = false; },
      error: (err: any) => { console.error('Error al cargar status:', err); this.cargandoStatus = false; }
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
      error: (err: any) => { console.error('Error al cargar auditoría:', err); this.cargandoAuditoria = false; }
    });
  }

  // =====================================================
  // PESTAÑA 4 — INFRAESTRUCTURA
  // =====================================================

  cargarInfraestructura(): void {
    this.cargandoInfraestructura = true;
    this.itService.getInfraestructura().subscribe({
      next: (res: any) => { this.infraestructura = res; this.cargandoInfraestructura = false; },
      error: (err: any) => { console.error('Error al cargar infraestructura:', err); this.cargandoInfraestructura = false; }
    });
  }
}