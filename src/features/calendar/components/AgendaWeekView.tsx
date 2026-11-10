import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, FC } from 'react';
import { useApp } from '../../../core/context/AppContext';
import type { HearingEvent } from '../../../core/context/types';
import type { CalendarEvent } from '../types';
import { getCalendarEventColor } from '../data/eventColors';

interface AgendaWeekViewProps {
  selectedDate: Date;
  calendarEvents: CalendarEvent[];
  hearings: HearingEvent[];
  onSelectEvent: (event: CalendarEvent | HearingEvent) => void;
}

const HOUR_HEIGHT = 68;
const HOUR_LABEL_WIDTH = 60;
const HEADER_HEIGHT = 48;
const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const WEEKDAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

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

export const AgendaWeekView: FC<AgendaWeekViewProps> = ({
  selectedDate,
  calendarEvents,
  hearings,
  onSelectEvent,
}) => {
  const { darkMode } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Actualizador en tiempo real de la hora actual
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

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
    if (containerRef.current) {
      containerRef.current.scrollTop = 8 * HOUR_HEIGHT;
    }
  }, [weekStartTime]);

  const currentHourDecimal = currentTime.getHours() + currentTime.getMinutes() / 60;
  const todayKey = toDateKey(currentTime);

  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.07)';

  const containerStyle: CSSProperties = {
    minWidth: 0,
    overflow: 'auto',
    height: '100%',
    overscrollBehavior: 'contain',
    userSelect: 'none',
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `${HOUR_LABEL_WIDTH}px repeat(7, minmax(110px, 1fr))`,
    minWidth: HOUR_LABEL_WIDTH + 7 * 110,
    position: 'relative',
  };

  const headerCellStyle: CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 6,
    height: HEADER_HEIGHT,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    backgroundColor: darkMode ? '#202023' : '#ffffff',
    borderBottom: `1px solid ${borderColor}`,
    borderRight: `1px solid ${borderColor}`,
    backdropFilter: 'blur(20px)',
  };

  const hourCellStyle: CSSProperties = {
    height: HOUR_HEIGHT,
    boxSizing: 'border-box',
    padding: '2px 8px 0 0',
    textAlign: 'right',
    fontSize: 11,
    color: darkMode ? '#8e8e93' : '#8e8e93',
    fontVariantNumeric: 'tabular-nums',
    borderRight: `1px solid ${borderColor}`,
    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.01)',
  };

  const dayCellStyle: CSSProperties = {
    position: 'relative',
    height: HOUR_HEIGHT,
    boxSizing: 'border-box',
    borderTop: `1px solid ${borderColor}`,
    borderRight: `1px solid ${borderColor}`,
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      <div style={gridStyle}>
        {/* Celda de esquina superior izquierda fija */}
        <div style={{ ...headerCellStyle, left: 0, zIndex: 7, position: 'sticky' }} />

        {/* Encabezados de días de la semana (LUN, MAR... + número con insignia Apple) */}
        {days.map((day, index) => {
          const isSelected = toDateKey(day) === toDateKey(selectedDate);
          const isToday = toDateKey(day) === todayKey;

          return (
            <div key={dateKeys[index]} style={headerCellStyle}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: isToday
                    ? 'var(--macos-accent-color, #007aff)'
                    : darkMode
                    ? '#8e8e93'
                    : '#8e8e93',
                  letterSpacing: '0.04em',
                }}
              >
                {formatWeekday(index)}
              </span>

              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: isToday || isSelected ? 700 : 500,
                  color: isToday
                    ? '#ffffff'
                    : isSelected
                    ? darkMode
                      ? '#ffffff'
                      : '#1c1c1e'
                    : darkMode
                    ? '#e5e5ea'
                    : '#1c1c1e',
                  backgroundColor: isToday
                    ? 'var(--macos-accent-color, #007aff)'
                    : isSelected
                    ? darkMode
                      ? 'rgba(255, 255, 255, 0.15)'
                      : 'rgba(0, 0, 0, 0.08)'
                    : 'transparent',
                  boxShadow: isToday ? '0 2px 6px var(--macos-accent-tint-active, rgba(0, 122, 255, 0.35))' : 'none',
                }}
              >
                {dayFormatter.format(day)}
              </span>
            </div>
          );
        })}

        {/* Grilla horaria con filas y columnas */}
        {HOURS.map((hour) => (
          <div key={`hour-${hour}`} style={{ display: 'contents' }}>
            <div style={hourCellStyle}>{formatHour(hour)}</div>

            {days.map((day, dayIndex) => {
              const currentDayKey = dateKeys[dayIndex];
              const isTodayColumn = currentDayKey === todayKey;

              return (
                <div key={`${hour}-${currentDayKey}`} style={dayCellStyle}>
                  {/* Línea roja de hora actual en la columna de Hoy */}
                  {isTodayColumn && hour === Math.floor(currentHourDecimal) && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: (currentHourDecimal - hour) * HOUR_HEIGHT,
                        height: 2,
                        backgroundColor: '#ff3b30',
                        zIndex: 4,
                        pointerEvents: 'none',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: -4,
                          top: -3,
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#ff3b30',
                          boxShadow: '0 0 4px rgba(255, 59, 48, 0.6)',
                        }}
                      />
                    </div>
                  )}

                  {/* Renderizado de eventos en la primera fila horaria (con top absoluto) */}
                  {hour === 0 && (
                    <>
                      {/* Audiencias */}
                      {hearings
                        .filter(
                          (hearing) =>
                            hearing.year === day.getFullYear() &&
                            hearing.monthIndex === day.getMonth() &&
                            hearing.day === day.getDate()
                        )
                        .map((hearing) => {
                          const start = parseHearingTime(hearing.timeStr);
                          return (
                            <button
                              key={hearing.id}
                              type="button"
                              title={`${hearing.clientName} - ${hearing.materia} (${hearing.timeStr})`}
                              aria-label={hearing.clientName}
                              onClick={() => onSelectEvent(hearing)}
                              style={{
                                position: 'absolute',
                                top: start * HOUR_HEIGHT,
                                left: 3,
                                right: 3,
                                height: 42,
                                zIndex: 3,
                                overflow: 'hidden',
                                textAlign: 'left',
                                border: 'none',
                                borderLeft: '3.5px solid #ff3b30',
                                borderRadius: 6,
                                backgroundColor: darkMode
                                  ? 'rgba(255, 59, 48, 0.22)'
                                  : 'rgba(255, 59, 48, 0.12)',
                                color: darkMode ? '#ffffff' : '#1c1c1e',
                                padding: '4px 6px',
                                fontFamily: 'inherit',
                                fontSize: 11,
                                cursor: 'pointer',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                transition: 'transform 0.1s ease',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                            >
                              <div
                                style={{
                                  fontWeight: 650,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  fontSize: 11.5,
                                }}
                              >
                                {hearing.clientName}
                              </div>
                              <div
                                style={{
                                  fontSize: 10,
                                  color: '#ff3b30',
                                  fontWeight: 600,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {hearing.timeStr} • {hearing.materia}
                              </div>
                            </button>
                          );
                        })}

                      {/* Eventos regulares */}
                      {calendarEvents
                        .filter((event) => event.date === currentDayKey)
                        .map((event) => {
                          const start = parseTime(event.startTime);
                          const duration = Math.max(parseTime(event.endTime) - start, 0.5);
                          const color = getCalendarEventColor(event.colorId);

                          return (
                            <button
                              key={event.id}
                              type="button"
                              title={`${event.title} (${event.startTime} - ${event.endTime})`}
                              aria-label={event.title}
                              onClick={() => onSelectEvent(event)}
                              style={{
                                position: 'absolute',
                                top: start * HOUR_HEIGHT,
                                left: 3,
                                right: 3,
                                height: Math.max(duration * HOUR_HEIGHT - 3, 34),
                                zIndex: 2,
                                overflow: 'hidden',
                                textAlign: 'left',
                                border: 'none',
                                borderLeft: `3.5px solid ${color.accent}`,
                                borderRadius: 6,
                                backgroundColor: darkMode
                                  ? color.background.replace('0.12', '0.22')
                                  : color.background,
                                color: darkMode ? '#ffffff' : '#1c1c1e',
                                padding: '4px 6px',
                                fontFamily: 'inherit',
                                fontSize: 11,
                                cursor: 'pointer',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                transition: 'transform 0.1s ease',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                            >
                              <div
                                style={{
                                  fontWeight: 650,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  fontSize: 11.5,
                                }}
                              >
                                {event.title}
                              </div>
                              <div
                                style={{
                                  fontSize: 10,
                                  color: darkMode ? '#c7c7cc' : color.textColor,
                                  fontWeight: 500,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {event.startTime} – {event.endTime}
                              </div>
                            </button>
                          );
                        })}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgendaWeekView;
