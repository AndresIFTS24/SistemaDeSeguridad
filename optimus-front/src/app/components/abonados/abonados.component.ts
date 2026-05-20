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
  public abonadoSeleccionado: any = null;
  public mostrarModal: boolean = false;
  public modoModal: string = 'ver';

  public nuevoAbonado = {
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
  }

  editarAbonado(abonado: any): void {
    this.abonadoSeleccionado = { ...abonado };
    this.modoModal = 'editar';
    this.mostrarModal = true;
  }

  nuevoAbonadoModal(): void {
    this.abonadoSeleccionado = null;
    this.nuevoAbonado = {
      NumeroDeAbonado: '',
      RazonSocial: '',
      RUT: '',
      ContactoPrincipal: '',
      TelefonoContacto: '',
      EmailContacto: ''
    };
    this.modoModal = 'nuevo';
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.abonadoSeleccionado = null;
  }

  volverDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}