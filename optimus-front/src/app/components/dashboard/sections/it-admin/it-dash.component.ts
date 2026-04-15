import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-it-dash',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>Panel IT en construcción</h2>`,
  styles: [`h2 { color: #3b82f6; }`]
})
export class ItDashComponent { } // Verifica que el nombre sea EXACTAMENTE este