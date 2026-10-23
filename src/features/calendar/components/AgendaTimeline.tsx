import type { FC, CSSProperties } from 'react';
import { APP_COLORS } from '../../../core/theme/style';
import type { HearingEvent } from '../../../core/context/types';
import type { CalendarEvent } from '../types';
import { getCalendarEventColor } from '../data/eventColors';

interface AgendaTimelineProps {
  todayHearings: HearingEvent[];
  calendarEvents: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent | HearingEvent) => void;
}

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const HOUR_HEIGHT = 64;
const HOUR_COLUMN_WIDTH = 80;
const EVENT_LEFT = HOUR_COLUMN_WIDTH + 12;
const SECTION_BORDER_COLOR = 'rgba(0,0,0,0.08)';

function formatMinutesOfDay(minutes: number, formatter: Intl.DateTimeFormat): string {
  const time = new Date(2000, 0, 1);
  time.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return formatter.format(time);
}

function formatHour(hour: number, formatter: Intl.DateTimeFormat): string {
  return formatMinutesOfDay(hour * 60, formatter);
}

function formatHearingTime(time: string, formatter: Intl.DateTimeFormat): string {
  return formatMinutesOfDay(parseTimeToHour(time) * 60, formatter);
}

function parseTimeToHour(timeStr: string): number {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return 9;
  let hour = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour + minutes / 60;
}

const EVENT_COLORS = [
  { bg: '#f0eaff', border: '#9b7fd4' },
  { bg: '#e6f0ff', border: '#6ea8e6' },
  { bg: '#e5f7ec', border: '#5ec488' },
  { bg: '#fff0df', border: '#e6a85c' },
];

function parseClockTime(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours + minutes / 60;
}

function formatClockTime(time: string, formatter: Intl.DateTimeFormat): string {
  const [hours, minutes] = time.split(':').map(Number);
  return formatMinutesOfDay(hours * 60 + minutes, formatter);
}

const containerStyle: CSSProperties = {
  position: 'relative',
  minHeight: HOURS.length * HOUR_HEIGHT,
  marginTop: 8,
};

const hourRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  height: HOUR_HEIGHT,
};

const hourColumnBackgroundStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  width: HOUR_COLUMN_WIDTH,
  backgroundColor: '#f7f7f8',
  zIndex: 0,
  pointerEvents: 'none',
};

const hourDividerStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: HOUR_COLUMN_WIDTH,
  width: 1,
  backgroundColor: SECTION_BORDER_COLOR,
  zIndex: 1,
  pointerEvents: 'none',
};

const hourLabelStyle: CSSProperties = {
  position: 'relative',
  zIndex: 2,
  width: HOUR_COLUMN_WIDTH,
  boxSizing: 'border-box',
  flexShrink: 0,
  fontSize: 11,
  fontWeight: 500,
  color: '#626267',
  textAlign: 'center',
  transform: 'translateY(-7px)',
};

const hourCellStyle: CSSProperties = {
  flex: 1,
  height: '100%',
  position: 'relative',
  borderTop: '1px solid rgba(0,0,0,0.06)',
};

const nowLineStyle: CSSProperties = {
  position: 'absolute',
  left: HOUR_COLUMN_WIDTH,
  right: 0,
  height: 2,
  backgroundColor: APP_COLORS.primary,
  zIndex: 3,
};

const nowDotStyle: CSSProperties = {
  position: 'absolute',
  left: HOUR_COLUMN_WIDTH - 5,
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: APP_COLORS.primary,
  transform: 'translateY(-4px)',
  zIndex: 4,
};

const eventBlockBaseStyle: CSSProperties = {
  position: 'absolute',
  left: EVENT_LEFT,
  right: 8,
  borderRadius: 8,
  padding: '6px 10px',
  zIndex: 2,
  overflow: 'hidden',
  cursor: 'pointer',
  borderLeft: '3px solid',
  borderTop: 'none',
  borderRight: 'none',
  borderBottom: 'none',
  textAlign: 'left',
  fontFamily: 'inherit',
};

const eventTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: APP_COLORS.black,
  lineHeight: 1.3,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const eventTimeStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 400,
  color: APP_COLORS.neutral,
  lineHeight: 1.3,
};

export const AgendaTimeline: FC<AgendaTimelineProps> = ({
  todayHearings,
  calendarEvents,
  onSelectEvent,
}) => {
  const locale = document.documentElement.lang || undefined;
  const hourFormatter = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
  const eventTimeFormatter = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  });
  const now = new Date();
  const currentHourDecimal = now.getHours() + now.getMinutes() / 60;
  const nowLineTop = currentHourDecimal * HOUR_HEIGHT;
  const showNowLine = currentHourDecimal >= 0 && currentHourDecimal <= HOURS.length;

  return (
    <div style={containerStyle}>
      <div style={hourColumnBackgroundStyle} />
      <div style={hourDividerStyle} />

      {/* Hourly rows */}
      {HOURS.map((hour) => (
        <div key={hour} style={hourRowStyle}>
          <div style={hourLabelStyle}>{formatHour(hour, hourFormatter)}</div>
          <div style={hourCellStyle} />
        </div>
      ))}

      {/* Current time indicator */}
      {showNowLine && (
        <>
          <div style={{ ...nowLineStyle, top: nowLineTop }} />
          <div style={{ ...nowDotStyle, top: nowLineTop }} />
        </>
      )}

      {/* Events positioned on the timeline */}
      {todayHearings.map((hearing, idx) => {
        const hourDecimal = parseTimeToHour(hearing.timeStr);
        const eventHeight = Math.min(HOUR_HEIGHT * 1.2, (HOURS.length - hourDecimal) * HOUR_HEIGHT);
        const colors = EVENT_COLORS[idx % EVENT_COLORS.length];
        return (
          <button
            type="button"
            key={hearing.id}
            aria-label={`${hearing.clientName}, audiencia ${hearing.timeStr}`}
            onClick={() => onSelectEvent(hearing)}
            style={{
              ...eventBlockBaseStyle,
              top: hourDecimal * HOUR_HEIGHT,
              height: eventHeight,
              backgroundColor: colors.bg,
              borderLeftColor: colors.border,
            }}
          >
            <div style={eventTitleStyle}>{hearing.clientName}</div>
            <div style={eventTimeStyle}>{formatHearingTime(hearing.timeStr, eventTimeFormatter)}</div>
          </button>
        );
      })}

      {calendarEvents.map((event) => {
        const hourDecimal = parseClockTime(event.startTime);
        const duration = parseClockTime(event.endTime) - hourDecimal;
        const eventHeight = Math.min(
          duration * HOUR_HEIGHT,
          (HOURS.length - hourDecimal) * HOUR_HEIGHT
        );
        const color = getCalendarEventColor(event.colorId);

        return (
          <button
            type="button"
            key={event.id}
            aria-label={`${event.title}, ${formatClockTime(event.startTime, eventTimeFormatter)} a ${formatClockTime(event.endTime, eventTimeFormatter)}`}
            onClick={() => onSelectEvent(event)}
            style={{
              ...eventBlockBaseStyle,
              top: hourDecimal * HOUR_HEIGHT,
              height: eventHeight,
              backgroundColor: color.background,
              borderLeftColor: color.border,
            }}
          >
            <div style={eventTitleStyle}>{event.title}</div>
            <div style={eventTimeStyle}>
              {formatClockTime(event.startTime, eventTimeFormatter)} – {formatClockTime(event.endTime, eventTimeFormatter)}
            </div>
          </button>
        );
      })}
    </div>
  );
};
