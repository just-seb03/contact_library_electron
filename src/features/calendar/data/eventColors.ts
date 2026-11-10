import type { CalendarEventColorId } from '../types';

export interface CalendarColorConfig {
  id: CalendarEventColorId;
  label: string;
  background: string;
  border: string;
  accent: string;
  textColor: string;
}

export const CALENDAR_EVENT_COLORS: CalendarColorConfig[] = [
  {
    id: 'blue',
    label: 'Azul',
    background: 'rgba(0, 122, 255, 0.12)',
    border: 'rgba(0, 122, 255, 0.22)',
    accent: '#007aff',
    textColor: '#007aff',
  },
  {
    id: 'lavender',
    label: 'Lavanda',
    background: 'rgba(175, 82, 222, 0.12)',
    border: 'rgba(175, 82, 222, 0.22)',
    accent: '#af52de',
    textColor: '#af52de',
  },
  {
    id: 'mint',
    label: 'Menta',
    background: 'rgba(52, 199, 89, 0.12)',
    border: 'rgba(52, 199, 89, 0.22)',
    accent: '#34c759',
    textColor: '#248a3d',
  },
  {
    id: 'peach',
    label: 'Durazno',
    background: 'rgba(255, 149, 0, 0.12)',
    border: 'rgba(255, 149, 0, 0.22)',
    accent: '#ff9500',
    textColor: '#c97500',
  },
  {
    id: 'rose',
    label: 'Rosa',
    background: 'rgba(255, 45, 85, 0.12)',
    border: 'rgba(255, 45, 85, 0.22)',
    accent: '#ff2d55',
    textColor: '#d91b42',
  },
];

export function getCalendarEventColor(colorId: CalendarEventColorId): CalendarColorConfig {
  return CALENDAR_EVENT_COLORS.find((color) => color.id === colorId)
    ?? CALENDAR_EVENT_COLORS[0];
}
