import { useState, useMemo, useEffect } from 'react';
import type { FC, CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';

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
  const { darkMode } = useApp();
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
    color: darkMode ? '#ffffff' : '#1c1c1e',
    letterSpacing: '-0.01em',
  };

  const navButtonStyle: CSSProperties = {
    width: 26,
    height: 26,
    borderRadius: 6,
    border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.9)',
    color: darkMode ? '#ffffff' : '#1c1c1e',
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
    color: darkMode ? 'rgba(235, 235, 245, 0.45)' : 'rgba(60, 60, 67, 0.55)',
    textAlign: 'center',
    padding: '4px 0',
  };

  const daysGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '2px 0',
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
    width: 24,
    height: 24,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 500,
    transition: 'all 0.12s ease',
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
      <div style={daysGridStyle}>
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div
                  style={{
                    ...dayNumberBaseStyle,
                    backgroundColor: todayMatch
                      ? '#007aff'
                      : selectedMatch
                      ? darkMode
                        ? '#ffffff'
                        : '#1c1c1e'
                      : 'transparent',
                    color: todayMatch
                      ? '#ffffff'
                      : selectedMatch
                      ? darkMode
                        ? '#1c1c1e'
                        : '#ffffff'
                      : cell.isCurrentMonth
                      ? darkMode
                        ? '#f2f2f7'
                        : '#1c1c1e'
                      : darkMode
                      ? 'rgba(255, 255, 255, 0.25)'
                      : 'rgba(0, 0, 0, 0.25)',
                    fontWeight: todayMatch || selectedMatch ? 700 : cell.isCurrentMonth ? 500 : 400,
                    boxShadow: todayMatch ? '0 2px 5px rgba(0, 122, 255, 0.4)' : 'none',
                  }}
                >
                  {cell.day}
                </div>

                {/* Punto indicador de eventos estilo iOS / macOS Calendar */}
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: hasEvents
                      ? todayMatch
                        ? '#007aff'
                        : darkMode
                        ? '#0a84ff'
                        : '#007aff'
                      : 'transparent',
                  }}
                  aria-hidden="true"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AgendaMiniCalendar;
