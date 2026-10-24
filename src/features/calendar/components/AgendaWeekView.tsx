import { useEffect, useRef } from 'react';
import type { CSSProperties, FC } from 'react';
import type { HearingEvent } from '../../../core/context/types';
import type { CalendarEvent } from '../types';
import { CALENDAR_EVENT_COLORS, getCalendarEventColor } from '../data/eventColors';

interface AgendaWeekViewProps {
  selectedDate: Date;
  calendarEvents: CalendarEvent[];
  hearings: HearingEvent[];
  onSelectEvent: (event: CalendarEvent | HearingEvent) => void;
}

const HOUR_HEIGHT = 64;
const HOUR_LABEL_WIDTH = 58;
const HEADER_HEIGHT = 42;
const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const WEEKDAYS = ['lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.', 'dom.'];
const borderColor = 'rgba(0,0,0,0.08)';

function getWeekStart(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - offset);
  return start;
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseTime(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours + minutes / 60;
}

function parseHearingTime(time: string): number {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return 9;
  let hours = Number(match[1]);
  if (match[3].toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (match[3].toUpperCase() === 'AM' && hours === 12) hours = 0;
  return hours + Number(match[2]) / 60;
}

function formatHour(hour: number): string {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(2000, 0, 1, hour));
}

function formatWeekday(index: number): string {
  return WEEKDAYS[index];
}

const containerStyle: CSSProperties = {
  minWidth: 0,
  overflow: 'auto',
  height: '100%',
  overscrollBehavior: 'contain',
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `${HOUR_LABEL_WIDTH}px repeat(7, minmax(100px, 1fr))`,
  minWidth: HOUR_LABEL_WIDTH + 7 * 100,
  position: 'relative',
};

const headerCellStyle: CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 4,
  height: HEADER_HEIGHT,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  backgroundColor: 'var(--app-color-white, #ffffff)',
  borderBottom: `1px solid ${borderColor}`,
  borderRight: `1px solid ${borderColor}`,
  fontSize: 12,
  fontWeight: 600,
  color: '#626267',
};

const hourCellStyle: CSSProperties = {
  height: HOUR_HEIGHT,
  boxSizing: 'border-box',
  padding: '2px 8px 0 0',
  textAlign: 'right',
  fontSize: 11,
  color: '#626267',
  fontVariantNumeric: 'tabular-nums',
  borderRight: `1px solid ${borderColor}`,
};

const dayCellStyle: CSSProperties = {
  position: 'relative',
  height: HOUR_HEIGHT,
  boxSizing: 'border-box',
  borderTop: `1px solid ${borderColor}`,
  borderRight: `1px solid ${borderColor}`,
};

export const AgendaWeekView: FC<AgendaWeekViewProps> = ({
  selectedDate,
  calendarEvents,
  hearings,
  onSelectEvent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const weekStart = getWeekStart(selectedDate);
  const weekStartTime = weekStart.getTime();
  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + index);
    return day;
  });
  const dateKeys = days.map(toDateKey);
  const locale = document.documentElement.lang || 'es-ES';
  const dayFormatter = new Intl.DateTimeFormat(locale, { day: 'numeric' });

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = 8 * HOUR_HEIGHT;
  }, [weekStartTime]);

  return (
    <div ref={containerRef} style={containerStyle}>
      <div style={gridStyle}>
        <div style={{ ...headerCellStyle, left: 0, zIndex: 5, position: 'sticky' }} />
        {days.map((day, index) => {
          const isSelected = toDateKey(day) === toDateKey(selectedDate);
          const isToday = toDateKey(day) === toDateKey(new Date());
          return (
            <div key={dateKeys[index]} style={headerCellStyle}>
              {formatWeekday(index)}
              <span
                style={{
                  minWidth: 22,
                  height: 22,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? '#ffffff' : '#626267',
                  backgroundColor: isSelected ? '#1c1c1e' : 'transparent',
                  boxShadow: isToday && !isSelected ? 'inset 0 0 0 1px #007aff' : 'none',
                }}
              >
                {dayFormatter.format(day)}
              </span>
            </div>
          );
        })}

        {HOURS.map((hour) => (
          <div key={`hour-${hour}`} style={{ display: 'contents' }}>
            <div style={hourCellStyle}>{formatHour(hour)}</div>
            {days.map((day, dayIndex) => (
              <div key={`${hour}-${dateKeys[dayIndex]}`} style={dayCellStyle}>
                {hour === 0 && calendarEvents
                  .filter((event) => event.date === dateKeys[dayIndex])
                  .map((event) => {
                    const start = parseTime(event.startTime);
                    const duration = Math.max(parseTime(event.endTime) - start, 0.5);
                    const color = getCalendarEventColor(event.colorId);
                    return (
                      <button
                        key={event.id}
                        type="button"
                        title={event.title}
                        aria-label={event.title}
                        onClick={() => onSelectEvent(event)}
                        style={{
                          position: 'absolute',
                          top: start * HOUR_HEIGHT,
                          left: 4,
                          right: 4,
                          height: Math.max(duration * HOUR_HEIGHT - 4, 30),
                          zIndex: 2,
                          overflow: 'hidden',
                          textAlign: 'left',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          border: `1px solid ${color.border}`,
                          borderRadius: 5,
                          borderLeftWidth: 3,
                          backgroundColor: color.background,
                          color: '#1c1c1e',
                          padding: '4px 6px',
                          fontFamily: 'inherit',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {event.title}
                      </button>
                    );
                  })}
                {hour === 0 && hearings
                  .filter((hearing) => (
                    hearing.year === day.getFullYear()
                    && hearing.monthIndex === day.getMonth()
                    && hearing.day === day.getDate()
                  ))
                  .map((hearing, hearingIndex) => {
                    const start = parseHearingTime(hearing.timeStr);
                    const color = CALENDAR_EVENT_COLORS[
                      hearingIndex % CALENDAR_EVENT_COLORS.length
                    ];
                    return (
                      <button
                        key={hearing.id}
                        type="button"
                        title={hearing.clientName}
                        aria-label={hearing.clientName}
                        onClick={() => onSelectEvent(hearing)}
                        style={{
                          position: 'absolute',
                          top: start * HOUR_HEIGHT,
                          left: 4,
                          right: 4,
                          height: 36,
                          zIndex: 2,
                          overflow: 'hidden',
                          textAlign: 'left',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          border: `1px solid ${color.border}`,
                          borderRadius: 5,
                          borderLeftWidth: 3,
                          backgroundColor: color.background,
                          color: '#1c1c1e',
                          padding: '4px 6px',
                          fontFamily: 'inherit',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {hearing.clientName}
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
