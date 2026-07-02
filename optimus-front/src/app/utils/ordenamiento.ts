export type DireccionOrden = 'asc' | 'desc';

// Comparador genérico para ordenar arrays de objetos por un campo dinámico.
// Strings se comparan sin distinguir mayúsculas/acentos (localeCompare con
// sensitivity:'base'); números/booleanos por valor. null/undefined siempre
// quedan al final, sea cual sea la dirección.
export function compararValores<T>(a: T, b: T, campo: keyof T, direccion: DireccionOrden): number {
  const valorA = a[campo];
  const valorB = b[campo];

  if (valorA == null && valorB == null) return 0;
  if (valorA == null) return 1;
  if (valorB == null) return -1;

  let resultado: number;
  if (typeof valorA === 'number' && typeof valorB === 'number') {
    resultado = valorA - valorB;
  } else if (typeof valorA === 'boolean' && typeof valorB === 'boolean') {
    resultado = (valorA === valorB) ? 0 : (valorA ? 1 : -1);
  } else {
    resultado = String(valorA).localeCompare(String(valorB), 'es', { sensitivity: 'base' });
  }

  return direccion === 'asc' ? resultado : -resultado;
}
