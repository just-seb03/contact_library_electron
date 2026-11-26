import { useState, useEffect, useRef, useMemo, type FC, type CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import type { HearingEvent } from '../../../core/context/types';
import type { CalendarEvent } from '../types';
import { getCalendarEventColor } from '../data/eventColors';
import { computeDayOverlapLayout } from '../utils/timelineLayout';

interface AgendaTimelineProps {
  todayHearings: HearingEvent[];
  calendarEvents: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent | HearingEvent) => void;
  onCreateAtSlot?: (date: Date, startTime: string, endTime: string) => void;
  selectedDate?: Date;
}

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const HOUR_HEIGHT = 72;
const HALF_HOUR_HEIGHT = HOUR_HEIGHT / 2;
const HOUR_COLUMN_WIDTH = 74;
const EVENT_LEFT = HOUR_COLUMN_WIDTH + 14;
const TIMELINE_TOP_PADDING = 4;

function formatMinutesOfDay(minutes: number, formatter: Intl.DateTimeFormat): string {
  const time = new Date(2000, 0, 1);
  time.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return formatter.format(time);
}

function formatHour(hour: number, formatter: Intl.DateTimeFormat): string {
  return formatMinutesOfDay(hour * 60, formatter);
}

function formatClockTime(time: string, formatter: Intl.DateTimeFormat): string {
  const [hours, minutes] = time.split(':').map(Number);
  return formatMinutesOfDay(hours * 60 + minutes, formatter);
}

