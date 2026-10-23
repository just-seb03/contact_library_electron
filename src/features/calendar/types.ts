export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  colorId: CalendarEventColorId;
  alarmMinutes: number;
  clientId: number | null;
  details: string;
}

export type CalendarEventColorId =
  | 'lavender'
  | 'blue'
  | 'mint'
  | 'peach'
  | 'rose';
