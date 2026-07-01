import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'argentinaDate',
  standalone: true
})
export class ArgentinaDatePipe implements PipeTransform {
  transform(value: string | Date, format: 'time' | 'date' | 'datetime' | 'relative' = 'datetime'): string {
    if (!value) return '';

    const date = new Date(value);

    if (format === 'relative') {
      const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
      if (diffMin < 1) return 'Recién';
      if (diffMin < 60) return `Hace ${diffMin} min`;
      const diffH = Math.floor(diffMin / 60);
      if (diffH < 24) return `Hace ${diffH} h`;
      const diffD = Math.floor(diffH / 24);
      return `Hace ${diffD} d`;
    }

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