import type { FC, CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import { CalendarViewSwitcher } from './CalendarViewSwitcher';

interface AgendaHeaderProps {
  day: number;
  monthShort: string;
  fullDateLabel: string;
  isWeekView: boolean;
  onPreviousDay: () => void;
  onToggleWeekView: () => void;
  onNextDay: () => void;
  onAddEvent: () => void;
  onToday?: () => void;
}

export const AgendaHeader: FC<AgendaHeaderProps> = ({
  day,
  monthShort,
  fullDateLabel,
  isWeekView,
  onPreviousDay,
  onToggleWeekView,
  onNextDay,
  onAddEvent,
  onToday,
}) => {
  const headerStyle: CSSProperties = {
    padding: '14px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
    backgroundColor: 'rgba(255, 255, 255, 0.025)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
  };

  const badgeContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.09)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.14)',
    flexShrink: 0,
    overflow: 'hidden',
  };

  const badgeMonthStyle: CSSProperties = {
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase',
    color: 'var(--macos-text-secondary, #a4a4ab)',
    lineHeight: 1,
    letterSpacing: 0.6,
    marginBottom: 2,
  };

  const badgeDayStyle: CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    color: 'var(--macos-text, #ececef)',
    lineHeight: 1.1,
  };

  const macNavButtonStyle: CSSProperties = {
    width: 28,
    height: 28,
    borderRadius: 8,
    border: '1px solid rgba(255, 255, 255, 0.09)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--macos-text, #ececef)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.12s ease',
  };

  const todayButtonStyle: CSSProperties = {
    height: 28,
    padding: '0 10px',
    borderRadius: 8,
    border: '1px solid rgba(255, 255, 255, 0.09)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--macos-text, #ececef)',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.12s ease',
  };

  const addButtonStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 32,
    padding: '0 14px',
    borderRadius: 999,
    border: '1px solid rgba(255, 255, 255, 0.14)',
    backgroundColor: 'var(--macos-text, #ececef)',
    color: 'var(--macos-canvas-bg, #18181a)',
    fontSize: 12.5,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
    transition: 'all 0.12s ease',
  };

  return (
    <div style={headerStyle}>
      {/* ── Izquierda: Insignia de fecha + Título de fecha + Botones Hoy / Flechas ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={badgeContainerStyle}>
          <span style={badgeMonthStyle}>{monthShort}</span>
          <span style={badgeDayStyle}>{day}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 17,
              fontWeight: 650,
              color: 'var(--macos-text, #1c1c1e)',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
            }}
          >
            {fullDateLabel}
          </span>
        </div>

        {/* Grupo de navegación: Hoy, ‹, › */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
          {onToday && (
            <button
              type="button"
              onClick={onToday}
              style={todayButtonStyle}
              title="Ir al día actual"
            >
              Hoy
            </button>
          )}

          <button
            type="button"
            onClick={onPreviousDay}
            style={macNavButtonStyle}
            aria-label="Periodo anterior"
            title="Periodo anterior"
          >
            <Icon f7="chevron_left" size="12px" />
          </button>

          <button
            type="button"
            onClick={onNextDay}
            style={macNavButtonStyle}
            aria-label="Periodo siguiente"
            title="Periodo siguiente"
          >
            <Icon f7="chevron_right" size="12px" />
          </button>
        </div>
      </div>

      {/* ── Derecha: Segmented Control (Día | Semana) + Botón Añadir Evento ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <CalendarViewSwitcher
          isWeekView={isWeekView}
          onToggleWeekView={(isWeek) => {
            if (isWeek !== isWeekView) {
              onToggleWeekView();
            }
          }}
        />

        <button
          type="button"
          onClick={onAddEvent}
          style={addButtonStyle}
        >
          <Icon f7="plus" size="13px" style={{ strokeWidth: 2 }} />
          <span>Añadir evento</span>
        </button>
      </div>
    </div>
  );
};

export default AgendaHeader;
