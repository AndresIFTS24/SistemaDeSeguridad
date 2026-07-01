import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-direccion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './direccion-usuarios.component.html',
  styleUrls: ['./direccion-usuarios.component.css']
})
export class DireccionUsuariosComponent implements OnChanges {

  @Input() usuarios: any[] = [];

  public filtroBusqueda: string = '';
  public usuariosFiltrados: any[] = [];

  ngOnChanges(): void {
    this.filtrar();
  }

  filtrar(): void {
    const term = this.filtroBusqueda.toLowerCase().trim();
    this.usuariosFiltrados = term
      ? this.usuarios.filter(u =>
          u.Nombre?.toLowerCase().includes(term) ||
          u.Email?.toLowerCase().includes(term) ||
          u.NombreRol?.toLowerCase().includes(term) ||
          u.NombreSector?.toLowerCase().includes(term)
        )
      : [...this.usuarios];
  }
}
