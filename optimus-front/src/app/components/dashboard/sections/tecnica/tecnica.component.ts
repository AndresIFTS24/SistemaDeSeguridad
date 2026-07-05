import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tecnica-dash',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tecnica.component.html',
  styleUrls: ['./tecnica.component.css']
})
export class TecnicaComponent implements OnInit, OnDestroy {

  // Recibimos los abonados reales cargados en el padre desde la base de datos
  @Input() abonados: any[] = [];
  
  // Enviamos eventos al padre para actualizar los contadores globales (KPIs)
  @Output() pdsActualizados = new EventEmitter<any[]>();
  @Output() servicesActualizados = new EventEmitter<any[]>();

  public pdsPendientes: any[] = [];
  public servicesCoordinados: any[] = [];
  
  private alarmIntervalId: any = null;

  // Catálogo basado en la tabla 'codigos_eventos'
  private codigosEventos = [
    { codigo: 'E130', descripcionAlarma: 'Disparo de Alarma: Zona Intrusión / Perimetral', prioridad: 'Crítico' },
    { codigo: 'E137', descripcionAlarma: 'Manipulación Detectada: Apertura de Sabotaje (Tamper)', prioridad: 'Alta' },
    { codigo: 'E301', descripcionAlarma: 'Falla de Energía: Corte de Red Eléctrica 220V', prioridad: 'Normal' },
    { codigo: 'E302', descripcionAlarma: 'Batería Baja: Nivel inferior al 20% en Panel', prioridad: 'Alta' },
    { codigo: 'E350', descripcionAlarma: 'Pérdida de Conexión: Dispositivo Offline GPRS/IP', prioridad: 'Crítico' }
  ];

  ngOnInit(): void {
    // Generar una tanda inicial si ya hay abonados disponibles
    if (this.abonados && this.abonados.length > 0) {
      this.generarEventosAleatorios(2);
    }

    // ⏳ SIMULADOR EN TIEMPO REAL
    this.startAlarmSimulation();
  }

  ngOnDestroy(): void {
    if (this.alarmIntervalId) {
      clearTimeout(this.alarmIntervalId);
    }
  }

  private startAlarmSimulation(): void {
    const loop = () => {
      const nextTick = Math.floor(Math.random() * 1000) + 1000; // Entre 1s y 2s
      
      this.alarmIntervalId = setTimeout(() => {
        const cantidadNuevos = Math.floor(Math.random() * 2) + 1;
        this.generarEventosAleatorios(cantidadNuevos);
        
        // Sigue el ciclo recursivo de simulación
        loop();
      }, nextTick);
    };
    
    loop();
  }

  private generarEventosAleatorios(cantidad: number): void {
    const listaOrigen = this.abonados && this.abonados.length > 0 ? this.abonados : [
      { NumeroDeAbonado: '1023', RazonSocial: 'Estación Axion', TelefonoContacto: '1155432189', Calle: 'Av. San Martín', Numero: '450', Ciudad: 'CABA' },
      { NumeroDeAbonado: '1054', RazonSocial: 'Ferretería El Progreso', TelefonoContacto: '1133221100', Calle: 'Rivadavia', Numero: '8900', Ciudad: 'Morón' }
    ];

    for (let i = 0; i < cantidad; i++) {
      const abonadoAleatorio = listaOrigen[Math.floor(Math.random() * listaOrigen.length)];
      const eventoAleatorio = this.codigosEventos[Math.floor(Math.random() * this.codigosEventos.length)];

      const nuevoPds = {
        id: Date.now() + Math.random(),
        nroCuenta: abonadoAleatorio.NumeroDeAbonado,
        razonSocial: abonadoAleatorio.RazonSocial,
        telefono: abonadoAleatorio.TelefonoContacto || 'Sin Teléfono',
        evento: eventoAleatorio.descripcionAlarma,
        codigo: eventoAleatorio.codigo,
        prioridad: eventoAleatorio.prioridad,
        direccion: `${abonadoAleatorio.Calle || 'Calle'} ${abonadoAleatorio.Numero || ''}`,
        ciudad: abonadoAleatorio.Ciudad || 'CABA',
        fecha: new Date()
      };

      this.pdsPendientes.unshift(nuevoPds);
    }

    this.pdsActualizados.emit(this.pdsPendientes);
  }

  // 🛠️ Mueve un PDS a la lista de Services Coordinados
  public derivarPdsMantenimiento(pds: any): void {
    const index = this.pdsPendientes.findIndex(item => item.id === pds.id);
    if (index !== -1) {
      const pdsRemovido = this.pdsPendientes.splice(index, 1)[0];
      
      const serviceOrden = {
        ...pdsRemovido,
        fechaDerivacion: new Date()
      };
      
      this.servicesCoordinados.unshift(serviceOrden);
      
      this.pdsActualizados.emit(this.pdsPendientes);
      this.servicesActualizados.emit(this.servicesCoordinados);
    }
  }

  // 💬 Dispara la API de WhatsApp
  public iniciarChatCliente(pds: any): void {
    if (!pds.telefono || pds.telefono === 'Sin Teléfono') {
      alert('Este abonado no posee un número de teléfono válido cargado.');
      return;
    }

    const numeroLimpio = pds.telefono.replace(/[^0-9]/g, '');
    const mensaje = `Hola *${pds.razonSocial}*, nos comunicamos desde la central operativa de Monitoreo. Registramos un evento de *${pds.evento}* (Código: ${pds.codigo}) con prioridad *${pds.prioridad}* en su cuenta Nº *${pds.nroCuenta}*. Por favor confírmenos si se encuentra en el lugar para coordinar la asistencia técnica.`;
    
    const urlWhatsapp = `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsapp, '_blank');
  }
}