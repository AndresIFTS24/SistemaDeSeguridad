import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'argentinaDate',
  standalone: true
})
export class ArgentinaDatePipe implements PipeTransform {
  transform(value: string | Date, format: 'time' | 'date' | 'datetime' = 'datetime'): string {
    if (!value) return '';
    
    const date = new Date(value);
    
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Argentina/Buenos_Aires'
    };

    switch (format) {
      case 'time':
        return date.toLocaleTimeString('es-AR', {
          ...options,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
      case 'date':
        return date.toLocaleDateString('es-AR', {
          ...options,
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      case 'datetime':
        return date.toLocaleString('es-AR', {
          ...options,
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
    }
  }
}