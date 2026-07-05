import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DashboardService, ResumenTecnicos, UbicacionActualTecnico } from '../../../../services/dashboard.service';

// Estado del panel de mapa para el técnico seleccionado — ninguno de los 3
// inventa una ubicación cuando falta el dato real.
type EstadoUbicacion = 'cargando' | 'sin-asignacion' | 'sin-geocodificar' | 'ok';

@Component({
  selector: 'app-tecnica-dash',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tecnica.component.html',
  styleUrls: ['./tecnica.component.css']
})
export class TecnicaComponent implements OnInit, OnChanges, OnDestroy {

  // Recibimos los abonados reales cargados en el padre desde la base de datos
  @Input() abonados: any[] = [];
  // Usuarios reales cargados en el padre — se filtran acá para Técnicos Activos.
  @Input() usuarios: any[] = [];
  // Vista interna a mostrar: 'eventos' | 'tecnicos' | 'asignaciones'.
  @Input() seccionActiva: string = 'eventos';

  // Enviamos eventos al padre para actualizar los contadores globales (KPIs)
  @Output() pdsActualizados = new EventEmitter<any[]>();
  @Output() servicesActualizados = new EventEmitter<any[]>();
  @Output() tecnicosActivosActualizados = new EventEmitter<number>();
  @Output() volverAlPanel = new EventEmitter<void>();

  public pdsPendientes: any[] = [];
  public servicesCoordinados: any[] = [];
  public tecnicosActivos: any[] = [];
  public tecnicoSeleccionado: any = null;
  public mapUrlSafe: SafeResourceUrl | null = null;
  public estadoUbicacion: EstadoUbicacion | null = null;
  // Dirección real de la asignación en curso — se muestra en texto aunque
  // todavía no tenga CoordenadasGPS (estado 'sin-geocodificar').
  public direccionActual: { Calle: string; Numero: string; Ciudad: string } | null = null;

  // Desglose de técnicos (en campo ahora / disponibles) — mismo criterio y
  // queries que ya usa el resumen de Dirección, expuesto en un endpoint
  // propio y angosto (GET /api/dashboard/tecnicos/resumen).
  public resumenTecnicos: ResumenTecnicos | null = null;

  // Paginación client-side — un estado independiente por tabla, mismo
  // patrón visual (.paginacion/.pag-btn) que Usuarios/Abonados/Bitácora.
  // No se resetea a la página 1 cuando llega un PDS nuevo del simulador.
  public paginaPds = 1;
  public readonly limitePds = 10;
  public paginaTecnicos = 1;
  public readonly limiteTecnicos = 10;

  private alarmIntervalId: any = null;

  // Catálogo basado en la tabla 'codigos_eventos'
  private codigosEventos = [
    { codigo: 'E130', descripcionAlarma: 'Disparo de Alarma: Zona Intrusión / Perimetral', prioridad: 'Crítico' },
    { codigo: 'E137', descripcionAlarma: 'Manipulación Detectada: Apertura de Sabotaje (Tamper)', prioridad: 'Alta' },
    { codigo: 'E301', descripcionAlarma: 'Falla de Energía: Corte de Red Eléctrica 220V', prioridad: 'Normal' },
    { codigo: 'E302', descripcionAlarma: 'Batería Baja: Nivel inferior al 20% en Panel', prioridad: 'Alta' },
    { codigo: 'E350', descripcionAlarma: 'Pérdida de Conexión: Dispositivo Offline GPRS/IP', prioridad: 'Crítico' }
  ];

  constructor(private sanitizer: DomSanitizer, private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // Generar una tanda inicial si ya hay abonados disponibles
    if (this.abonados && this.abonados.length > 0) {
      this.generarEventosAleatorios(2);
    }

    this.ejecutarFiltroUsuarios();
    this.cargarResumenTecnicos();

    // ⏳ SIMULADOR EN TIEMPO REAL
    this.startAlarmSimulation();
  }

