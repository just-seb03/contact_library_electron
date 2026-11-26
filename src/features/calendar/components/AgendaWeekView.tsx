import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, FC } from 'react';
import type { HearingEvent } from '../../../core/context/types';
import type { CalendarEvent } from '../types';
import { getCalendarEventColor } from '../data/eventColors';
import { groupDayOverlaps } from '../utils/timelineLayout';

interface AgendaWeekViewProps {
  selectedDate: Date;
  calendarEvents: CalendarEvent[];
  hearings: HearingEvent[];
  onSelectEvent: (event: CalendarEvent | HearingEvent) => void;
  onCreateAtSlot?: (date: Date, startTime: string, endTime: string) => void;
}

const HALF_HOURS = Array.from({ length: 48 }, (_, index) => index);
const HALF_HOUR_HEIGHT = 44;
const HOUR_HEIGHT = HALF_HOUR_HEIGHT * 2;
const HOUR_LABEL_WIDTH = 64;
const HEADER_HEIGHT = 48;
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

function formatHalfHourLabel(slotIndex: number): string {
  const hour = Math.floor(slotIndex / 2);
  const minute = slotIndex % 2 === 1 ? 30 : 0;
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(2000, 0, 1, hour, minute));
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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const weekStart = getWeekStart(selectedDate);
  const weekStartTime = weekStart.getTime();
  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + index);
        return day;
      }),
    [weekStart]
  );
  const dateKeys = useMemo(() => days.map(toDateKey), [days]);
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

  const currentDecimalHour = currentTime.getHours() + currentTime.getMinutes() / 60;
  const todayKey = toDateKey(currentTime);
  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'short' })
    .format(selectedDate)
    .replace('.', '')
    .toUpperCase();

  const dayClusters = useMemo(() => {
    return days.map((day, dayIndex) => {
      const dayKey = dateKeys[dayIndex];
      const dayHearings = hearings.filter(
        (h) =>
          h.year === day.getFullYear() &&
          h.monthIndex === day.getMonth() &&
          h.day === day.getDate()
      );
      const dayEvents = calendarEvents.filter((e) => e.date === dayKey);
      return groupDayOverlaps(dayHearings, dayEvents, 0.75);
    });
  }, [days, dateKeys, hearings, calendarEvents]);

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

  return (
    <div ref={containerRef} style={containerStyle}>
      <style>{`
        .week-hour-slot:hover {
          background-color: var(--macos-hover-bg, rgba(128, 128, 136, 0.08));
        }
        .week-cluster-item:hover {
          background-color: var(--macos-hover-bg, rgba(255, 255, 255, 0.08)) !important;
        }
      `}</style>
      <div style={gridStyle}>
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

        {/* Grilla cada 30 minutos (00:00, 00:30, 01:00, 01:30...) */}
        {HALF_HOURS.map((slotIndex) => {
          const hour = Math.floor(slotIndex / 2);
          const isHalf = slotIndex % 2 === 1;
          const endMins = slotIndex === 47 ? 23 * 60 + 59 : (slotIndex + 1) * 30;
          const slotStart = `${String(hour).padStart(2, '0')}:${isHalf ? '30' : '00'}`;
          const slotEnd = `${String(Math.floor(endMins / 60)).padStart(2, '0')}:${String(endMins % 60).padStart(2, '0')}`;

          return (
            <div key={`slot-${slotIndex}`} style={{ display: 'contents' }}>
              <div
                style={{
                  height: HALF_HOUR_HEIGHT,
                  boxSizing: 'border-box',
                  padding: '2px 8px 0 0',
                  textAlign: 'right',
                  fontSize: isHalf ? 10 : 11,
                  fontWeight: isHalf ? 400 : 550,
                  color: 'var(--macos-text-secondary, #8e8e93)',
                  opacity: isHalf ? 0.65 : 1,
                  fontVariantNumeric: 'tabular-nums',
                  borderRight: `1px solid ${borderColor}`,
                  backgroundColor: 'var(--macos-subtle-bg, rgba(0, 0, 0, 0.01))',
                }}
              >
                {formatHalfHourLabel(slotIndex)}
              </div>

              {days.map((day, dayIndex) => {
                const currentDayKey = dateKeys[dayIndex];
                const isTodayColumn = currentDayKey === todayKey;

                return (
                  <div
                    key={`${slotIndex}-${currentDayKey}`}
                    className={onCreateAtSlot ? 'week-hour-slot' : undefined}
                    onClick={(e) => {
                      if (e.target === e.currentTarget && onCreateAtSlot) {
                        onCreateAtSlot(day, slotStart, slotEnd);
                      }
                    }}
                    style={{
                      position: 'relative',
                      height: HALF_HOUR_HEIGHT,
                      boxSizing: 'border-box',
                      borderTop: isHalf
                        ? '1px dashed var(--macos-divider, rgba(128, 128, 136, 0.11))'
                        : `1px solid ${borderColor}`,
                      borderRight: `1px solid ${borderColor}`,
                      cursor: onCreateAtSlot ? 'pointer' : 'default',
                      transition: 'background-color 0.12s ease',
                    }}
                  >
                    {/* Capa de eventos agrupados y línea única "estás aquí" */}
                    {slotIndex === 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: HALF_HOURS.length * HALF_HOUR_HEIGHT,
                          pointerEvents: 'none',
                          zIndex: 2,
                        }}
                      >
                        {dayClusters[dayIndex].map((cluster) => {
                          const overlapsLine =
                            isTodayColumn && Math.abs(cluster.startHour - currentDecimalHour) < 0.35;
                          const duration = Math.max(cluster.endHour - cluster.startHour, 0.5);
                          const height =
                            cluster.items.length > 1
                              ? Math.max(duration * HOUR_HEIGHT - 3, cluster.items.length * 22 + 10)
                              : Math.max(duration * HOUR_HEIGHT - 3, 36);

                          if (cluster.items.length === 1) {
                            const entry = cluster.items[0];
                            if (entry.kind === 'hearing') {
                              const { hearing } = entry;
                              return (
                                <button
                                  key={cluster.id}
                                  type="button"
                                  title={`${hearing.clientName} - ${hearing.materia} (${hearing.timeStr})`}
                                  aria-label={hearing.clientName}
                                  onClick={() => onSelectEvent(hearing)}
                                  style={{
                                    position: 'absolute',
                                    top: cluster.startHour * HOUR_HEIGHT,
                                    left: 3,
                                    right: 3,
                                    height: Math.max(height, 42),
                                    zIndex: 3,
                                    overflow: 'hidden',
                                    textAlign: 'left',
                                    pointerEvents: 'auto',
                                    border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.1))',
                                    borderRadius: 8,
                                    backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.055))',
                                    color: 'var(--macos-text, #ececef)',
                                    padding: overlapsLine ? '4px 62px 4px 7px' : '4px 7px',
                                    fontFamily: 'inherit',
                                    fontSize: 11,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.14)',
                                    backdropFilter: 'blur(16px) saturate(150%)',
                                    WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                                    transition: 'transform 0.1s ease',
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.015)')}
                                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
                                    <span
                                      style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        backgroundColor: '#ff453a',
                                        flexShrink: 0,
                                      }}
                                    />
                                    <span
                                      style={{
                                        fontWeight: 600,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        fontSize: 11.5,
                                      }}
                                    >
                                      {hearing.clientName}
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 10,
                                      color: 'var(--macos-text-secondary, #a4a4ab)',
                                      fontWeight: 500,
                                      paddingLeft: 11,
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

                            const { event } = entry;
                            const color = getCalendarEventColor(event.colorId);

                            return (
                              <button
                                key={cluster.id}
                                type="button"
                                title={`${event.title} (${event.startTime} - ${event.endTime})`}
                                aria-label={event.title}
                                onClick={() => onSelectEvent(event)}
                                style={{
                                  position: 'absolute',
                                  top: cluster.startHour * HOUR_HEIGHT,
                                  left: 3,
                                  right: 3,
                                  height,
                                  zIndex: 2,
                                  overflow: 'hidden',
                                  textAlign: 'left',
                                  pointerEvents: 'auto',
                                  border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.1))',
                                  borderRadius: 8,
                                  backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.055))',
                                  color: 'var(--macos-text, #ececef)',
                                  padding: overlapsLine ? '4px 62px 4px 7px' : '4px 7px',
                                  fontFamily: 'inherit',
                                  fontSize: 11,
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.14)',
                                  backdropFilter: 'blur(16px) saturate(150%)',
                                  WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                                  transition: 'transform 0.1s ease',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.015)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
                                  <span
                                    style={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: '50%',
                                      backgroundColor: color.accent,
                                      flexShrink: 0,
                                    }}
                                  />
                                  <span
                                    style={{
                                      fontWeight: 600,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      fontSize: 11.5,
                                    }}
                                  >
                                    {event.title}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: 'var(--macos-text-secondary, #a4a4ab)',
                                    fontWeight: 500,
                                    paddingLeft: 11,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {event.startTime} – {event.endTime}
                                </div>
                              </button>
                            );
                          }

                          // Cuadro conjunto con nombres uno debajo del otro
                          return (
                            <div
                              key={cluster.id}
                              style={{
                                position: 'absolute',
                                top: cluster.startHour * HOUR_HEIGHT,
                                left: 3,
                                right: 3,
                                minHeight: height,
                                zIndex: 3,
                                borderRadius: 8,
                                padding: overlapsLine ? '4px 62px 4px 4px' : '4px',
                                pointerEvents: 'auto',
                                border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.11))',
                                backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.055))',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.18)',
                                backdropFilter: 'blur(16px) saturate(150%)',
                                WebkitBackdropFilter: 'blur(16px) saturate(150%)',
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

                                return (
                                  <button
                                    key={entry.id}
                                    type="button"
                                    className="week-cluster-item"
                                    title={title}
                                    onClick={() => onSelectEvent(isHearing ? entry.hearing : entry.event)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 5,
                                      width: '100%',
                                      padding: '2px 4px',
                                      borderRadius: 5,
                                      border: 'none',
                                      backgroundColor: 'transparent',
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      fontFamily: 'inherit',
                                      transition: 'background-color 0.1s ease',
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: 5,
                                        height: 5,
                                        borderRadius: '50%',
                                        backgroundColor: dotColor,
                                        flexShrink: 0,
                                      }}
                                    />
                                    <span
                                      style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: 'var(--macos-text, #ececef)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      {title}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
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
          );
        })}
      </div>
    </div>
  );
};

export default AgendaWeekView;
