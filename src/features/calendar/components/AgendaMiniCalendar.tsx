import { useState, useMemo, useEffect } from 'react';
import type { FC, CSSProperties } from 'react';
import { Icon } from 'framework7-react';

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

interface AgendaMiniCalendarProps {
  selectedDate: Date;
  eventDates: ReadonlySet<string>;
  onSelectDate: (date: Date) => void;
}

function getMondayOffset(year: number, month: number): number {
  const firstDay = new Date(year, month, 1).getDay();
  return firstDay === 0 ? 6 : firstDay - 1;
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const AgendaMiniCalendar: FC<AgendaMiniCalendarProps> = ({
  selectedDate,
  eventDates,
  onSelectDate,
}) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());

  useEffect(() => {
    setViewYear(selectedDate.getFullYear());
    setViewMonth(selectedDate.getMonth());
  }, [selectedDate]);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const mondayOffset = getMondayOffset(viewYear, viewMonth);
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const cells = useMemo(() => {
    const result: { day: number; isCurrentMonth: boolean }[] = [];
    for (let i = mondayOffset - 1; i >= 0; i--) {
      result.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      result.push({ day: d, isCurrentMonth: true });
    }
    const remaining = 7 - (result.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        result.push({ day: i, isCurrentMonth: false });
      }
    }
    return result;
  }, [daysInMonth, mondayOffset, prevMonthDays]);

  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const isToday = (day: number, isCurrent: boolean) =>
    isCurrent &&
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const containerStyle: CSSProperties = {
    padding: '16px 14px',
    userSelect: 'none',
  };

  const navRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  };

  const monthTitleStyle: CSSProperties = {
    fontSize: 14,
    fontWeight: 650,
    color: 'var(--macos-text, #1c1c1e)',
    letterSpacing: '-0.01em',
  };

  const navButtonStyle: CSSProperties = {
    width: 26,
    height: 26,
    borderRadius: 8,
    border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.2))',
    backgroundColor: 'var(--macos-subtle-bg, rgba(128, 128, 136, 0.08))',
    color: 'var(--macos-text, #1c1c1e)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.12s ease',
  };

  const weekdayRowStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 0,
    marginBottom: 4,
  };

  const weekdayLabelStyle: CSSProperties = {
    fontSize: 10.5,
    fontWeight: 600,
    color: 'var(--macos-text-muted, rgba(60, 60, 67, 0.55))',
    textAlign: 'center',
    padding: '4px 0',
  };

  const daysGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 4,
  };

  const dayCellStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    width: '100%',
    padding: 0,
    border: 0,
    background: 'transparent',
    cursor: 'pointer',
    outline: 'none',
  };

  const dayNumberBaseStyle: CSSProperties = {
    width: '100%',
    height: 30,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    fontSize: 12.5,
    fontWeight: 500,
    transition: 'all 0.14s ease',
  };

  return (
    <div style={containerStyle}>
      {/* ── Navegación de Mes/Año ── */}
      <div style={navRowStyle}>
        <span style={monthTitleStyle}>
          {monthNames[viewMonth]} {viewYear}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button type="button" style={navButtonStyle} onClick={goPrev} aria-label="Mes anterior">
            <Icon f7="chevron_left" size="11px" />
          </button>
          <button type="button" style={navButtonStyle} onClick={goNext} aria-label="Mes siguiente">
            <Icon f7="chevron_right" size="11px" />
          </button>
        </div>
      </div>

      {/* ── Fila de días de la semana (L M M J V S D) ── */}
      <div style={weekdayRowStyle}>
        {WEEKDAYS.map((wd, i) => (
          <div key={`weekday-${i}`} style={weekdayLabelStyle}>
            {wd}
          </div>
        ))}
      </div>

      {/* ── Grilla de días del mes con puntos de eventos Apple ── */}
      <div
        key={`${viewYear}-${viewMonth}`}
        className="cal-switch-anim"
        style={daysGridStyle}
      >
        {cells.map((cell, idx) => {
          const todayMatch = isToday(cell.day, cell.isCurrentMonth);
          const cellDate = new Date(
            viewYear,
            viewMonth + (cell.isCurrentMonth ? 0 : idx < mondayOffset ? -1 : 1),
            cell.day
          );
          const selectedMatch = cellDate.toDateString() === selectedDate.toDateString();
          const hasEvents = eventDates.has(toDateKey(cellDate));

          return (
            <button
              key={idx}
              type="button"
              style={dayCellStyle}
              aria-label={`${cellDate.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}${hasEvents ? ', tiene eventos' : ''}`}
              aria-pressed={selectedMatch}
              onClick={() => {
                onSelectDate(cellDate);
                if (!cell.isCurrentMonth) {
                  setViewYear(cellDate.getFullYear());
                  setViewMonth(cellDate.getMonth());
                }
              }}
            >
              <div
                style={{
                  ...dayNumberBaseStyle,
                  backgroundColor: selectedMatch
                    ? 'var(--macos-active-bg, #323237)'
                    : todayMatch
                    ? 'var(--macos-hover-bg, rgba(128, 128, 136, 0.14))'
                    : 'transparent',
                  border: selectedMatch
                    ? '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.35))'
                    : todayMatch
                    ? '1px solid var(--macos-text-secondary, rgba(128, 128, 136, 0.45))'
                    : '1px solid transparent',
                  color: cell.isCurrentMonth || selectedMatch || todayMatch
                    ? 'var(--macos-text, #1c1c1e)'
                    : 'var(--macos-text-muted, #8e8e93)',
                  opacity: cell.isCurrentMonth || selectedMatch || todayMatch ? 1 : 0.35,
                  fontWeight: todayMatch || selectedMatch ? 700 : cell.isCurrentMonth ? 500 : 400,
                }}
              >
                <span style={{ lineHeight: 1 }}>{cell.day}</span>
                {hasEvents && (
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: '#ff3b30',
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AgendaMiniCalendar;
