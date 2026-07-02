import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AbonadoFormModalComponent, ModoAbonadoModal } from '../../../../../shared/abonado-form-modal/abonado-form-modal.component';
import { AbonadoService } from '../../../../../../services/abonado.service';

@Component({
  selector: 'app-direccion-abonados',
  standalone: true,
  imports: [CommonModule, FormsModule, AbonadoFormModalComponent],
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
  public abonadosFiltrados: any[] = [];

  public mostrarModal: boolean = false;
  public modoModal: ModoAbonadoModal = 'nuevo';
  public abonadoSeleccionado: any = null;

  constructor(private abonadoService: AbonadoService) {}

  ngOnChanges(): void {
    this.filtrar();
  }

  filtrar(): void {
    const term = this.filtroBusqueda.toLowerCase().trim();
    this.abonadosFiltrados = term
      ? this.abonados.filter(a =>
          a.RazonSocial?.toLowerCase().includes(term) ||
          a.NumeroDeAbonado?.toString().includes(term) ||
          a.EmailContacto?.toLowerCase().includes(term)
        )
      : [...this.abonados];
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
