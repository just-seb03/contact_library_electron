import type { FC, CSSProperties } from 'react';
import { useApp } from '../../../core/context/AppContext';

interface CalendarViewSwitcherProps {
  isWeekView: boolean;
  onToggleWeekView: (isWeek: boolean) => void;
}

export const CalendarViewSwitcher: FC<CalendarViewSwitcherProps> = ({
  isWeekView,
  onToggleWeekView,
}) => {
  const { darkMode } = useApp();

  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: 3,
    borderRadius: 8,
    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
    boxShadow: darkMode
      ? 'inset 0 1px 2px rgba(0, 0, 0, 0.3)'
      : 'inset 0 1px 2px rgba(0, 0, 0, 0.06)',
    userSelect: 'none',
  };

  const buttonStyle = (active: boolean): CSSProperties => ({
    padding: '4px 14px',
    borderRadius: 6,
    border: 'none',
    outline: 'none',
    fontSize: 12.5,
    fontWeight: active ? 600 : 500,
    cursor: 'pointer',
    backgroundColor: active
      ? darkMode
        ? '#3a3a3c'
        : '#ffffff'
      : 'transparent',
    color: active
      ? darkMode
        ? '#ffffff'
        : '#1c1c1e'
      : darkMode
      ? '#a1a1aa'
      : '#636366',
    boxShadow: active
      ? darkMode
        ? '0 1px 3px rgba(0, 0, 0, 0.4)'
        : '0 1px 3px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.08)'
      : 'none',
    transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
  });

  return (
    <div style={containerStyle} role="tablist" aria-label="Cambiar vista de calendario">
      <button
        type="button"
        role="tab"
        aria-selected={!isWeekView}
        onClick={() => onToggleWeekView(false)}
        style={buttonStyle(!isWeekView)}
      >
        Día
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={isWeekView}
        onClick={() => onToggleWeekView(true)}
        style={buttonStyle(isWeekView)}
      >
        Semana
      </button>
    </div>
  );
};

export default CalendarViewSwitcher;