  private cargarResumenTecnicos(): void {
    this.dashboardService.getResumenTecnicos().subscribe({
      next: (data) => { this.resumenTecnicos = data; },
      error: (err) => console.error('Error al cargar resumen de técnicos:', err)
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarios']) {
      this.ejecutarFiltroUsuarios();
    }
    // Al volver a entrar a la vista de técnicos se resetea la selección.
    if (changes['seccionActiva'] && this.seccionActiva === 'tecnicos') {
      this.tecnicoSeleccionado = null;
      this.mapUrlSafe = null;
      this.estadoUbicacion = null;
      this.direccionActual = null;
    }
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

      // Si se derivó el último PDS de la página actual, volvemos a la
      // página válida más cercana en vez de dejar la tabla vacía.
      if (this.paginaPds > this.totalPaginasPds) {
        this.paginaPds = Math.max(1, this.totalPaginasPds);
      }
    }
  }

  get totalPaginasPds(): number {
    return Math.max(1, Math.ceil(this.pdsPendientes.length / this.limitePds));
  }

  get pdsPendientesPagina(): any[] {
    const inicio = (this.paginaPds - 1) * this.limitePds;
    return this.pdsPendientes.slice(inicio, inicio + this.limitePds);
  }

  irAPaginaPds(n: number): void {
    if (n < 1 || n > this.totalPaginasPds || n === this.paginaPds) return;
    this.paginaPds = n;
  }

  get paginasVisiblesPds(): number[] {
    const inicio = Math.max(1, this.paginaPds - 2);
    const fin = Math.min(this.totalPaginasPds, inicio + 4);
    const paginas: number[] = [];
    for (let i = inicio; i <= fin; i++) paginas.push(i);
    return paginas;
  }

  get totalPaginasTecnicos(): number {
    return Math.max(1, Math.ceil(this.tecnicosActivos.length / this.limiteTecnicos));
  }

  get tecnicosActivosPagina(): any[] {
    const inicio = (this.paginaTecnicos - 1) * this.limiteTecnicos;
    return this.tecnicosActivos.slice(inicio, inicio + this.limiteTecnicos);
  }

  irAPaginaTecnicos(n: number): void {
    if (n < 1 || n > this.totalPaginasTecnicos || n === this.paginaTecnicos) return;
    this.paginaTecnicos = n;
  }

  get paginasVisiblesTecnicos(): number[] {
    const inicio = Math.max(1, this.paginaTecnicos - 2);
    const fin = Math.min(this.totalPaginasTecnicos, inicio + 4);
    const paginas: number[] = [];
    for (let i = inicio; i <= fin; i++) paginas.push(i);
    return paginas;
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

  private ejecutarFiltroUsuarios(): void {
    if (!this.usuarios || this.usuarios.length === 0) {
      this.tecnicosActivos = [];
      this.tecnicosActivosActualizados.emit(0);
      return;
    }

    this.tecnicosActivos = this.usuarios.filter((u: any) => {
      const { NombreRol, Activo } = u;
      const nombreRol = NombreRol ? String(NombreRol).trim().toLowerCase() : '';
      const tieneRolTecnico = (nombreRol === 'técnico' || nombreRol === 'tecnico');
      const estaActivo = (Activo === 1 || Activo === true || String(Activo) === '1');
      return tieneRolTecnico && estaActivo;
    });

    this.tecnicosActivosActualizados.emit(this.tecnicosActivos.length);

    if (this.paginaTecnicos > this.totalPaginasTecnicos) {
      this.paginaTecnicos = Math.max(1, this.totalPaginasTecnicos);
    }
  }

  verTecnicoEnMapa(tecnico: any): void {
    this.tecnicoSeleccionado = tecnico;
    this.mapUrlSafe = null;
    this.direccionActual = null;
    this.estadoUbicacion = 'cargando';

    const idTecnico = tecnico.ID_Usuario || tecnico.id;
    if (!idTecnico) {
      this.estadoUbicacion = 'sin-asignacion';
      return;
    }

    this.dashboardService.getUbicacionActualTecnico(idTecnico).subscribe({
      next: (res: UbicacionActualTecnico) => {
        if (!res.enCurso) {
          this.estadoUbicacion = 'sin-asignacion';
          return;
        }

        this.direccionActual = res.direccion || null;

        if (!res.geocodificado || !res.coordenadasGPS) {
          this.estadoUbicacion = 'sin-geocodificar';
          return;
        }

        const urlMapa = `https://maps.google.com/maps?q=${res.coordenadasGPS}&z=15&output=embed`;
        this.mapUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(urlMapa);
        this.estadoUbicacion = 'ok';
      },
      error: (err) => {
        console.error('Error al obtener ubicación actual del técnico:', err);
        this.estadoUbicacion = 'sin-asignacion';
      }
    });
  }
}