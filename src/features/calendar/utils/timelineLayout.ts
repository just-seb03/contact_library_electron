import type { HearingEvent } from '../../../core/context/types';
import type { CalendarEvent } from '../types';

export interface PositionedTimelineItem<T> {
  item: T;
  startHour: number;
  endHour: number;
  col: number;
  totalCols: number;
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

export type DayTimelineEntry =
  | { kind: 'hearing'; id: string; startHour: number; endHour: number; hearing: HearingEvent }
  | { kind: 'event'; id: string; startHour: number; endHour: number; event: CalendarEvent };

/**
 * Calcula columnas sin solapamiento para audiencias y eventos que coinciden en el mismo horario.
 */
export function computeDayOverlapLayout(
  hearings: HearingEvent[],
  events: CalendarEvent[],
  hearingDurationHours = 1
): PositionedTimelineItem<DayTimelineEntry>[] {
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

  const result: PositionedTimelineItem<DayTimelineEntry>[] = [];
  let cluster: DayTimelineEntry[] = [];
  let clusterEnd = -1;

  const flushCluster = () => {
    if (cluster.length === 0) return;
    const colEnds: number[] = [];
    const assignedCols: number[] = [];

    for (const item of cluster) {
      let colIndex = colEnds.findIndex((end) => end <= item.startHour + 1e-4);
      if (colIndex === -1) {
        colIndex = colEnds.length;
        colEnds.push(item.endHour);
      } else {
        colEnds[colIndex] = item.endHour;
      }
      assignedCols.push(colIndex);
    }

    const totalCols = Math.max(1, colEnds.length);
    cluster.forEach((item, idx) => {
      result.push({
        item,
        startHour: item.startHour,
        endHour: item.endHour,
        col: assignedCols[idx],
        totalCols,
      });
    });

    cluster = [];
    clusterEnd = -1;
  };

  for (const entry of entries) {
    if (cluster.length > 0 && entry.startHour >= clusterEnd - 1e-4) {
      flushCluster();
    }
    cluster.push(entry);
    clusterEnd = Math.max(clusterEnd, entry.endHour);
  }
  flushCluster();

  return result;
}
