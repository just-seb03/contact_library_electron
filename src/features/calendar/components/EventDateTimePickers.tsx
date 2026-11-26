import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Icon } from 'framework7-react';

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const MINUTE_STEPS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

const triggerButtonStyle: CSSProperties = {
  width: '100%',
  minHeight: 40,
  padding: '8px 12px',
  borderRadius: 10,
  border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.22))',
  backgroundColor: 'var(--macos-subtle-bg, rgba(128, 128, 136, 0.08))',
  color: 'var(--macos-text, #ececef)',
  fontSize: 13.5,
  fontFamily: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  cursor: 'pointer',
  boxSizing: 'border-box',
  transition: 'border-color 0.14s ease, background-color 0.14s ease',
};

const PICKER_CLOSE_MS = 150;

const panelStyle: CSSProperties = {
  marginTop: 8,
  padding: 12,
  borderRadius: 12,
  border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.2))',
  backgroundColor: 'var(--macos-input-bg, rgba(128, 128, 136, 0.08))',
  transformOrigin: 'top center',
};

function useAnimatedToggle() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback(() => {
    if (!isVisible || isClosing) return;
    setIsClosing(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      timerRef.current = null;
    }, PICKER_CLOSE_MS);
  }, [isVisible, isClosing]);

  const toggle = useCallback(() => {
    if (isVisible && !isClosing) {
      close();
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setIsClosing(false);
      setIsVisible(true);
    }
  }, [isVisible, isClosing, close]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { isVisible, isClosing, toggle, close };
}

function toDateValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function fromDateValue(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

interface EventDatePickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

export function EventDatePicker({ id, value, onChange }: EventDatePickerProps) {
  const { isVisible, isClosing, toggle, close } = useAnimatedToggle();
  const selected = useMemo(() => (value ? fromDateValue(value) : new Date()), [value]);
  const [viewYear, setViewYear] = useState(selected.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected.getMonth());

  useEffect(() => {
    setViewYear(selected.getFullYear());
    setViewMonth(selected.getMonth());
  }, [selected]);

  const today = new Date();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const mondayOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const cells = useMemo(() => {
    const result: { day: number; isCurrentMonth: boolean }[] = [];
    for (let i = mondayOffset - 1; i >= 0; i--) {
      result.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      result.push({ day: d, isCurrentMonth: true });
    }
    const rem = 7 - (result.length % 7);
    if (rem < 7) {
      for (let i = 1; i <= rem; i++) {
        result.push({ day: i, isCurrentMonth: false });
      }
    }
    return result;
  }, [daysInMonth, mondayOffset, prevMonthDays]);

  const formattedDate = new Intl.DateTimeFormat('es-CL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(selected);

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  return (
    <div>
      <style>{`
        @keyframes pickerRevealAnim {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pickerHideAnim {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(-6px) scale(0.97); }
        }
        .picker-panel-in { animation: pickerRevealAnim 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .picker-panel-out { animation: pickerHideAnim 0.15s cubic-bezier(0.4, 0, 1, 1) forwards; pointer-events: none; }
      `}</style>
      <button
        id={id}
        type="button"
        aria-expanded={isVisible && !isClosing}
        onClick={toggle}
        style={triggerButtonStyle}
      >
        <span style={{ textTransform: 'capitalize' }}>{formattedDate}</span>
        <Icon
          f7="calendar"
          size="15px"
          style={{ color: 'var(--macos-text-secondary, #8e8e93)', flexShrink: 0 }}
        />
      </button>

      {isVisible && (
        <div style={panelStyle} className={isClosing ? 'picker-panel-out' : 'picker-panel-in'}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--macos-text, #ececef)' }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  onChange(toDateValue(now));
                  close();
                }}
                style={{
                  height: 24,
                  padding: '0 8px',
                  borderRadius: 6,
                  border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.2))',
                  backgroundColor: 'transparent',
                  color: 'var(--macos-text-secondary, #8e8e93)',
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                Hoy
              </button>
              <button
                type="button"
                aria-label="Mes anterior"
                onClick={() => shiftMonth(-1)}
                style={navMiniButtonStyle}
              >
                <Icon f7="chevron_left" size="11px" />
              </button>
              <button
                type="button"
                aria-label="Mes siguiente"
                onClick={() => shiftMonth(1)}
                style={navMiniButtonStyle}
              >
                <Icon f7="chevron_right" size="11px" />
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 4 }}>
            {WEEKDAYS.map((wd, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--macos-text-muted, #8e8e93)',
                  padding: '2px 0',
                }}
              >
                {wd}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
            {cells.map((cell, idx) => {
              const cellDate = new Date(
                viewYear,
                viewMonth + (cell.isCurrentMonth ? 0 : idx < mondayOffset ? -1 : 1),
                cell.day
              );
              const isSelected = cellDate.toDateString() === selected.toDateString();
              const isToday = cellDate.toDateString() === today.toDateString();

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(toDateValue(cellDate));
                    close();
                  }}
                  style={{
                    height: 28,
                    borderRadius: 7,
                    border: isSelected
                      ? '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.35))'
                      : isToday
                        ? '1px solid var(--macos-text-secondary, rgba(128, 128, 136, 0.45))'
                        : '1px solid transparent',
                    backgroundColor: isSelected
                      ? 'var(--macos-active-bg, #323237)'
                      : isToday
                        ? 'var(--macos-hover-bg, rgba(128, 128, 136, 0.14))'
                        : 'transparent',
                    color: 'var(--macos-text, #ececef)',
                    opacity: cell.isCurrentMonth || isSelected || isToday ? 1 : 0.35,
                    fontSize: 12,
                    fontWeight: isSelected || isToday ? 700 : 500,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface EventTimePickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

export function EventTimePicker({ id, value, onChange }: EventTimePickerProps) {
  const { isVisible, isClosing, toggle, close } = useAnimatedToggle();
  const [hoursStr, minutesStr] = value.split(':');
  const currentHour = Number(hoursStr) || 0;
  const currentMinute = Number(minutesStr) || 0;

  const locale = document.documentElement.lang || undefined;
  const formattedTime = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(2000, 0, 1, currentHour, currentMinute));

  const updateTime = (nextHour: number, nextMinute: number) => {
    const h = ((nextHour % 24) + 24) % 24;
    const m = ((nextMinute % 60) + 60) % 60;
    onChange(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        id={id}
        type="button"
        aria-expanded={isVisible && !isClosing}
        onClick={toggle}
        style={triggerButtonStyle}
      >
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formattedTime}</span>
        <Icon
          f7="clock"
          size="15px"
          style={{ color: 'var(--macos-text-secondary, #8e8e93)', flexShrink: 0 }}
        />
      </button>

      {isVisible && (
        <div style={panelStyle} className={isClosing ? 'picker-panel-out' : 'picker-panel-in'}>
          {/* Horas */}
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--macos-text-muted, #8e8e93)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Hora
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4, marginBottom: 10 }}>
            {Array.from({ length: 24 }, (_, hour) => {
              const active = hour === currentHour;
              return (
                <button
                  key={hour}
                  type="button"
                  onClick={() => updateTime(hour, currentMinute)}
                  style={{
                    height: 26,
                    borderRadius: 6,
                    border: active
                      ? '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.35))'
                      : '1px solid transparent',
                    backgroundColor: active ? 'var(--macos-active-bg, #323237)' : 'transparent',
                    color: 'var(--macos-text, #ececef)',
                    fontSize: 11.5,
                    fontWeight: active ? 700 : 500,
                    fontVariantNumeric: 'tabular-nums',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {String(hour).padStart(2, '0')}
                </button>
              );
            })}
          </div>

          {/* Minutos */}
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--macos-text-muted, #8e8e93)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Minutos
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
            {MINUTE_STEPS.map((minute) => {
              const active = minute === currentMinute;
              return (
                <button
                  key={minute}
                  type="button"
                  onClick={() => {
                    updateTime(currentHour, minute);
                    close();
                  }}
                  style={{
                    height: 26,
                    borderRadius: 6,
                    border: active
                      ? '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.35))'
                      : '1px solid transparent',
                    backgroundColor: active ? 'var(--macos-active-bg, #323237)' : 'transparent',
                    color: 'var(--macos-text, #ececef)',
                    fontSize: 11.5,
                    fontWeight: active ? 700 : 500,
                    fontVariantNumeric: 'tabular-nums',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  :{String(minute).padStart(2, '0')}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const navMiniButtonStyle: CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: 6,
  border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.2))',
  backgroundColor: 'transparent',
  color: 'var(--macos-text, #ececef)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: 0,
};
