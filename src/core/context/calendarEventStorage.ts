import type { CalendarEvent, CalendarEventColorId } from './types';

const STORAGE_KEY = 'contact_library_calendar_events';
const COLOR_IDS: CalendarEventColorId[] = ['lavender', 'blue', 'mint', 'peach', 'rose'];

function isCalendarEvent(value: unknown): value is CalendarEvent {
  if (!value || typeof value !== 'object') return false;
  const event = value as Record<string, unknown>;
  return typeof event.id === 'string'
    && typeof event.title === 'string'
    && typeof event.date === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(event.date)
    && typeof event.startTime === 'string'
    && /^\d{2}:\d{2}$/.test(event.startTime)
    && typeof event.endTime === 'string'
    && /^\d{2}:\d{2}$/.test(event.endTime)
    && typeof event.colorId === 'string'
    && COLOR_IDS.includes(event.colorId as CalendarEventColorId)
    && typeof event.alarmMinutes === 'number'
    && Number.isFinite(event.alarmMinutes)
    && (typeof event.clientId === 'number' || event.clientId === null)
    && typeof event.details === 'string';
}

export function loadCalendarEvents(): CalendarEvent[] {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return [];
    const parsed: unknown = JSON.parse(serialized);
    if (!Array.isArray(parsed) || !parsed.every(isCalendarEvent)) {
      console.error('No se pudieron cargar los eventos: los datos guardados no son válidos.');
      return [];
    }
    return parsed;
  } catch (error) {
    console.error('No se pudieron cargar los eventos del calendario.', error);
    return [];
  }
}

export function saveCalendarEvents(events: CalendarEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('No se pudieron guardar los eventos del calendario.', error);
  }
}
