import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { SocketService } from '../../../../services/socket.service';
import { Subscription } from 'rxjs';
import { Input } from '@angular/core';
interface OT {
  id_ot: number;
  abonado: string;
  nro_abonado: string;
  urgencia: string;
  estado: string;
  tecnico: string;
  tipo_tarea: string;
}

@Component({
  selector: 'app-tecnica-dash',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './tecnica.component.html',
  styleUrls: ['./tecnica.component.css']
})
export class TecnicaComponent implements OnInit, OnDestroy {
  // Estado de la UI
  vistaActual: 'ots' | 'abonados' = 'ots';
  filtroBusqueda: string = '';
  sistemaOperativo: boolean = true;
  usuarioNombre: string = '';
  @Input() abonados: any[] = [];
  @Input() seccionActiva: string = 'dashboard';

  // NUEVOS KPIs CORREGIDOS (Coinciden exactamente con tu HTML)
  kpiAbonadosActivos: number = 0;
  kpiPdsPendientes: number = 0;
  kpiTecnicosActivos: number = 0;
  kpiOtsCoordinadas: number = 0;

  // Listados
  ordenesTrabajo: OT[] = [];
  ordenesFiltradas: OT[] = [];

  private subs: Subscription[] = [];
  private apiUrl = 'http://localhost:3000/api/tecnica/dashboard-tecnico';

  constructor(
    private http: HttpClient,
    private router: Router,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    // === CONTROL DE ACCESO INTEGRADO ===
    const userRaw = localStorage.getItem('usuario_optimus') || sessionStorage.getItem('usuario_optimus');
    if (!userRaw) {
      this.router.navigate(['/login']);
      return;
    }

    const usuario = JSON.parse(userRaw);
    this.usuarioNombre = usuario.Nombre || usuario.email || 'Usuario Técnico';
    
    // Mapeo flexible de roles según guardes 'idSector', 'idRol' o 'ID_Rol'
    const rolActual = usuario.idRol || usuario.ID_Rol || usuario.idSector;

    // Si NO es Coordinador Técnico (3) ni Jefe Técnico (4), denegamos el acceso
    if (rolActual !== 3 && rolActual !== 4) {
      console.warn('⚠️ Acceso denegado: Se requieren permisos del área técnica.');
      this.router.navigate(['/dashboard']);
      return;
    }

    // Si pasa el filtro de rol, inicializamos el dashboard
    this.sistemaOperativo = this.socketService.conectado;
    this.cargarDatos();
    this.configurarWebSockets();
  }

  cargarDatos(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        this.ordenesTrabajo = res.ots || [];
        this.ordenesFiltradas = [...this.ordenesTrabajo];
        
        // Mapeo dinámico de la respuesta de la Base de Datos a tus nuevos KPIs
        this.kpiTecnicosActivos = res.kpis.tecnicosCampo; 
        this.kpiPdsPendientes = res.kpis.otsPendientes;   
        this.kpiOtsCoordinadas = res.kpis.otsHoy;         

        // Cálculo dinámico de Abonados Activos únicos basados en las O.T. cargadas
        const cuentasUnicas = new Set(this.ordenesTrabajo.map(ot => ot.nro_abonado));
        this.kpiAbonadosActivos = cuentasUnicas.size;
      },
      error: (err) => console.error('Error al cargar datos técnicos:', err)
    });
  }

  configurarWebSockets(): void {
    // Escuchar si Monitoreo genera una nueva OT en tiempo real
    this.subs.push(
      this.socketService.on<OT>('nueva_ot_tecnica').subscribe((nuevaOT) => {
        this.ordenesTrabajo.unshift(nuevaOT);
        this.kpiOtsCoordinadas++;
        this.kpiPdsPendientes++;
        this.socketService.reproducirAlarmaNormal(); // Tu sonido de aviso sutil
        
        // Recalcular cuentas únicas de abonados con la nueva OT ingresada
        const cuentasUnicas = new Set(this.ordenesTrabajo.map(ot => ot.nro_abonado));
        this.kpiAbonadosActivos = cuentasUnicas.size;

        this.filtrar();
      })
    );
  }

  filtrar(): void {
    const term = this.filtroBusqueda.toLowerCase().trim();
    if (!term) {
      this.ordenesFiltradas = [...this.ordenesTrabajo];
      return;
    }
    this.ordenesFiltradas = this.ordenesTrabajo.filter(ot =>
      ot.abonado?.toLowerCase().includes(term) ||
      ot.nro_abonado?.toLowerCase().includes(term) ||
      ot.tecnico?.toLowerCase().includes(term) ||
      ot.tipo_tarea?.toLowerCase().includes(term)
    );
  }

  cambiarVista(target: 'ots' | 'abonados'): void {
    this.vistaActual = target;
    this.filtroBusqueda = '';
    this.filtrar();
  }

  despacharUnidad(idOt: number): void {
    console.log(`Despachando cuadrilla para la OT #${idOt}`);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}