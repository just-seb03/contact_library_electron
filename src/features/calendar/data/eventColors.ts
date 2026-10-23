import type { CalendarEventColorId } from '../types';

export const CALENDAR_EVENT_COLORS: {
  id: CalendarEventColorId;
  label: string;
  background: string;
  border: string;
}[] = [
  { id: 'lavender', label: 'Lavanda', background: '#f0eaff', border: '#9b7fd4' },
  { id: 'blue', label: 'Azul', background: '#e6f0ff', border: '#6ea8e6' },
  { id: 'mint', label: 'Menta', background: '#e5f7ec', border: '#5ec488' },
  { id: 'peach', label: 'Durazno', background: '#fff0df', border: '#e6a85c' },
  { id: 'rose', label: 'Rosa', background: '#fce8ed', border: '#dc8297' },
];

export function getCalendarEventColor(colorId: CalendarEventColorId) {
  return CALENDAR_EVENT_COLORS.find((color) => color.id === colorId)
    ?? CALENDAR_EVENT_COLORS[0];
}
