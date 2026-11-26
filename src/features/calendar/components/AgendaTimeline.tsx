import { useState, useEffect, useRef, useMemo, type FC, type CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import type { HearingEvent } from '../../../core/context/types';
import type { CalendarEvent } from '../types';
import { getCalendarEventColor } from '../data/eventColors';
import { groupDayOverlaps } from '../utils/timelineLayout';

interface AgendaTimelineProps {
  todayHearings: HearingEvent[];
  calendarEvents: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent | HearingEvent) => void;
  onCreateAtSlot?: (date: Date, startTime: string, endTime: string) => void;
  selectedDate?: Date;
}

const HALF_HOURS = Array.from({ length: 48 }, (_, index) => index);
const HALF_HOUR_HEIGHT = 44;
const HOUR_HEIGHT = HALF_HOUR_HEIGHT * 2;
const HOUR_COLUMN_WIDTH = 74;
const EVENT_LEFT = HOUR_COLUMN_WIDTH + 14;
const TIMELINE_TOP_PADDING = 6;

function formatMinutesOfDay(minutes: number, formatter: Intl.DateTimeFormat): string {
  const time = new Date(2000, 0, 1);
  time.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return formatter.format(time);
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
  const hasMountedRef = useRef(false);
  const [currentTime, setCurrentTime] = useState(() => new Date());

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

  const currentDecimalHour = currentTime.getHours() + currentTime.getMinutes() / 60;
  const currentLineTop = TIMELINE_TOP_PADDING + currentDecimalHour * HOUR_HEIGHT;

  const clusters = useMemo(
    () => groupDayOverlaps(todayHearings, calendarEvents, 0.75),
    [todayHearings, calendarEvents]
  );

  const selectedDayKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;

  // Al iniciar o al cambiar de día, desplazar al evento más cercano (o a la hora actual/08:00)
  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      const scrollParent = rootRef.current?.closest('.card-content') ?? rootRef.current?.parentElement;
      if (!scrollParent) return;

      let targetHour: number;
      if (clusters.length > 0) {
        const now = new Date();
        const nowDecimal = now.getHours() + now.getMinutes() / 60;
        const nearest = isToday
          ? clusters.find((c) => c.endHour >= nowDecimal) ?? clusters[0]
          : clusters[0];
        targetHour = nearest.startHour;
      } else if (isToday) {
        const now = new Date();
        targetHour = now.getHours() + now.getMinutes() / 60;
      } else {
        targetHour = 8;
      }

      const targetTop = Math.max(0, targetHour * HOUR_HEIGHT - 90);
      if (hasMountedRef.current && typeof scrollParent.scrollTo === 'function') {
        scrollParent.scrollTo({ top: targetTop, behavior: 'smooth' });
      } else {
        scrollParent.scrollTop = targetTop;
      }
      hasMountedRef.current = true;
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [selectedDayKey, clusters, isToday]);

  const containerStyle: CSSProperties = {
    position: 'relative',
    height: HALF_HOURS.length * HALF_HOUR_HEIGHT + TIMELINE_TOP_PADDING,
    paddingTop: TIMELINE_TOP_PADDING,
    boxSizing: 'border-box',
    userSelect: 'none',
  };

  return (
    <div ref={rootRef} style={containerStyle}>
      <style>{`
        .day-half-slot:hover {
          background-color: var(--macos-hover-bg, rgba(128, 128, 136, 0.08)) !important;
        }
        .day-cluster-item:hover {
          background-color: var(--macos-hover-bg, rgba(255, 255, 255, 0.08)) !important;
        }
      `}</style>

      {/* Fondo tenue de la columna horaria */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: HOUR_COLUMN_WIDTH,
          backgroundColor: 'var(--macos-subtle-bg, rgba(0, 0, 0, 0.015))',
          borderRight: '1px solid var(--macos-divider, rgba(128, 128, 136, 0.14))',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Filas cada 30 minutos (00:00, 00:30, 01:00, 01:30...) */}
      {HALF_HOURS.map((slotIndex) => {
        const hour = Math.floor(slotIndex / 2);
        const isHalf = slotIndex % 2 === 1;
        const startMins = slotIndex * 30;
        const endMins = slotIndex === 47 ? 23 * 60 + 59 : (slotIndex + 1) * 30;
        const slotStart = `${String(hour).padStart(2, '0')}:${isHalf ? '30' : '00'}`;
        const slotEnd = `${String(Math.floor(endMins / 60)).padStart(2, '0')}:${String(endMins % 60).padStart(2, '0')}`;

        return (
          <div
            key={slotIndex}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              height: HALF_HOUR_HEIGHT,
            }}
          >
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                width: HOUR_COLUMN_WIDTH,
                boxSizing: 'border-box',
                flexShrink: 0,
                fontSize: isHalf ? 10 : 11,
                fontWeight: isHalf ? 400 : 550,
                color: 'var(--macos-text-secondary, #8e8e93)',
                opacity: isHalf ? 0.65 : 1,
                textAlign: 'center',
                transform: 'translateY(-7px)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {slotIndex === 0 ? '' : formatMinutesOfDay(startMins, hourFormatter)}
            </div>

            <button
              type="button"
              className={onCreateAtSlot ? 'day-half-slot' : undefined}
              aria-label={`Crear evento a las ${formatMinutesOfDay(startMins, hourFormatter)}`}
              onClick={() => onCreateAtSlot?.(selectedDate, slotStart, slotEnd)}
              style={{
                flex: 1,
                height: '100%',
                position: 'relative',
                padding: 0,
                border: 'none',
                borderTop: isHalf
                  ? '1px dashed var(--macos-divider, rgba(128, 128, 136, 0.11))'
                  : '1px solid var(--macos-divider, rgba(128, 128, 136, 0.16))',
                backgroundColor: 'transparent',
                cursor: onCreateAtSlot ? 'pointer' : 'default',
                transition: 'background-color 0.12s ease',
              }}
            />
          </div>
        );
      })}

      {/* ── Capa de eventos y audiencias (estética glass grafito, agrupados si coinciden) ── */}
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
        {clusters.map((cluster) => {
          const overlapsLine =
            isToday && Math.abs(cluster.startHour - currentDecimalHour) < 0.35;
          const duration = Math.max(cluster.endHour - cluster.startHour, 0.5);
          const minHeight =
            cluster.items.length > 1
              ? Math.max(duration * HOUR_HEIGHT - 2, cluster.items.length * 32 + 16)
              : Math.max(duration * HOUR_HEIGHT - 2, 42);

          if (cluster.items.length === 1) {
            const entry = cluster.items[0];
            if (entry.kind === 'hearing') {
              const { hearing } = entry;
              return (
                <button
                  type="button"
                  key={cluster.id}
                  aria-label={`Audiencia: ${hearing.clientName}, ${hearing.timeStr}`}
                  onClick={() => onSelectEvent(hearing)}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: TIMELINE_TOP_PADDING + cluster.startHour * HOUR_HEIGHT,
                    height: Math.max(minHeight, 58),
                    borderRadius: 10,
                    padding: overlapsLine ? '8px 94px 8px 12px' : '8px 12px',
                    zIndex: 3,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.1))',
                    backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.055))',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    backdropFilter: 'blur(20px) saturate(150%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    transition: 'transform 0.12s ease, border-color 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          backgroundColor: '#ff453a',
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--macos-text, #ececef)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {hearing.clientName}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: 999,
                        border: '1px solid rgba(255, 69, 58, 0.35)',
                        backgroundColor: 'rgba(255, 69, 58, 0.12)',
                        color: '#ff6961',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
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
                      color: 'var(--macos-text-secondary, #a4a4ab)',
                      marginTop: 4,
                      paddingLeft: 15,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span style={{ fontWeight: 550, flexShrink: 0 }}>{hearing.timeStr}</span>
                    {hearing.materia && (
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {hearing.materia}
                      </span>
                    )}
                    {hearing.juzgado && (
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', opacity: 0.85 }}>
                        • {hearing.juzgado}
                      </span>
                    )}
                  </div>
                </button>
              );
            }

            const { event } = entry;
            const color = getCalendarEventColor(event.colorId);

            return (
              <button
                type="button"
                key={cluster.id}
                aria-label={`${event.title}, ${formatClockTime(event.startTime, eventTimeFormatter)} a ${formatClockTime(event.endTime, eventTimeFormatter)}`}
                onClick={() => onSelectEvent(event)}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: TIMELINE_TOP_PADDING + cluster.startHour * HOUR_HEIGHT,
                  height: minHeight,
                  borderRadius: 10,
                  padding: overlapsLine ? '6px 94px 6px 12px' : '6px 12px',
                  zIndex: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.1))',
                  backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.055))',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  backdropFilter: 'blur(20px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                  transition: 'transform 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      backgroundColor: color.accent,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--macos-text, #ececef)',
                      lineHeight: 1.25,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {event.title}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: 'var(--macos-text-secondary, #a4a4ab)',
                    marginTop: 3,
                    paddingLeft: 15,
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
          }

          // Cuadro conjunto cuando coinciden dos o más eventos/audiencias
          return (
            <div
              key={cluster.id}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: TIMELINE_TOP_PADDING + cluster.startHour * HOUR_HEIGHT,
                minHeight,
                borderRadius: 10,
                padding: overlapsLine ? '6px 94px 6px 8px' : '6px 8px',
                zIndex: 3,
                pointerEvents: 'auto',
                border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.11))',
                backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.055))',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
                backdropFilter: 'blur(20px) saturate(150%)',
                WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                boxSizing: 'border-box',
              }}
            >
              {cluster.items.map((entry) => {
                const isHearing = entry.kind === 'hearing';
                const title = isHearing ? entry.hearing.clientName : entry.event.title;
                const dotColor = isHearing
                  ? '#ff453a'
                  : getCalendarEventColor(entry.event.colorId).accent;
                const timeLabel = isHearing
                  ? entry.hearing.timeStr
                  : `${formatClockTime(entry.event.startTime, eventTimeFormatter)} – ${formatClockTime(entry.event.endTime, eventTimeFormatter)}`;

                return (
                  <button
                    key={entry.id}
                    type="button"
                    className="day-cluster-item"
                    onClick={() => onSelectEvent(isHearing ? entry.hearing : entry.event)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                      width: '100%',
                      padding: '4px 8px',
                      borderRadius: 6,
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      transition: 'background-color 0.12s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: dotColor,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: 'var(--macos-text, #ececef)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {title}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: 'var(--macos-text-secondary, #a4a4ab)',
                        flexShrink: 0,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {timeLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ── Línea única de hora actual + píldora "estás aquí" (sin doble borde) ── */}
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
