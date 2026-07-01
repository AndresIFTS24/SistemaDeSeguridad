// Fuente única de los menús por sector. La usan SidebarComponent (para pintar
// el menú) y DashboardComponent (para mostrar el nombre del módulo activo en
// el encabezado) — evita mantener dos copias sincronizadas a mano.

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  seccion?: string;
}

export const MENUS_POR_SECTOR: Record<number, MenuItem[]> = {
  1: [
    { id: 'dashboard', label: 'Dashboard',              icon: 'fa-th-large',         seccion: 'dashboard' },
    { id: 'usuarios',  label: 'Gestión de Usuarios',    icon: 'fa-users',            seccion: 'usuarios'  },
    { id: 'abonados',  label: 'Directorio de Abonados', icon: 'fa-address-book',     seccion: 'abonados'  },
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
  ]
};
