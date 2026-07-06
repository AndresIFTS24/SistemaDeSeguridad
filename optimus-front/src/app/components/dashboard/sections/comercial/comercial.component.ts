import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-comercial-dash', // Asegurate de usar <app-comercial-dash> en tu HTML padre
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './comercial.component.html',
  styleUrls: ['./comercial.component.css']
})
export class ComercialComponent implements OnInit {
  @Input() seccionActiva: string = 'dashboard';

  budgetForm!: FormGroup;

  statsComercial = {
    totalVentasMes: 0,
    metaMensual: 1500000,
    porcentajeMeta: 0,
    contratosNuevos: 0,
    efectividadCierre: 0,
    ventasPorMes: [
      { mes: 'Mar', valor: 45 },
      { mes: 'Abr', valor: 65 },
      { mes: 'May', valor: 55 },
      { mes: 'Jun', valor: 85 }
    ],
    prospectosPorOrigen: [
      { origen: 'Web / Landing', porcentaje: 40, color: '#38bdf8' },
      { origen: 'Llamadas Outbound', porcentaje: 35, color: '#a855f7' },
      { origen: 'Recomendados', porcentaje: 25, color: '#10b981' }
    ]
  };

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.generarEstadisticasAleatorias();
  }

  private initForm(): void {
    this.budgetForm = this.fb.group({
      NroPresupuesto: ['', [Validators.required, Validators.pattern(/^PR-\d{4}-\d{4}$/)]],
      TipoTrabajo: ['Instalacion Nuevo Cliente', Validators.required],
      ID_Abonado: [null], 
      Direccion: ['', Validators.required],
      Ciudad: ['Buenos Aires', Validators.required],
      FechaRecepcion: [this.getFechaActualString(), Validators.required],
      Estado: ['Pendiente', Validators.required]
    });
  }

  sugerirNroPresupuesto(): void {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.budgetForm.patchValue({
      NroPresupuesto: `PR-2026-${randomNum}`
    });
  }

  generarEstadisticasAleatorias(): void {
    this.statsComercial.totalVentasMes = Math.floor(950000 + Math.random() * 500000);
    this.statsComercial.contratosNuevos = Math.floor(15 + Math.random() * 25);
    this.statsComercial.efectividadCierre = Math.floor(65 + Math.random() * 20);
    this.statsComercial.porcentajeMeta = Math.floor((this.statsComercial.totalVentasMes / this.statsComercial.metaMensual) * 100);
    
    this.statsComercial.ventasPorMes.forEach(m => m.valor = Math.floor(30 + Math.random() * 65));
  }

  private getFechaActualString(): string {
    const ahora = new Date();
    return ahora.toISOString().slice(0, 16);
  }

  onSubmitPresupuesto(): void {
    if (this.budgetForm.valid) {
      const dataParaGuardar = this.budgetForm.value;
      console.log('Insertando registro en tabla PRESUPUESTOS:', dataParaGuardar);
      
      alert(`¡Presupuesto ${dataParaGuardar.NroPresupuesto} listo para insertarse en MySQL!`);
      
      this.budgetForm.reset();
      this.initForm(); 
      this.generarEstadisticasAleatorias(); 
    } else {
      alert('Por favor complete los campos obligatorios del presupuesto.');
    }
  }
}