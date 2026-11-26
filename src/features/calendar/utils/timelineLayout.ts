import type { HearingEvent } from '../../../core/context/types';
import type { CalendarEvent } from '../types';

export type DayTimelineEntry =
  | { kind: 'hearing'; id: string; startHour: number; endHour: number; hearing: HearingEvent }
  | { kind: 'event'; id: string; startHour: number; endHour: number; event: CalendarEvent };

export interface TimelineCluster {
  id: string;
  startHour: number;
  endHour: number;
  items: DayTimelineEntry[];
}

export function parseClockTimeHours(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours + minutes / 60;
}

export function parseHearingTimeHours(timeStr: string): number {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return 9;
  let hour = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour + minutes / 60;
}

/**
 * Agrupa audiencias y eventos que coinciden o se solapan en el tiempo
 * dentro de un mismo bloque conjunto para listarlos uno debajo del otro.
 */
export function groupDayOverlaps(
  hearings: HearingEvent[],
  events: CalendarEvent[],
  hearingDurationHours = 0.75
): TimelineCluster[] {
  const entries: DayTimelineEntry[] = [
    ...hearings.map((hearing) => {
      const startHour = parseHearingTimeHours(hearing.timeStr);
      return {
        kind: 'hearing' as const,
        id: `hearing-${hearing.id}`,
        startHour,
        endHour: Math.min(24, startHour + hearingDurationHours),
        hearing,
      };
    }),
    ...events.map((event) => {
      const startHour = parseClockTimeHours(event.startTime);
      const endHour = Math.max(parseClockTimeHours(event.endTime), startHour + 0.5);
      return {
        kind: 'event' as const,
        id: `event-${event.id}`,
        startHour,
        endHour,
        event,
      };
    }),
  ];

  entries.sort((a, b) => a.startHour - b.startHour || b.endHour - a.endHour);

  const clusters: TimelineCluster[] = [];
  let current: DayTimelineEntry[] = [];
  let currentStart = 0;
  let currentEnd = -1;

  const flush = () => {
    if (current.length === 0) return;
    clusters.push({
      id: current.map((item) => item.id).join('__'),
      startHour: currentStart,
      endHour: currentEnd,
      items: current,
    });
    current = [];
    currentEnd = -1;
  };

  for (const entry of entries) {
    if (current.length > 0 && entry.startHour >= currentEnd - 1e-4) {
      flush();
    }
    if (current.length === 0) {
      currentStart = entry.startHour;
    }
    current.push(entry);
    currentEnd = Math.max(currentEnd, entry.endHour);
  }
  flush();

  return clusters;
}
