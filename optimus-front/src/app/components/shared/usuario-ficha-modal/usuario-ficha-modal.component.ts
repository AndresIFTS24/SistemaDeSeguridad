import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Ficha de solo lectura de un usuario — clon del modo 'ver' de
 * AbonadoFormModalComponent, pero sin modos de creación/edición: Dirección
 * solo visualiza, la gestión real de usuarios (alta/edición) es de IT.
 */
@Component({
  selector: 'app-usuario-ficha-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-ficha-modal.component.html',
  styleUrls: ['./usuario-ficha-modal.component.css']
})
export class UsuarioFichaModalComponent {
  @Input() visible: boolean = false;
  @Input() usuario: any | null = null;

  @Output() cerrado = new EventEmitter<void>();

  cerrar(): void {
    this.cerrado.emit();
  }
}
