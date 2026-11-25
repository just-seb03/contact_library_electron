/**
 * @file dates.ts
 * @description Utilidades de fechas compartidas entre main y renderer.
 *
 * La app guarda fechas en varios formatos según el origen:
 * - Calendario:  "2026-10-28" + "10:00"           (ISO + 24 h)
 * - Audiencias:  "28 Oct, 2026 - 10:00 AM"        (mes abreviado + 12 h)
 * - Pagos:       "05 Oct, 2026" o "05 Oct 2026"   (seed / formulario en-GB, que puede usar "Sept")
 *
 * Todas las funciones trabajan en hora local y devuelven `null` ante un formato no reconocido.
 */

const MINUTE_MS = 60_000

/** Primeras 3 letras del mes (inglés y español) → índice 0-11. */
const MONTH_INDEX: Record<string, number> = {
  jan: 0, ene: 0,
  feb: 1,
  mar: 2,
  apr: 3, abr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7, ago: 7,
  sep: 8, set: 8,
  oct: 9,
  nov: 10,
  dec: 11, dic: 11,
}

export interface TimeOfDay {
  hours: number
  minutes: number
}

/** "14:30", "9:05", "02:00 PM", "12:15 am" → { hours, minutes } en 24 h. */
export function parseTimeOfDay(value: string): TimeOfDay | null {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])?$/)
  if (!match) return null

  let hours = Number(match[1])
  const minutes = Number(match[2])
  const meridiem = match[3]?.toUpperCase()
  if (minutes > 59) return null

  if (meridiem) {
    if (hours < 1 || hours > 12) return null
    if (meridiem === 'PM' && hours !== 12) hours += 12
    if (meridiem === 'AM' && hours === 12) hours = 0
  } else if (hours > 23) {
    return null
  }
  return { hours, minutes }
}

/** "2026-10-28", "28 Oct, 2026", "05 Sept 2026" → fecha local a las 00:00. */
export function parseDateOnly(value: string): Date | null {
  const text = value.trim()

  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (iso) {
    return buildDate(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
  }

  const short = text.match(/^(\d{1,2})\s+([A-Za-zÁÉÍÓÚáéíóú]{3,})\.?,?\s+(\d{4})$/)
  if (short) {
    const monthIndex = MONTH_INDEX[short[2].slice(0, 3).toLowerCase()]
    if (monthIndex === undefined) return null
    return buildDate(Number(short[3]), monthIndex, Number(short[1]))
  }

  return null
}

/** Combina una fecha y una hora en cualquiera de los formatos soportados. */
export function parseDateTime(date: string, time: string): Date | null {
  const day = parseDateOnly(date)
  const clock = parseTimeOfDay(time)
  if (!day || !clock) return null
  day.setHours(clock.hours, clock.minutes, 0, 0)
  return day
}

/** "28 Oct, 2026 - 10:00 AM" → Date. Formato de `proximaAudiencia`. */
export function parseDateWithTime(value: string): Date | null {
  const separator = value.lastIndexOf(' - ')
  if (separator === -1) return null
  return parseDateTime(value.slice(0, separator), value.slice(separator + 3))
}

/** Date → "2026-10-28" (hora local). */
export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Date → "14:30" (hora local). */
export function toTimeKey(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * MINUTE_MS)
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/** Inicio del día (00:00 local). */
export function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

/** `true` si `moment` cae en el intervalo semiabierto `(from, to]`. */
export function isWithin(moment: Date, from: Date, to: Date): boolean {
  const time = moment.getTime()
  return time > from.getTime() && time <= to.getTime()
}

function buildDate(year: number, monthIndex: number, day: number): Date | null {
  const date = new Date(year, monthIndex, day)
  // Rechaza fechas desbordadas como 31-02 (que JS convertiría en marzo).
  return date.getFullYear() === year && date.getMonth() === monthIndex && date.getDate() === day
    ? date
    : null
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}
