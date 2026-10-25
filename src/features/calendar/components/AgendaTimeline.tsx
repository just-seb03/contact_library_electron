import { useState, useEffect, type FC, type CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
import type { HearingEvent } from '../../../core/context/types';
import type { CalendarEvent } from '../types';
import { getCalendarEventColor } from '../data/eventColors';

interface AgendaTimelineProps {
  todayHearings: HearingEvent[];
  calendarEvents: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent | HearingEvent) => void;
  selectedDate?: Date;
}

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const HOUR_HEIGHT = 68;
const HOUR_COLUMN_WIDTH = 74;
const EVENT_LEFT = HOUR_COLUMN_WIDTH + 14;

function formatMinutesOfDay(minutes: number, formatter: Intl.DateTimeFormat): string {
  const time = new Date(2000, 0, 1);
  time.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return formatter.format(time);
}

function formatHour(hour: number, formatter: Intl.DateTimeFormat): string {
  return formatMinutesOfDay(hour * 60, formatter);
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

function parseClockTime(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours + minutes / 60;
}

function formatClockTime(time: string, formatter: Intl.DateTimeFormat): string {
  const [hours, minutes] = time.split(':').map(Number);
  return formatMinutesOfDay(hours * 60 + minutes, formatter);
}

export const AgendaTimeline: FC<AgendaTimelineProps> = ({
  todayHearings,
  calendarEvents,
  onSelectEvent,
  selectedDate = new Date(),
}) => {
  const { darkMode } = useApp();
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Actualizador en tiempo real de la hora actual de Apple
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const locale = document.documentElement.lang || undefined;
  const hourFormatter = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const eventTimeFormatter = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  });

  const isToday =
    selectedDate.getDate() === currentTime.getDate() &&
    selectedDate.getMonth() === currentTime.getMonth() &&
    selectedDate.getFullYear() === currentTime.getFullYear();

  const currentHourDecimal = currentTime.getHours() + currentTime.getMinutes() / 60;
  const nowLineTop = currentHourDecimal * HOUR_HEIGHT;

  const containerStyle: CSSProperties = {
    position: 'relative',
    minHeight: HOURS.length * HOUR_HEIGHT,
    paddingTop: 8,
    userSelect: 'none',
  };

  const hourRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    height: HOUR_HEIGHT,
  };

  const hourLabelStyle: CSSProperties = {
    position: 'relative',
    zIndex: 2,
    width: HOUR_COLUMN_WIDTH,
    boxSizing: 'border-box',
    flexShrink: 0,
    fontSize: 11,
    fontWeight: 500,
    color: darkMode ? '#8e8e93' : '#8e8e93',
    textAlign: 'center',
    transform: 'translateY(-7px)',
    fontVariantNumeric: 'tabular-nums',
  };

  const hourCellStyle: CSSProperties = {
    flex: 1,
    height: '100%',
    position: 'relative',
    borderTop: darkMode ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
  };

  return (
    <div style={containerStyle}>
      {/* Fondo tenue de la columna horaria */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: HOUR_COLUMN_WIDTH,
          backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)',
          borderRight: darkMode ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Filas horarias */}
      {HOURS.map((hour) => (
        <div key={hour} style={hourRowStyle}>
          <div style={hourLabelStyle}>{formatHour(hour, hourFormatter)}</div>
          <div style={hourCellStyle} />
        </div>
      ))}

      {/* ── Indicador de Hora Actual estilo Apple Calendar (Apple Red) ── */}
      {isToday && (
        <div
          style={{
            position: 'absolute',
            left: HOUR_COLUMN_WIDTH - 5,
            right: 12,
            top: nowLineTop,
            zIndex: 10,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Círculo indicador */}
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#ff3b30',
              boxShadow: '0 0 6px rgba(255, 59, 48, 0.5)',
              flexShrink: 0,
            }}
          />
          {/* Línea horizontal continua */}
          <div
            style={{
              flex: 1,
              height: 2,
              backgroundColor: '#ff3b30',
              borderRadius: 1,
            }}
          />
        </div>
      )}

      {/* ── Chips de Audiencias (Judiciales) ── */}
      {todayHearings.map((hearing) => {
        const hourDecimal = parseTimeToHour(hearing.timeStr);
        const eventHeight = Math.max(HOUR_HEIGHT * 1.15, 60);

        return (
          <button
            type="button"
            key={hearing.id}
            aria-label={`Audiencia: ${hearing.clientName}, ${hearing.timeStr}`}
            onClick={() => onSelectEvent(hearing)}
            style={{
              position: 'absolute',
              left: EVENT_LEFT,
              right: 16,
              top: hourDecimal * HOUR_HEIGHT,
              height: eventHeight,
              borderRadius: 8,
              padding: '8px 12px',
              zIndex: 3,
              overflow: 'hidden',
              cursor: 'pointer',
              border: 'none',
              borderLeft: '4px solid #ff3b30',
              backgroundColor: darkMode ? 'rgba(255, 59, 48, 0.18)' : 'rgba(255, 59, 48, 0.1)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              textAlign: 'left',
              fontFamily: 'inherit',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'transform 0.12s ease, box-shadow 0.12s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 59, 48, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 650,
                  color: darkMode ? '#ffffff' : '#1c1c1e',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {hearing.clientName}
              </div>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 59, 48, 0.2)',
                  color: '#ff3b30',
                  textTransform: 'uppercase',
                  flexShrink: 0,
                }}
              >
                Audiencia
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 11.5,
                color: darkMode ? '#d1d1d6' : '#555558',
                marginTop: 4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Icon f7="clock_fill" size="12px" style={{ color: '#ff3b30' }} />
                <span style={{ fontWeight: 600 }}>{hearing.timeStr}</span>
              </div>
              {hearing.materia && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon f7="briefcase_fill" size="12px" style={{ opacity: 0.7 }} />
                  <span>{hearing.materia}</span>
                </div>
              )}
              {hearing.juzgado && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon f7="building_columns_fill" size="12px" style={{ opacity: 0.7 }} />
                  <span>{hearing.juzgado}</span>
                </div>
              )}
            </div>
          </button>
        );
      })}

      {/* ── Chips de Eventos Regulares (Apple Translucent Cards) ── */}
      {calendarEvents.map((event) => {
        const hourDecimal = parseClockTime(event.startTime);
        const duration = Math.max(parseClockTime(event.endTime) - hourDecimal, 0.5);
        const eventHeight = Math.max(duration * HOUR_HEIGHT, 48);
        const color = getCalendarEventColor(event.colorId);

        return (
          <button
            type="button"
            key={event.id}
            aria-label={`${event.title}, ${formatClockTime(event.startTime, eventTimeFormatter)} a ${formatClockTime(event.endTime, eventTimeFormatter)}`}
            onClick={() => onSelectEvent(event)}
            style={{
              position: 'absolute',
              left: EVENT_LEFT,
              right: 16,
              top: hourDecimal * HOUR_HEIGHT,
              height: eventHeight,
              borderRadius: 8,
              padding: '6px 12px',
              zIndex: 2,
              overflow: 'hidden',
              cursor: 'pointer',
              border: 'none',
              borderLeft: `4px solid ${color.accent}`,
              backgroundColor: darkMode
                ? color.background.replace('0.12', '0.22')
                : color.background,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
              textAlign: 'left',
              fontFamily: 'inherit',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'transform 0.12s ease, box-shadow 0.12s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${color.border}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.04)';
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 650,
                color: darkMode ? '#ffffff' : '#1c1c1e',
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {event.title}
            </div>

            <div
              style={{
                fontSize: 11.5,
                fontWeight: 500,
                color: darkMode ? '#c7c7cc' : color.textColor,
                marginTop: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Icon f7="clock" size="11px" />
              <span>
                {formatClockTime(event.startTime, eventTimeFormatter)} – {formatClockTime(event.endTime, eventTimeFormatter)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default AgendaTimeline;
