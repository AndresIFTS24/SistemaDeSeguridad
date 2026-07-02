import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Input de búsqueda con dropdown de sugerencias mientras se escribe, mismo
 * patrón visual que el buscador de abonado de Bitácora de Eventos — pero,
 * a diferencia de ahí, no "bloquea" el filtro al elegir una sugerencia:
 * simplemente emite `seleccionado` (para que el padre abra una ficha de
 * detalle, por ejemplo) y el término de búsqueda sigue narrowing la lista
 * de abajo con normalidad.
 */
@Component({
  selector: 'app-buscador-predictivo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscador-predictivo.component.html',
  styleUrls: ['./buscador-predictivo.component.css']
})
export class BuscadorPredictivoComponent {
  @Input() items: any[] = [];
  @Input() camposBusqueda: string[] = [];
  @Input() campoPrincipal: string = '';
  @Input() campoSecundario: string = '';
  @Input() placeholder: string = 'Buscar...';
  @Input() termino: string = '';

  @Output() terminoChange = new EventEmitter<string>();
  @Output() seleccionado = new EventEmitter<any>();

  public sugerencias: any[] = [];
  public mostrarSugerencias: boolean = false;

  cambiarTermino(valor: string): void {
    this.termino = valor;
    this.terminoChange.emit(valor);
    this.buscar();
  }

  onFocus(): void {
    this.buscar();
  }

  onBlur(): void {
    // timeout para que el click en una sugerencia (que dispara blur primero)
    // alcance a procesarse antes de que el dropdown se oculte.
    setTimeout(() => this.mostrarSugerencias = false, 150);
  }

  elegir(item: any): void {
    this.seleccionado.emit(item);
    this.sugerencias = [];
    this.mostrarSugerencias = false;
  }

  private buscar(): void {
    const term = this.termino.toLowerCase().trim();
    if (!term) {
      this.sugerencias = [];
      this.mostrarSugerencias = false;
      return;
    }
    this.sugerencias = this.items
      .filter(item => this.camposBusqueda.some(campo => String(item[campo] ?? '').toLowerCase().includes(term)))
      .slice(0, 8);
    this.mostrarSugerencias = this.sugerencias.length > 0;
  }
}
