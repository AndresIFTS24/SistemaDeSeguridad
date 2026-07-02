import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AbonadoService } from '../../../services/abonado.service';

export type ModoAbonadoModal = 'ver' | 'nuevo' | 'editar';

interface FormAbonado {
  NumeroDeAbonado: string;
  RazonSocial: string;
  RUT: string;
  ContactoPrincipal: string;
  TelefonoContacto: string;
  EmailContacto: string;
  Calle: string;
  Numero: string;
  Ciudad: string;
}

/**
 * Modal de ver/crear/editar un abonado. Compartido entre AbonadosComponent
 * (/abonados) y DireccionAbonadosComponent (Directorio de Abonados de
 * Dirección) — una sola implementación del formulario y del guardado.
 */
@Component({
  selector: 'app-abonado-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './abonado-form-modal.component.html',
  styleUrls: ['./abonado-form-modal.component.css']
})
export class AbonadoFormModalComponent implements OnChanges {

  @Input() visible: boolean = false;
  @Input() modo: ModoAbonadoModal = 'nuevo';
  @Input() abonado: any | null = null; // el abonado a ver/editar; ignorado en modo 'nuevo'

  @Output() cerrado = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  public guardando: boolean = false;
  public mensajeExito: string = '';
  public mensajeError: string = '';
  public formAbonado: FormAbonado = this.formVacio();

  constructor(private abonadoService: AbonadoService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.mensajeExito = '';
      this.mensajeError = '';
      this.guardando = false;

      if (this.modo === 'editar' && this.abonado) {
        this.formAbonado = {
          NumeroDeAbonado: this.abonado.NumeroDeAbonado,
          RazonSocial: this.abonado.RazonSocial,
          RUT: this.abonado.RUT || '',
          ContactoPrincipal: this.abonado.ContactoPrincipal || '',
          TelefonoContacto: this.abonado.TelefonoContacto || '',
          EmailContacto: this.abonado.EmailContacto || '',
          Calle: this.abonado.Calle || '',
          Numero: this.abonado.Numero || '',
          Ciudad: this.abonado.Ciudad || ''
        };
      } else if (this.modo === 'nuevo') {
        this.formAbonado = this.formVacio();
      }
    }
  }

  private formVacio(): FormAbonado {
    return {
      NumeroDeAbonado: '', RazonSocial: '', RUT: '', ContactoPrincipal: '',
      TelefonoContacto: '', EmailContacto: '', Calle: '', Numero: '', Ciudad: ''
    };
  }

  cerrar(): void {
    this.cerrado.emit();
  }

  guardar(): void {
    if (!this.formAbonado.NumeroDeAbonado || !this.formAbonado.RazonSocial) {
      this.mensajeError = 'Número de abonado y Razón Social son obligatorios.';
      return;
    }
    if (!this.formAbonado.Calle || !this.formAbonado.Numero || !this.formAbonado.Ciudad) {
      this.mensajeError = 'Calle, Número y Ciudad son obligatorios: son la dirección que se usa ante una emergencia real.';
      return;
    }

    this.guardando = true;
    this.mensajeError = '';

    const peticion = this.modo === 'nuevo'
      ? this.abonadoService.createAbonado(this.formAbonado)
      : this.abonadoService.updateAbonado(this.abonado.ID_Abonado, this.formAbonado);

    peticion.subscribe({
      next: (res: any) => {
        this.mensajeExito = res?.message || '✅ Guardado exitosamente.';
        this.guardando = false;
        this.guardado.emit();
        setTimeout(() => this.cerrar(), 1500);
      },
      error: (err: any) => {
        this.mensajeError = err.error?.message || 'Error al guardar el abonado.';
        this.guardando = false;
      }
    });
  }
}
