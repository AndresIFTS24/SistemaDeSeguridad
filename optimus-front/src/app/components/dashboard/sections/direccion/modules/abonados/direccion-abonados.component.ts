import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AbonadoFormModalComponent, ModoAbonadoModal } from '../../../../../shared/abonado-form-modal/abonado-form-modal.component';
import { BuscadorPredictivoComponent } from '../../../../../shared/buscador-predictivo/buscador-predictivo.component';
import { AbonadoService } from '../../../../../../services/abonado.service';
import { compararValores, DireccionOrden } from '../../../../../../utils/ordenamiento';

type EstadoFiltro = 'todos' | 'activo' | 'inactivo';

@Component({
  selector: 'app-direccion-abonados',
  standalone: true,
  imports: [CommonModule, FormsModule, AbonadoFormModalComponent, BuscadorPredictivoComponent],
  templateUrl: './direccion-abonados.component.html',
  styleUrls: ['./direccion-abonados.component.css']
})
export class DireccionAbonadosComponent implements OnChanges {

  @Input() abonados: any[] = [];

  // Se dispara al crear/editar un abonado desde acá — el listado real vive
  // en DashboardComponent (lo comparte con Monitoreo), así que el refresco
  // se pide burbujeando el evento hacia arriba en vez de buscar los datos
  // de nuevo localmente.
  @Output() abonadoGuardado = new EventEmitter<void>();

  public filtroBusqueda: string = '';
  public estadoFiltro: EstadoFiltro = 'todos';
  public ciudadFiltro: string = '';
  public campoOrden: string | null = null;
  public direccionOrden: DireccionOrden = 'asc';
  public abonadosFiltrados: any[] = [];

  public pagina: number = 1;
  public limite: number = 20;

  public mostrarModal: boolean = false;
  public modoModal: ModoAbonadoModal = 'nuevo';
  public abonadoSeleccionado: any = null;

  constructor(private abonadoService: AbonadoService) {}

  ngOnChanges(): void {
    this.filtrar();
  }

  // Resumen — siempre sobre el total real (this.abonados), nunca sobre el
  // subconjunto filtrado, para que las tarjetas de arriba reflejen "cuántos
  // hay en total" independiente de lo que el usuario esté filtrando abajo.
  get totalAbonados(): number {
    return this.abonados.length;
  }

  get totalActivos(): number {
    return this.abonados.filter(a => a.Activo).length;
  }

  get totalInactivos(): number {
    return this.abonados.filter(a => !a.Activo).length;
  }

  get ciudadesDisponibles(): string[] {
    const ciudades = new Set<string>();
    for (const a of this.abonados) {
      if (a.Ciudad) ciudades.add(a.Ciudad);
    }
    return Array.from(ciudades).sort((a, b) => a.localeCompare(b, 'es'));
  }

  get ciudadPrincipal(): { ciudad: string; cantidad: number } | null {
    const conteo = new Map<string, number>();
    for (const a of this.abonados) {
      const ciudad = a.Ciudad || 'Sin ciudad';
      conteo.set(ciudad, (conteo.get(ciudad) || 0) + 1);
    }
    const ordenado = Array.from(conteo.entries()).sort((a, b) => b[1] - a[1]);
    return ordenado.length ? { ciudad: ordenado[0][0], cantidad: ordenado[0][1] } : null;
  }

  ordenarPor(campo: string): void {
    if (this.campoOrden === campo) {
      this.direccionOrden = this.direccionOrden === 'asc' ? 'desc' : 'asc';
    } else {
      this.campoOrden = campo;
      this.direccionOrden = 'asc';
    }
    this.filtrar();
  }

  filtrar(): void {
    const term = this.filtroBusqueda.toLowerCase().trim();

    let resultado = this.abonados.filter(a => {
      const coincideTexto = !term ||
        a.RazonSocial?.toLowerCase().includes(term) ||
        a.NumeroDeAbonado?.toString().includes(term) ||
        a.EmailContacto?.toLowerCase().includes(term);
      const coincideEstado = this.estadoFiltro === 'todos' ||
        (this.estadoFiltro === 'activo' ? !!a.Activo : !a.Activo);
      const coincideCiudad = !this.ciudadFiltro || a.Ciudad === this.ciudadFiltro;
      return coincideTexto && coincideEstado && coincideCiudad;
    });

    if (this.campoOrden) {
      const campo = this.campoOrden;
      resultado = [...resultado].sort((a, b) => compararValores(a, b, campo, this.direccionOrden));
    }

    this.abonadosFiltrados = resultado;
    this.pagina = 1;
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.abonadosFiltrados.length / this.limite));
  }

  get abonadosPagina(): any[] {
    const inicio = (this.pagina - 1) * this.limite;
    return this.abonadosFiltrados.slice(inicio, inicio + this.limite);
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

  abrirNuevo(): void {
    this.abonadoSeleccionado = null;
    this.modoModal = 'nuevo';
    this.mostrarModal = true;
  }

  abrirEditar(abonado: any): void {
    this.abonadoSeleccionado = { ...abonado };
    this.modoModal = 'editar';
    this.mostrarModal = true;
  }

  verDetalle(abonado: any): void {
    this.abonadoSeleccionado = { ...abonado };
    this.modoModal = 'ver';
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.abonadoSeleccionado = null;
  }

  onGuardado(): void {
    this.abonadoGuardado.emit();
  }

  desactivarAbonado(abonado: any): void {
    if (!confirm(`¿Desactivar a ${abonado.RazonSocial}?`)) return;
    this.abonadoService.desactivarAbonado(abonado.ID_Abonado).subscribe({
      next: () => this.abonadoGuardado.emit(),
      error: (err: any) => console.error('Error al desactivar:', err)
    });
  }
}
