import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AbonadoService } from '../../services/abonado.service';

@Component({
  selector: 'app-abonados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './abonados.component.html',
  styleUrls: ['./abonados.component.css']
})
export class AbonadosComponent implements OnInit {

  public abonados: any[] = [];
  public abonadosFiltrados: any[] = [];
  public filtroBusqueda: string = '';
  public loading: boolean = true;
  public error: boolean = false;
  public mostrarModal: boolean = false;
  public modoModal: string = 'ver';
  public guardando: boolean = false;
  public mensajeExito: string = '';
  public mensajeError: string = '';

  public abonadoSeleccionado: any = null;

  public formAbonado = {
    NumeroDeAbonado: '',
    RazonSocial: '',
    RUT: '',
    ContactoPrincipal: '',
    TelefonoContacto: '',
    EmailContacto: ''
  };

  constructor(
    private abonadoService: AbonadoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarAbonados();
  }

  cargarAbonados(): void {
    this.loading = true;
    this.error = false;
    this.abonadoService.getAllAbonados().subscribe({
      next: (response: any) => {
        this.abonados = response.abonados || response || [];
        this.abonadosFiltrados = [...this.abonados];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar abonados:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  filtrar(): void {
    const term = this.filtroBusqueda.toLowerCase().trim();
    if (!term) {
      this.abonadosFiltrados = [...this.abonados];
      return;
    }
    this.abonadosFiltrados = this.abonados.filter(a =>
      a.RazonSocial?.toLowerCase().includes(term) ||
      a.NumeroDeAbonado?.toString().includes(term) ||
      a.EmailContacto?.toLowerCase().includes(term) ||
      a.ContactoPrincipal?.toLowerCase().includes(term)
    );
  }

  verDetalle(abonado: any): void {
    this.abonadoSeleccionado = { ...abonado };
    this.modoModal = 'ver';
    this.mostrarModal = true;
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  abrirEditar(abonado: any): void {
    this.abonadoSeleccionado = { ...abonado };
    this.formAbonado = {
      NumeroDeAbonado: abonado.NumeroDeAbonado,
      RazonSocial: abonado.RazonSocial,
      RUT: abonado.RUT || '',
      ContactoPrincipal: abonado.ContactoPrincipal || '',
      TelefonoContacto: abonado.TelefonoContacto || '',
      EmailContacto: abonado.EmailContacto || ''
    };
    this.modoModal = 'editar';
    this.mostrarModal = true;
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  abrirNuevo(): void {
    this.abonadoSeleccionado = null;
    this.formAbonado = {
      NumeroDeAbonado: '',
      RazonSocial: '',
      RUT: '',
      ContactoPrincipal: '',
      TelefonoContacto: '',
      EmailContacto: ''
    };
    this.modoModal = 'nuevo';
    this.mostrarModal = true;
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.abonadoSeleccionado = null;
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  guardarNuevo(): void {
    if (!this.formAbonado.NumeroDeAbonado || !this.formAbonado.RazonSocial) {
      this.mensajeError = 'Número de abonado y Razón Social son obligatorios.';
      return;
    }
    this.guardando = true;
    this.mensajeError = '';
    this.abonadoService.createAbonado(this.formAbonado).subscribe({
      next: () => {
        this.mensajeExito = '✅ Abonado creado exitosamente.';
        this.guardando = false;
        this.cargarAbonados();
        setTimeout(() => this.cerrarModal(), 1500);
      },
      error: (err: any) => {
        this.mensajeError = err.error?.message || 'Error al crear el abonado.';
        this.guardando = false;
      }
    });
  }

  guardarEdicion(): void {
    if (!this.formAbonado.NumeroDeAbonado || !this.formAbonado.RazonSocial) {
      this.mensajeError = 'Número de abonado y Razón Social son obligatorios.';
      return;
    }
    this.guardando = true;
    this.mensajeError = '';
    this.abonadoService.updateAbonado(this.abonadoSeleccionado.ID_Abonado, this.formAbonado).subscribe({
      next: () => {
        this.mensajeExito = '✅ Abonado actualizado exitosamente.';
        this.guardando = false;
        this.cargarAbonados();
        setTimeout(() => this.cerrarModal(), 1500);
      },
      error: (err: any) => {
        this.mensajeError = err.error?.message || 'Error al actualizar el abonado.';
        this.guardando = false;
      }
    });
  }

  desactivarAbonado(abonado: any): void {
    if (!confirm(`¿Desactivar a ${abonado.RazonSocial}?`)) return;
    this.abonadoService.desactivarAbonado(abonado.ID_Abonado).subscribe({
      next: () => {
        this.cargarAbonados();
      },
      error: (err: any) => {
        console.error('Error al desactivar:', err);
      }
    });
  }

  volverDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}