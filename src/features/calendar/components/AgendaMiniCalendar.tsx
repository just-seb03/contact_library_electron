import { useState, useMemo, useEffect } from 'react';
import type { FC, CSSProperties } from 'react';
import { Button, Icon } from 'framework7-react';
import { APP_COLORS } from '../../../core/theme/style';

const WEEKDAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

const containerStyle: CSSProperties = {
  padding: '16px 12px',
};

const navRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
};

const monthTitleStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: APP_COLORS.black,
};

const weekdayRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 0,
  marginBottom: 4,
};

const weekdayLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: APP_COLORS.neutral,
  textAlign: 'center',
  padding: '4px 0',
};

const daysGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 0,
};

const dayCellStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 32,
  width: '100%',
  padding: 0,
  border: 0,
  background: 'transparent',
  cursor: 'pointer',
};

const dayNumberBaseStyle: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  fontWeight: 500,
  transition: 'background-color 0.15s, color 0.15s',
};

const navButtonStyle: CSSProperties = {
  ['--f7-button-padding-horizontal' as string]: '6px',
};

interface AgendaMiniCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

function getMondayOffset(year: number, month: number): number {
  const firstDay = new Date(year, month, 1).getDay();
  return firstDay === 0 ? 6 : firstDay - 1;
}

export const AgendaMiniCalendar: FC<AgendaMiniCalendarProps> = ({
  selectedDate,
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

  return (
    <div style={containerStyle}>
      <div style={navRowStyle}>
        <Button small round style={navButtonStyle} onClick={goPrev}>
          <Icon f7="chevron_left" size="14px" />
        </Button>
        <span style={monthTitleStyle}>
          {monthNames[viewMonth]} {viewYear}
        </span>
        <Button small round style={navButtonStyle} onClick={goNext}>
          <Icon f7="chevron_right" size="14px" />
        </Button>
      </div>

      <div style={weekdayRowStyle}>
        {WEEKDAYS.map((wd) => (
          <div key={wd} style={weekdayLabelStyle}>{wd}</div>
        ))}
      </div>

      <div style={daysGridStyle}>
        {cells.map((cell, idx) => {
          const todayMatch = isToday(cell.day, cell.isCurrentMonth);
          const cellDate = new Date(
            viewYear,
            viewMonth + (cell.isCurrentMonth ? 0 : idx < mondayOffset ? -1 : 1),
            cell.day
          );
          const selectedMatch = cellDate.toDateString() === selectedDate.toDateString();
          return (
            <button
              key={idx}
              type="button"
              style={dayCellStyle}
              aria-label={cellDate.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
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
                  backgroundColor: selectedMatch ? APP_COLORS.black : 'transparent',
                  color: selectedMatch
                    ? APP_COLORS.white
                    : cell.isCurrentMonth
                      ? APP_COLORS.black
                      : 'rgba(0,0,0,0.25)',
                  fontWeight: selectedMatch || todayMatch ? 700 : cell.isCurrentMonth ? 500 : 400,
                  boxShadow: todayMatch && !selectedMatch ? `inset 0 0 0 1px ${APP_COLORS.primary}` : 'none',
                }}
              >
                {cell.day}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
