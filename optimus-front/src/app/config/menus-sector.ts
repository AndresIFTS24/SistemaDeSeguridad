// Fuente única de los menús por sector. La usan SidebarComponent (para pintar
// el menú) y DashboardComponent (para mostrar el nombre del módulo activo en
// el encabezado) — evita mantener dos copias sincronizadas a mano.

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  seccion?: string;
  // Si viene seteada, el ítem navega con Angular Router (sale de /dashboard)
  // en vez de emitir seccionSeleccionada como el resto de los ítems internos.
  ruta?: string;
}

export const MENUS_POR_SECTOR: Record<number, MenuItem[]> = {
  1: [
    { id: 'dashboard', label: 'Dashboard',              icon: 'fa-th-large',         seccion: 'dashboard' },
    { id: 'usuarios',  label: 'Gestión de Usuarios',    icon: 'fa-users',            seccion: 'usuarios'  },
    { id: 'abonados',  label: 'Directorio de Abonados', icon: 'fa-address-book',     seccion: 'abonados'  },
    // "Alta de Abonados" (ruta: '/abonados') se sacó del menú: el alta/edición
    // ahora vive dentro de "Directorio de Abonados" vía AbonadoFormModalComponent.
    // La ruta /abonados y AbonadosComponent quedan sin borrar por si se reusan.
    { id: 'reportes',  label: 'Reportes y Auditoría',   icon: 'fa-clipboard-list',   seccion: 'reportes'  },
    { id: 'mapa',      label: 'Mapa de Cobertura',      icon: 'fa-map-location-dot', seccion: 'mapa'      },
  ],
  3: [
    { id: 'dashboard',       label: 'Dashboard',          icon: 'fa-th-large',  seccion: 'dashboard'       },
    { id: 'usuarios',        label: 'Usuarios',           icon: 'fa-users-cog', seccion: 'usuarios'        },
    { id: 'sistema',         label: 'Estado del Sistema', icon: 'fa-server',    seccion: 'sistema'         },
    { id: 'auditoria',       label: 'Auditoría',          icon: 'fa-history',   seccion: 'auditoria'       },
    { id: 'infraestructura', label: 'Infraestructura',    icon: 'fa-chart-pie', seccion: 'infraestructura' },
  ],
  4: [
    { id: 'dashboard', label: 'Dashboard',           icon: 'fa-th-large',        seccion: 'dashboard' },
    { id: 'central',   label: 'Central de Abonados', icon: 'fa-broadcast-tower', seccion: 'central'   },
    { id: 'alarmas',   label: 'Consola de Alarmas',  icon: 'fa-bell',            seccion: 'alarmas'   },
    { id: 'eventos',   label: 'Registro de Eventos', icon: 'fa-list-alt',        seccion: 'eventos'   },
  ],
  // Técnica y Campo — ID_Sector real = 5 (verificado contra SECTORES).
  // Vista de supervisión (Jefe Técnico / Coordinador Técnico) de todo el
  // equipo, no la vista individual de un técnico de campo. Los 3 ítems
  // mapean directo a los *ngSwitchCase de tecnica.component.html.
  5: [
    { id: 'eventos',      label: 'PDS Pendientes',       icon: 'fa-list-alt',           seccion: 'eventos'      },
    { id: 'tecnicos',     label: 'Técnicos Activos',     icon: 'fa-users',              seccion: 'tecnicos'     },
    { id: 'asignaciones', label: 'Servicios Coordinados', icon: 'fa-clipboard-check',   seccion: 'asignaciones' },
  ],
  // Comercial — ID_Sector real = 6 (verificado contra SECTORES — el 2 real
  // es Operaciones, no Comercial). Mismo criterio que sector 5: un único
  // ítem hasta que ComercialComponent tenga submódulos propios.
  6: [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-th-large', seccion: 'dashboard' },
  ]
};