export const AgendaTimeline: FC<AgendaTimelineProps> = ({
  todayHearings,
  calendarEvents,
  onSelectEvent,
  onCreateAtSlot,
  selectedDate = new Date(),
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Al iniciar el calendario, desplazar automáticamente a la hora actual
  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      const scrollParent = rootRef.current?.closest('.card-content') ?? rootRef.current?.parentElement;
      if (!scrollParent) return;
      const now = new Date();
      const targetTop = Math.max(0, (now.getHours() + now.getMinutes() / 60) * HOUR_HEIGHT - 120);
      scrollParent.scrollTop = targetTop;
    });
    return () => window.cancelAnimationFrame(rafId);
  }, []);

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

  const currentHour = currentTime.getHours();
  const currentDecimalHour = currentHour + currentTime.getMinutes() / 60;
  const currentHourTop = TIMELINE_TOP_PADDING + currentHour * HOUR_HEIGHT;
  const currentLineTop = TIMELINE_TOP_PADDING + currentDecimalHour * HOUR_HEIGHT;

  const positionedItems = useMemo(
    () => computeDayOverlapLayout(todayHearings, calendarEvents, 1),
    [todayHearings, calendarEvents]
  );

  const containerStyle: CSSProperties = {
    position: 'relative',
    height: HOURS.length * HOUR_HEIGHT + TIMELINE_TOP_PADDING,
    paddingTop: TIMELINE_TOP_PADDING,
    boxSizing: 'border-box',
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
    color: 'var(--macos-text-secondary, #8e8e93)',
    textAlign: 'center',
    transform: 'translateY(-7px)',
    fontVariantNumeric: 'tabular-nums',
  };

  const hourCellStyle: CSSProperties = {
    flex: 1,
    height: '100%',
    position: 'relative',
    borderTop: '1px solid var(--macos-divider, rgba(0, 0, 0, 0.06))',
  };

  return (
    <div ref={rootRef} style={containerStyle}>
      {/* Fondo tenue de la columna horaria */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: HOUR_COLUMN_WIDTH,
          backgroundColor: 'var(--macos-subtle-bg, rgba(0, 0, 0, 0.015))',
          borderRight: '1px solid var(--macos-divider, rgba(0, 0, 0, 0.06))',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Filas horarias (divididas cada 30 minutos) */}
      {HOURS.map((hour) => {
        const hh = String(hour).padStart(2, '0');
        const nextHh = String(hour + 1).padStart(2, '0');
        const firstHalfStart = `${hh}:00`;
        const firstHalfEnd = `${hh}:30`;
        const secondHalfStart = `${hh}:30`;
        const secondHalfEnd = hour === 23 ? '23:59' : `${nextHh}:00`;

        return (
          <div key={hour} style={hourRowStyle}>
            <div
              style={{
                ...hourLabelStyle,
                transform: 'translateY(-7px)',
              }}
            >
              {hour === 0 ? '' : formatHour(hour, hourFormatter)}
            </div>
            <div
              style={{
                ...hourCellStyle,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {[
                { start: firstHalfStart, end: firstHalfEnd, isHalf: false },
                { start: secondHalfStart, end: secondHalfEnd, isHalf: true },
              ].map((slot) => (
                <button
                  key={slot.start}
                  type="button"
                  aria-label={`Crear evento a las ${formatClockTime(slot.start, hourFormatter)}`}
                  onClick={() => onCreateAtSlot?.(selectedDate, slot.start, slot.end)}
                  style={{
                    flex: 1,
                    height: HALF_HOUR_HEIGHT,
                    width: '100%',
                    padding: 0,
                    border: 'none',
                    borderTop: slot.isHalf
                      ? '1px dashed var(--macos-divider, rgba(128, 128, 136, 0.11))'
                      : 'none',
                    backgroundColor: 'transparent',
                    cursor: onCreateAtSlot ? 'pointer' : 'default',
                    transition: 'background-color 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (onCreateAtSlot) {
                      e.currentTarget.style.backgroundColor = 'var(--macos-hover-bg, rgba(128, 128, 136, 0.08))';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* ── Contorno tenue en el bloque horario actual (detrás de las tarjetas) ── */}
      {isToday && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: HOUR_COLUMN_WIDTH + 6,
            right: 10,
            top: currentHourTop + 2,
            height: HOUR_HEIGHT - 4,
            borderRadius: 10,
            border: '1px solid var(--macos-text-secondary, rgba(120, 120, 128, 0.35))',
            backgroundColor: 'var(--macos-subtle-bg, rgba(120, 120, 128, 0.045))',
            boxSizing: 'border-box',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── Capa de eventos y audiencias (sin solapamiento) ── */}
      <div
        style={{
          position: 'absolute',
          left: EVENT_LEFT,
          right: 16,
          top: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        {positionedItems.map(({ item, startHour, endHour, col, totalCols }) => {
          const leftPct = (col / totalCols) * 100;
          const widthPct = 100 / totalCols;
          const isRightmostCol = col === totalCols - 1;
          const overlapsHereBadge =
            isToday &&
            isRightmostCol &&
            Math.abs(startHour - currentDecimalHour) < 0.45;

          if (item.kind === 'hearing') {
            const { hearing } = item;
            const eventHeight = Math.max(HOUR_HEIGHT * 1.1, 60);

            return (
              <button
                type="button"
                key={item.id}
                aria-label={`Audiencia: ${hearing.clientName}, ${hearing.timeStr}`}
                onClick={() => onSelectEvent(hearing)}
                style={{
                  position: 'absolute',
                  left: `calc(${leftPct}% + 2px)`,
                  width: `calc(${widthPct}% - 4px)`,
                  top: TIMELINE_TOP_PADDING + startHour * HOUR_HEIGHT,
                  height: eventHeight,
                  borderRadius: 8,
                  padding: overlapsHereBadge ? '8px 94px 8px 12px' : '8px 12px',
                  zIndex: 3,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  border: 'none',
                  borderLeft: '4px solid #ff3b30',
                  backgroundColor: 'var(--macos-danger-surface, rgba(255, 59, 48, 0.12))',
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
                      color: 'var(--macos-text, #1c1c1e)',
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
                    color: 'var(--macos-text-muted, #555558)',
                    marginTop: 4,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <Icon f7="clock_fill" size="12px" style={{ color: '#ff3b30' }} />
                    <span style={{ fontWeight: 600 }}>{hearing.timeStr}</span>
                  </div>
                  {hearing.materia && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Icon f7="briefcase_fill" size="12px" style={{ opacity: 0.7, flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{hearing.materia}</span>
                    </div>
                  )}
                  {hearing.juzgado && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Icon f7="building_columns_fill" size="12px" style={{ opacity: 0.7, flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{hearing.juzgado}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          }

          const { event } = item;
          const duration = Math.max(endHour - startHour, 0.5);
          const eventHeight = Math.max(duration * HOUR_HEIGHT - 2, 34);
          const color = getCalendarEventColor(event.colorId);

          return (
            <button
              type="button"
              key={item.id}
              aria-label={`${event.title}, ${formatClockTime(event.startTime, eventTimeFormatter)} a ${formatClockTime(event.endTime, eventTimeFormatter)}`}
              onClick={() => onSelectEvent(event)}
              style={{
                position: 'absolute',
                left: `calc(${leftPct}% + 2px)`,
                width: `calc(${widthPct}% - 4px)`,
                top: TIMELINE_TOP_PADDING + startHour * HOUR_HEIGHT,
                height: eventHeight,
                borderRadius: 8,
                padding: overlapsHereBadge ? '5px 94px 5px 12px' : '5px 12px',
                zIndex: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                pointerEvents: 'auto',
                border: 'none',
                borderLeft: `4px solid ${color.accent}`,
                backgroundColor: color.background.replace('0.12', '0.16'),
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
                  color: 'var(--macos-text, #1c1c1e)',
                  lineHeight: 1.25,
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
                  color: 'var(--macos-text-muted, #636366)',
                  marginTop: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                <Icon f7="clock" size="11px" style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {formatClockTime(event.startTime, eventTimeFormatter)} – {formatClockTime(event.endTime, eventTimeFormatter)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Línea de hora actual + píldora "estás aquí" que convive con los eventos ── */}
      {isToday && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: HOUR_COLUMN_WIDTH + 6,
            right: 10,
            top: currentLineTop,
            zIndex: 4,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            transform: 'translateY(-50%)',
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
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
              fontSize: 11.5,
              color: 'var(--macos-text, #ececef)',
              backgroundColor: 'var(--macos-modal-bg, #242428)',
              border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.3))',
              borderRadius: 999,
              padding: '1px 8px',
              marginLeft: 6,
              opacity: 0.92,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.16)',
            }}
          >
            estás aquí
          </span>
        </div>
      )}
    </div>
  );
};

export default AgendaTimeline;
