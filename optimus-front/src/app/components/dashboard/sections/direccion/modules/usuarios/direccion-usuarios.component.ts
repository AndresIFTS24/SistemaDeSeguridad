import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BuscadorPredictivoComponent } from '../../../../../shared/buscador-predictivo/buscador-predictivo.component';
import { UsuarioFichaModalComponent } from '../../../../../shared/usuario-ficha-modal/usuario-ficha-modal.component';
import { compararValores, DireccionOrden } from '../../../../../../utils/ordenamiento';

interface SectorStats {
  nombre: string;
  total: number;
  activos: number;
  inactivos: number;
  porcentaje: number;
  color: string;
}

type VistaUsuarios = 'sectores' | 'lista';

@Component({
  selector: 'app-direccion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, BuscadorPredictivoComponent, UsuarioFichaModalComponent],
  templateUrl: './direccion-usuarios.component.html',
  styleUrls: ['./direccion-usuarios.component.css']
})
export class DireccionUsuariosComponent implements OnChanges {

  @Input() usuarios: any[] = [];

  // Mismo mapa de colores que usa el organigrama de IT (it-dash.component.ts)
  // — se clona acá porque Dirección es de solo lectura y no necesita el
  // resto del componente de IT (que trae CRUD embebido).
  private coloresSector: Record<string, string> = {
    'Técnica y Campo':      '#10b981',
    'Monitoreo':            '#3b82f6',
    'Infraestructura e IT': '#00d4ff',
    'Operaciones':          '#f59e0b',
    'Comercial':            '#8b5cf6',
    'Dirección General':    '#ef4444',
    'Recursos Humanos':     '#64748b'
  };

  public vista: VistaUsuarios = 'sectores';
  public sectoresStats: SectorStats[] = [];

  // Nivel 2 — lista del sector activo
  public sectorActivo: string = '';
  public filtroBusqueda: string = '';
  public campoOrden: string | null = null;
  public direccionOrden: DireccionOrden = 'asc';
  public pagina: number = 1;
  public limite: number = 10;
  public usuariosDelSector: any[] = [];
  public usuariosFiltrados: any[] = [];

  // Nivel 3 — ficha
  public mostrarModal: boolean = false;
  public usuarioSeleccionado: any = null;

  ngOnChanges(): void {
    this.computarSectoresStats();
    if (this.vista === 'lista') {
      this.aplicarFiltrosNivel2();
    }
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
        porcentaje: totalUsuarios ? Math.round(data.total / totalUsuarios * 100) : 0,
        color: this.coloresSector[nombre] || '#64748b'
      }))
      .sort((a, b) => b.total - a.total);
  }

  abrirSector(nombreSector: string): void {
    this.sectorActivo = nombreSector;
    this.vista = 'lista';
    this.filtroBusqueda = '';
    this.campoOrden = null;
    this.direccionOrden = 'asc';
    this.pagina = 1;
    this.aplicarFiltrosNivel2();
  }

  volverASectores(): void {
    this.vista = 'sectores';
  }

  filtrar(): void {
    this.pagina = 1;
    this.aplicarFiltrosNivel2();
  }

  ordenarPor(campo: string): void {
    if (this.campoOrden === campo) {
      this.direccionOrden = this.direccionOrden === 'asc' ? 'desc' : 'asc';
    } else {
      this.campoOrden = campo;
      this.direccionOrden = 'asc';
    }
    this.aplicarFiltrosNivel2();
  }

  private aplicarFiltrosNivel2(): void {
    this.usuariosDelSector = this.usuarios.filter(u => (u.NombreSector || 'Sin sector') === this.sectorActivo);

    const term = this.filtroBusqueda.toLowerCase().trim();
    let resultado = term
      ? this.usuariosDelSector.filter(u =>
          u.Nombre?.toLowerCase().includes(term) ||
          u.Email?.toLowerCase().includes(term) ||
          u.NombreRol?.toLowerCase().includes(term)
        )
      : [...this.usuariosDelSector];

    if (this.campoOrden) {
      const campo = this.campoOrden;
      resultado = [...resultado].sort((a, b) => compararValores(a, b, campo, this.direccionOrden));
    }

    this.usuariosFiltrados = resultado;
    if (this.pagina > this.totalPaginas) this.pagina = Math.max(1, this.totalPaginas);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.usuariosFiltrados.length / this.limite));
  }

  get usuariosPagina(): any[] {
    const inicio = (this.pagina - 1) * this.limite;
    return this.usuariosFiltrados.slice(inicio, inicio + this.limite);
  }

  irAPagina(n: number): void {
    if (n < 1 || n > this.totalPaginas || n === this.pagina) return;
    this.pagina = n;
  }

  get paginasVisibles(): number[] {
    const inicio = Math.max(1, this.pagina - 2);
    const fin = Math.min(this.totalPaginas, inicio + 4);
    const paginas: number[] = [];
    for (let i = inicio; i <= fin; i++) paginas.push(i);
    return paginas;
  }

  verDetalle(usuario: any): void {
    this.usuarioSeleccionado = usuario;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.usuarioSeleccionado = null;
  }
}
