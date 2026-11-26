import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, FC } from 'react';
import type { HearingEvent } from '../../../core/context/types';
import type { CalendarEvent } from '../types';
import { getCalendarEventColor } from '../data/eventColors';
import { computeDayOverlapLayout } from '../utils/timelineLayout';

interface AgendaWeekViewProps {
  selectedDate: Date;
  calendarEvents: CalendarEvent[];
  hearings: HearingEvent[];
  onSelectEvent: (event: CalendarEvent | HearingEvent) => void;
  onCreateAtSlot?: (date: Date, startTime: string, endTime: string) => void;
}

const HOUR_HEIGHT = 72;
const HALF_HOUR_HEIGHT = HOUR_HEIGHT / 2;
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
  onCreateAtSlot,
}) => {
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
      const now = new Date();
      containerRef.current.scrollTop = Math.max(
        0,
        (now.getHours() + now.getMinutes() / 60) * HOUR_HEIGHT - 120
      );
    }
  }, [weekStartTime]);

  const currentHour = currentTime.getHours();
  const currentDecimalHour = currentHour + currentTime.getMinutes() / 60;
  const todayKey = toDateKey(currentTime);

  const dayLayouts = useMemo(() => {
    return days.map((day, dayIndex) => {
      const dayKey = dateKeys[dayIndex];
      const dayHearings = hearings.filter(
        (h) =>
          h.year === day.getFullYear() &&
          h.monthIndex === day.getMonth() &&
          h.day === day.getDate()
      );
      const dayEvents = calendarEvents.filter((e) => e.date === dayKey);
      return computeDayOverlapLayout(dayHearings, dayEvents, 0.75);
    });
  }, [days, dateKeys, hearings, calendarEvents]);
  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'short' })
    .format(selectedDate)
    .replace('.', '')
    .toUpperCase();

  const borderColor = 'var(--macos-divider, rgba(128, 128, 136, 0.14))';

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
    zIndex: 12,
    height: HEADER_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'var(--macos-modal-bg, #242428)',
    borderBottom: `1px solid ${borderColor}`,
    borderRight: `1px solid ${borderColor}`,
  };

  const hourCellStyle: CSSProperties = {
    height: HOUR_HEIGHT,
    boxSizing: 'border-box',
    padding: '2px 8px 0 0',
    textAlign: 'right',
    fontSize: 11,
    color: 'var(--macos-text-secondary, #8e8e93)',
    fontVariantNumeric: 'tabular-nums',
    borderRight: `1px solid ${borderColor}`,
    backgroundColor: 'var(--macos-subtle-bg, rgba(0, 0, 0, 0.01))',
  };

  const dayCellStyle: CSSProperties = {
    position: 'relative',
    height: HOUR_HEIGHT,
    boxSizing: 'border-box',
    borderTop: `1px solid ${borderColor}`,
    borderRight: `1px solid ${borderColor}`,
    transition: 'background-color 0.12s ease',
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      <style>{`
        .week-hour-slot:hover {
          background-color: var(--macos-hover-bg, rgba(128, 128, 136, 0.08));
        }
      `}</style>
      <div style={gridStyle}>
        {/* Celda de esquina superior izquierda con mes */}
        <div
          style={{
            ...headerCellStyle,
            left: 0,
            zIndex: 14,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: 'var(--macos-text-secondary, #8e8e93)',
          }}
        >
          {monthLabel}
        </div>

        {/* Encabezados de días de la semana (LUN 23) */}
        {days.map((day, index) => {
          const isSelected = toDateKey(day) === toDateKey(selectedDate);
          const isToday = toDateKey(day) === todayKey;

          return (
            <div key={dateKeys[index]} style={headerCellStyle}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 8,
                  backgroundColor: isSelected
                    ? 'var(--macos-active-bg, #323237)'
                    : isToday
                      ? 'var(--macos-hover-bg, rgba(128, 128, 136, 0.14))'
                      : 'transparent',
                  border: isSelected
                    ? '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.35))'
                    : isToday
                      ? '1px solid var(--macos-text-secondary, rgba(128, 128, 136, 0.4))'
                      : '1px solid transparent',
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'var(--macos-text-secondary, #8e8e93)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {formatWeekday(index)}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: isToday || isSelected ? 700 : 500,
                    color: 'var(--macos-text, #1c1c1e)',
                  }}
                >
                  {dayFormatter.format(day)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Grilla horaria con filas (cada 30 min) y columnas */}
        {HOURS.map((hour) => (
          <div key={`hour-${hour}`} style={{ display: 'contents' }}>
            <div style={hourCellStyle}>{formatHour(hour)}</div>

            {days.map((day, dayIndex) => {
              const currentDayKey = dateKeys[dayIndex];
              const isTodayColumn = currentDayKey === todayKey;
              const hh = String(hour).padStart(2, '0');
              const nextHh = String(hour + 1).padStart(2, '0');
              const halfSlots = [
                { start: `${hh}:00`, end: `${hh}:30`, isHalf: false },
                { start: `${hh}:30`, end: hour === 23 ? '23:59' : `${nextHh}:00`, isHalf: true },
              ];

              return (
                <div
                  key={`${hour}-${currentDayKey}`}
                  style={{
                    ...dayCellStyle,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {halfSlots.map((slot) => (
                    <div
                      key={slot.start}
                      role={onCreateAtSlot ? 'button' : undefined}
                      tabIndex={onCreateAtSlot ? 0 : undefined}
                      aria-label={onCreateAtSlot ? `Crear evento ${slot.start}` : undefined}
                      className={onCreateAtSlot ? 'week-hour-slot' : undefined}
                      onClick={(e) => {
                        if (e.target === e.currentTarget && onCreateAtSlot) {
                          onCreateAtSlot(day, slot.start, slot.end);
                        }
                      }}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && onCreateAtSlot) {
                          e.preventDefault();
                          onCreateAtSlot(day, slot.start, slot.end);
                        }
                      }}
                      style={{
                        flex: 1,
                        height: HALF_HOUR_HEIGHT,
                        boxSizing: 'border-box',
                        borderTop: slot.isHalf
                          ? '1px dashed var(--macos-divider, rgba(128, 128, 136, 0.11))'
                          : 'none',
                        cursor: onCreateAtSlot ? 'pointer' : 'default',
                        transition: 'background-color 0.12s ease',
                      }}
                    />
                  ))}

                  {/* Contorno tenue en el bloque horario actual de Hoy (detrás de eventos) */}
                  {isTodayColumn && hour === currentHour && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: '2px 4px',
                        borderRadius: 8,
                        border: '1px solid var(--macos-text-secondary, rgba(120, 120, 128, 0.35))',
                        backgroundColor: 'var(--macos-subtle-bg, rgba(120, 120, 128, 0.045))',
                        zIndex: 1,
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  {/* Renderizado de eventos y línea "estás aquí" en la primera fila horaria */}
                  {hour === 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: HOURS.length * HOUR_HEIGHT,
                        pointerEvents: 'none',
                        zIndex: 2,
                      }}
                    >
                      {dayLayouts[dayIndex].map(({ item, startHour, endHour, col, totalCols }) => {
                        const leftPct = (col / totalCols) * 100;
                        const widthPct = 100 / totalCols;
                        const isRightmostCol = col === totalCols - 1;
                        const overlapsHereBadge =
                          isTodayColumn &&
                          isRightmostCol &&
                          Math.abs(startHour - currentDecimalHour) < 0.45;

                        if (item.kind === 'hearing') {
                          const { hearing } = item;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              title={`${hearing.clientName} - ${hearing.materia} (${hearing.timeStr})`}
                              aria-label={hearing.clientName}
                              onClick={() => onSelectEvent(hearing)}
                              style={{
                                position: 'absolute',
                                top: startHour * HOUR_HEIGHT,
                                left: `calc(${leftPct}% + 2px)`,
                                width: `calc(${widthPct}% - 4px)`,
                                height: 44,
                                zIndex: 3,
                                overflow: 'hidden',
                                textAlign: 'left',
                                pointerEvents: 'auto',
                                border: 'none',
                                borderLeft: '3.5px solid #ff3b30',
                                borderRadius: 6,
                                backgroundColor: 'var(--macos-danger-surface, rgba(255, 59, 48, 0.12))',
                                color: 'var(--macos-text, #1c1c1e)',
                                padding: overlapsHereBadge ? '4px 62px 4px 6px' : '4px 6px',
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
                        }

                        const { event } = item;
                        const duration = Math.max(endHour - startHour, 0.5);
                        const color = getCalendarEventColor(event.colorId);

                        return (
                          <button
                            key={item.id}
                            type="button"
                            title={`${event.title} (${event.startTime} - ${event.endTime})`}
                            aria-label={event.title}
                            onClick={() => onSelectEvent(event)}
                            style={{
                              position: 'absolute',
                              top: startHour * HOUR_HEIGHT,
                              left: `calc(${leftPct}% + 2px)`,
                              width: `calc(${widthPct}% - 4px)`,
                              height: Math.max(duration * HOUR_HEIGHT - 3, 34),
                              zIndex: 2,
                              overflow: 'hidden',
                              textAlign: 'left',
                              pointerEvents: 'auto',
                              border: 'none',
                              borderLeft: `3.5px solid ${color.accent}`,
                              borderRadius: 6,
                              backgroundColor: color.background.replace('0.12', '0.16'),
                              color: 'var(--macos-text, #1c1c1e)',
                              padding: overlapsHereBadge ? '4px 62px 4px 6px' : '4px 6px',
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
                                color: 'var(--macos-text-muted, #636366)',
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

                      {isTodayColumn && (
                        <div
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            left: 2,
                            right: 4,
                            top: currentDecimalHour * HOUR_HEIGHT,
                            zIndex: 4,
                            pointerEvents: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            transform: 'translateY(-50%)',
                          }}
                        >
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: 'var(--macos-text-secondary, #8e8e93)',
                              flexShrink: 0,
                            }}
                          />
                          <div
                            style={{
                              flex: 1,
                              height: 1.5,
                              backgroundColor: 'var(--macos-text-secondary, rgba(142, 142, 147, 0.55))',
                            }}
                          />
                          <span
                            style={{
                              fontFamily: 'Georgia, "Times New Roman", serif',
                              fontStyle: 'italic',
                              fontSize: 10,
                              color: 'var(--macos-text, #ececef)',
                              backgroundColor: 'var(--macos-modal-bg, #242428)',
                              border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.3))',
                              borderRadius: 999,
                              padding: '0 6px',
                              marginLeft: 4,
                              opacity: 0.92,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            estás aquí
                          </span>
                        </div>
                      )}
                    </div>
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
