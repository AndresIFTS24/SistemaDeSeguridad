import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
// Import solo de tipos: se borra en tiempo de compilación, no agrega nada
// al bundle. El código real de Leaflet se trae con import() dinámico en
// cargarLeaflet(), para que no infle el chunk inicial de toda la app —
// solo lo descarga quien realmente entra a este módulo.
import type * as Leaflet from 'leaflet';

import { AbonadoService } from '../../../../../../services/abonado.service';

@Component({
  selector: 'app-direccion-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './direccion-mapa.component.html',
  styleUrls: ['./direccion-mapa.component.css']
})
export class DireccionMapaComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapaEl') mapaEl?: ElementRef<HTMLDivElement>;

  public cargando: boolean = true;
  public totalAbonados: number = 0;
  public totalGeocodificados: number = 0;

  private L: typeof Leaflet | null = null;
  private map: Leaflet.Map | null = null;
  private markers: Leaflet.LayerGroup | null = null;
  private tileLayer: Leaflet.TileLayer | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private ultimoAncho = 0;
  private ultimoAlto = 0;

  constructor(private abonadoService: AbonadoService) {}

  ngAfterViewInit(): void {
    this.cargarYRenderizar();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }

  private async cargarYRenderizar(): Promise<void> {
    this.cargando = true;
    this.L = await import('leaflet');

    this.abonadoService.getAllAbonados().subscribe({
      next: (res: any) => {
        console.log('[DEBUG mapa] res crudo:', res);
        const abonados = res.abonados || res || [];
        console.log('[DEBUG mapa] typeof abonados:', typeof abonados, '| Array.isArray:', Array.isArray(abonados), '| valor:', abonados);
        this.totalAbonados = abonados.length;
        this.cargando = false;
        // No hace falta adivinar un tiempo de espera para que el navegador
        // termine de calcular el layout (display:none → visible) — el
        // ResizeObserver que se arma en renderizarMapa() se encarga de eso
        // reaccionando al tamaño real del contenedor, sea cuando sea.
        this.renderizarMapa(abonados);
      },
      error: (err: any) => {
        console.error('Error al cargar abonados para el mapa:', err);
        this.cargando = false;
      }
    });
  }

  private renderizarMapa(abonados: any[]): void {
    const contenedor = this.mapaEl?.nativeElement;
    const L = this.L;
    if (!contenedor || !L) return;

    this.map?.remove();
    // keyboard:false — el handler de teclado de Leaflet enfoca el contenedor
    // y llama window.scrollTo() en cada click (hasta en zona vacía), lo que
    // rompía el scroll/foco del resto del dashboard. No hace falta paneo por
    // teclado en esta versión de solo lectura.
    this.map = L.map(contenedor, { zoomControl: true, keyboard: false }).setView([-34.6, -60.0], 6);

    this.tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
      detectRetina: true // sin esto, el {r} de la URL nunca se activa
    }).addTo(this.map);

    this.markers = L.layerGroup().addTo(this.map);

    const puntos: Leaflet.LatLngExpression[] = [];

    for (const a of abonados) {
      const coords = this.parsearCoordenadas(a.CoordenadasGPS);
      if (!coords) continue;

      puntos.push(coords);
      const color = a.Activo ? '#10b981' : '#ef4444';

      const marcador = L.marker(coords, { icon: this.crearIcono(L, color) });
      marcador.bindPopup(this.armarPopup(a));
      marcador.addTo(this.markers);
    }

    this.totalGeocodificados = puntos.length;

    if (puntos.length > 0) {
      this.map.fitBounds(L.latLngBounds(puntos), { padding: [30, 30], maxZoom: 13 });
    }

    // ResizeObserver: reacciona al tamaño real del contenedor en vez de
    // adivinar un timing, cubriendo también la transición inicial de
    // display:none → 560px visible. Dispara solo una vez al observar por
    // primera vez, así que no hace falta ningún setTimeout adicional.
    //
    // invalidateSize() por sí solo corrige el "viewport" que usa Leaflet
    // para pedir tiles nuevos, pero si el layer YA había pedido/posicionado
    // tiles de más chico (mosaico con huecos), esos tiles viejos no se
    // descartan solos — por eso sumamos tileLayer.redraw(), que fuerza a
    // limpiar y volver a pedir todos los tiles visibles para el tamaño
    // corregido.
    //
    // Guard de tamaño: redraw() es pesado (borra y vuelve a pedir todos los
    // tiles visibles). Sin este guard, cualquier cambio mínimo detectado
    // por el observer — incluso ruido de sub-píxel — lo dispara de nuevo,
    // lo que satura el hilo principal y se nota como toda la app trabada
    // (scroll, header, sidebar) mientras el mapa está montado.
    this.resizeObserver?.disconnect();
    this.ultimoAncho = 0;
    this.ultimoAlto = 0;
    this.resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const ancho = Math.round(width);
      const alto = Math.round(height);
      if (ancho === this.ultimoAncho && alto === this.ultimoAlto) return;

      this.ultimoAncho = ancho;
      this.ultimoAlto = alto;
      this.map?.invalidateSize();
      this.tileLayer?.redraw();
    });
    this.resizeObserver.observe(contenedor);
  }

  private parsearCoordenadas(valor: string | null | undefined): [number, number] | null {
    if (!valor) return null;
    const partes = valor.split(',').map(p => parseFloat(p.trim()));
    if (partes.length !== 2 || partes.some(p => isNaN(p))) return null;
    return [partes[0], partes[1]];
  }

  private crearIcono(L: typeof Leaflet, color: string): Leaflet.DivIcon {
    return L.divIcon({
      className: 'pin-abonado',
      html: `<span style="display:block; width:14px; height:14px; border-radius:50%; background:${color}; border:2px solid #0b0f19; box-shadow:0 0 6px ${color};"></span>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -8]
    });
  }

  private armarPopup(abonado: any): string {
    const direccion = [abonado.Calle, abonado.Numero].filter(Boolean).join(' ')
      + (abonado.Ciudad ? `, ${abonado.Ciudad}` : '');
    const estado = abonado.Activo
      ? '<span style="color:#10b981;">Activo</span>'
      : '<span style="color:#ef4444;">Inactivo</span>';

    return `
      <div style="font-family:'Poppins',sans-serif; min-width:180px;">
        <strong style="display:block; margin-bottom:4px;">${abonado.RazonSocial}</strong>
        <span style="display:block; color:#64748b; font-size:0.8rem; margin-bottom:4px;">#${abonado.NumeroDeAbonado}</span>
        <span style="display:block; font-size:0.85rem; margin-bottom:4px;">${direccion}</span>
        ${estado}
      </div>
    `;
  }
}
