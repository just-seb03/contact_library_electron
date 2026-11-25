import type { FC, CSSProperties } from 'react';

interface CalendarViewSwitcherProps {
  isWeekView: boolean;
  onToggleWeekView: (isWeek: boolean) => void;
}

export const CalendarViewSwitcher: FC<CalendarViewSwitcherProps> = ({
  isWeekView,
  onToggleWeekView,
}) => {
  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: 3,
    borderRadius: 999,
    backgroundColor: 'var(--macos-subtle-bg, rgba(128, 128, 136, 0.1))',
    border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.18))',
    userSelect: 'none',
  };

  const buttonStyle = (active: boolean): CSSProperties => ({
    padding: '4px 14px',
    borderRadius: 999,
    border: 'none',
    outline: 'none',
    fontSize: 12.5,
    fontWeight: active ? 600 : 500,
    cursor: 'pointer',
    backgroundColor: active
      ? 'var(--macos-text, #1c1c1e)'
      : 'transparent',
    color: active
      ? 'var(--macos-canvas-bg, #ffffff)'
      : 'var(--macos-text-muted, #888890)',
    boxShadow: active
      ? '0 1px 4px rgba(0, 0, 0, 0.2)'
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
