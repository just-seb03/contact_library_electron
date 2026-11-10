import type { FC, CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
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
  const { darkMode } = useApp();

  const headerStyle: CSSProperties = {
    padding: '14px 20px',
    borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.07)',
    backgroundColor: darkMode ? 'rgba(34, 34, 38, 0.6)' : 'rgba(255, 255, 255, 0.8)',
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
    borderRadius: 10,
    backgroundColor: darkMode ? '#2c2c2e' : '#ffffff',
    border: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
    flexShrink: 0,
    overflow: 'hidden',
  };

  const badgeMonthStyle: CSSProperties = {
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#ff3b30',
    lineHeight: 1,
    letterSpacing: 0.6,
    marginBottom: 2,
  };

  const badgeDayStyle: CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    color: darkMode ? '#ffffff' : '#1c1c1e',
    lineHeight: 1.1,
  };

  const macNavButtonStyle: CSSProperties = {
    width: 28,
    height: 28,
    borderRadius: 6,
    border: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.9)',
    color: darkMode ? '#ffffff' : '#1c1c1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.12s ease',
  };

  const todayButtonStyle: CSSProperties = {
    height: 28,
    padding: '0 10px',
    borderRadius: 6,
    border: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.9)',
    color: darkMode ? '#ffffff' : '#1c1c1e',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.12s ease',
  };

  const addButtonStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 32,
    padding: '0 14px',
    borderRadius: 8,
    border: 'none',
    backgroundColor: 'var(--macos-accent-color, #007aff)',
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 2px 6px var(--macos-accent-tint-active, rgba(0, 122, 255, 0.35))',
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
              color: darkMode ? '#ffffff' : '#1c1c1e',
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
