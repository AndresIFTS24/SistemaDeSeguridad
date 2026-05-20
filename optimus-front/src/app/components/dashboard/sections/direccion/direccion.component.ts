import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-direccion-dash',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './direccion.component.html',
  styleUrls: ['./direccion.component.css']
})
export class DireccionDashComponent implements OnInit {

  @Input() abonados: any[] = [];
  @Input() usuarios: any[] = [];

  public vistaActual: string = 'usuarios';
  public filtroBusqueda: string = '';
  public usuariosFiltrados: any[] = [];
  public abonadosFiltrados: any[] = [];

  ngOnInit(): void {
    this.usuariosFiltrados = [...this.usuarios];
    this.abonadosFiltrados = [...this.abonados];
  }

  ngOnChanges(): void {
    this.usuariosFiltrados = [...this.usuarios];
    this.abonadosFiltrados = [...this.abonados];
  }

  cambiarVista(vista: string): void {
    this.vistaActual = vista;
    this.filtroBusqueda = '';
    this.filtrar();
  }

  filtrar(): void {
    const term = this.filtroBusqueda.toLowerCase().trim();
    if (this.vistaActual === 'usuarios') {
      this.usuariosFiltrados = term
        ? this.usuarios.filter(u =>
            u.Nombre?.toLowerCase().includes(term) ||
            u.Email?.toLowerCase().includes(term) ||
            u.NombreRol?.toLowerCase().includes(term) ||
            u.NombreSector?.toLowerCase().includes(term)
          )
        : [...this.usuarios];
    } else {
      this.abonadosFiltrados = term
        ? this.abonados.filter(a =>
            a.RazonSocial?.toLowerCase().includes(term) ||
            a.NumeroDeAbonado?.toString().includes(term) ||
            a.EmailContacto?.toLowerCase().includes(term)
          )
        : [...this.abonados];
    }
  }
}