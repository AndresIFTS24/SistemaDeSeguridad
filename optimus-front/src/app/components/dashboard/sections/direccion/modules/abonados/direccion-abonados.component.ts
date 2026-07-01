import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-direccion-abonados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './direccion-abonados.component.html',
  styleUrls: ['./direccion-abonados.component.css']
})
export class DireccionAbonadosComponent implements OnChanges {

  @Input() abonados: any[] = [];

  public filtroBusqueda: string = '';
  public abonadosFiltrados: any[] = [];

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
}
