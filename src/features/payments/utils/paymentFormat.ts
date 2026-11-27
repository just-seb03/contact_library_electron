import { parseDateOnly, toDateKey } from '../../../shared/utils/dates';

export function getTodayInputValue(): string {
  return toDateKey(new Date());
}

/**
 * Fecha con la que se guarda un pago: siempre `YYYY-MM-DD`.
 * Antes se guardaba "27 Nov 2026" (en-GB), lo que rompía comparaciones con la fecha de hoy
 * (Dashboard), el orden por fecha en SQLite y el selector al editar.
 */
export function formatPaymentDate(value: string): string {
  return normalizePaymentDate(value);
}

/**
 * Convierte cualquier formato conocido ("2026-11-27", "27 Nov 2026", "27 Nov, 2026",
 * "05 Sept 2026") a `YYYY-MM-DD`. Si no se reconoce, devuelve el valor tal cual.
 */
export function normalizePaymentDate(value: string): string {
  const parsed = parseDateOnly(value ?? '');
  return parsed ? toDateKey(parsed) : value;
}

/** Valor para el selector de fecha; si la fecha guardada no se reconoce, usa hoy. */
export function toDateInputValue(value: string): string {
  const parsed = parseDateOnly(value ?? '');
  return parsed ? toDateKey(parsed) : getTodayInputValue();
}

/** Fecha legible para mostrar en listas ("27 nov 2026"). */
export function displayPaymentDate(value: string): string {
  const parsed = parseDateOnly(value ?? '');
  if (!parsed) return value;
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}
