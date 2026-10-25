import type { FC, CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
import type { CalendarEvent } from '../types';
import type { HearingEvent } from '../../../core/context/types';

interface AgendaEventDetailProps {
  event: CalendarEvent | HearingEvent | null;
  clientName?: string;
  hearingEndTime?: string;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (event: CalendarEvent) => void;
}

function formatEventDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatClockTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours < 12 ? 'AM' : 'PM';
  const displayHour = hours % 12 || 12;
  return `${String(displayHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
}

function formatHearingTime(time: string): string {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return time;
  return `${match[1].padStart(2, '0')}:${match[2]} ${match[3].toUpperCase()}`;
}

export const AgendaEventDetail: FC<AgendaEventDetailProps> = ({
  event,
  clientName,
  hearingEndTime,
  onEdit,
  onDelete,
}) => {
  const { darkMode } = useApp();

  const containerStyle: CSSProperties = {
    padding: '16px 14px',
    borderTop: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
    userSelect: 'none',
  };

  const titleStyle: CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: darkMode ? '#8e8e93' : '#8e8e93',
    marginBottom: 12,
  };

  const infoRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    fontSize: 12.5,
    color: darkMode ? '#d1d1d6' : '#48484a',
    lineHeight: 1.4,
  };

  const actionButtonStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    height: 28,
    padding: '0 10px',
    borderRadius: 6,
    border: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    color: darkMode ? '#ffffff' : '#1c1c1e',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.12s ease',
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>Detalle del evento</div>

      {event ? (
        <div
          style={{
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
            borderRadius: 10,
            padding: '12px 14px',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {/* Título e insignia de tipo */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 650,
                color: darkMode ? '#ffffff' : '#1c1c1e',
                lineHeight: 1.3,
              }}
            >
              {'title' in event ? event.title : event.clientName}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 4,
                textTransform: 'uppercase',
                backgroundColor: 'date' in event ? 'rgba(0, 122, 255, 0.15)' : 'rgba(255, 59, 48, 0.15)',
                color: 'date' in event ? '#007aff' : '#ff3b30',
                flexShrink: 0,
              }}
            >
              {'date' in event ? 'Cita' : 'Audiencia'}
            </span>
          </div>

          {/* Fechas y Horas */}
          {'date' in event ? (
            <>
              <div style={infoRowStyle}>
                <Icon f7="calendar" size="14px" style={{ color: '#007aff', flexShrink: 0, marginTop: 2 }} />
                <span>{formatEventDate(event.date)}</span>
              </div>
              <div style={infoRowStyle}>
                <Icon f7="clock" size="14px" style={{ color: '#007aff', flexShrink: 0, marginTop: 2 }} />
                <span>
                  {formatClockTime(event.startTime)} – {formatClockTime(event.endTime)}
                </span>
              </div>
            </>
          ) : (
            <>
              <div style={infoRowStyle}>
                <Icon f7="calendar" size="14px" style={{ color: '#ff3b30', flexShrink: 0, marginTop: 2 }} />
                <span>Fecha: {event.dateStr.split(' - ')[0]}</span>
              </div>
              <div style={infoRowStyle}>
                <Icon f7="clock_fill" size="14px" style={{ color: '#ff3b30', flexShrink: 0, marginTop: 2 }} />
                <span>
                  {formatHearingTime(event.timeStr)}
                  {hearingEndTime ? ` – ${formatClockTime(hearingEndTime)}` : ''}
                </span>
              </div>
              <div style={infoRowStyle}>
                <Icon f7="briefcase_fill" size="14px" style={{ opacity: 0.7, flexShrink: 0, marginTop: 2 }} />
                <span>{event.materia}</span>
              </div>
              {event.juzgado && (
                <div style={infoRowStyle}>
                  <Icon f7="building_columns_fill" size="14px" style={{ opacity: 0.7, flexShrink: 0, marginTop: 2 }} />
                  <span>{event.juzgado}</span>
                </div>
              )}
              {event.expediente && (
                <div style={infoRowStyle}>
                  <Icon f7="doc_text_fill" size="14px" style={{ opacity: 0.7, flexShrink: 0, marginTop: 2 }} />
                  <span>Expediente: {event.expediente}</span>
                </div>
              )}
            </>
          )}

          {clientName && (
            <div style={infoRowStyle}>
              <Icon f7="person_fill" size="14px" style={{ color: '#5856d6', flexShrink: 0, marginTop: 2 }} />
              <span>Cliente: {clientName}</span>
            </div>
          )}

          {'date' in event && event.details && (
            <div
              style={{
                fontSize: 12,
                color: darkMode ? '#a1a1aa' : '#636366',
                padding: '6px 8px',
                borderRadius: 6,
                backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)',
                whiteSpace: 'pre-wrap',
                marginTop: 2,
              }}
            >
              {event.details}
            </div>
          )}

          {/* Acciones de edición y eliminación para eventos creados */}
          {'date' in event && (
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                type="button"
                style={actionButtonStyle}
                onClick={() => onEdit?.(event)}
              >
                <Icon f7="pencil" size="12px" />
                <span>Editar</span>
              </button>

              <button
                type="button"
                style={{
                  ...actionButtonStyle,
                  color: '#ff3b30',
                  borderColor: darkMode ? 'rgba(255, 59, 48, 0.3)' : 'rgba(255, 59, 48, 0.2)',
                  backgroundColor: 'rgba(255, 59, 48, 0.08)',
                }}
                onClick={() => onDelete?.(event)}
              >
                <Icon f7="trash" size="12px" />
                <span>Eliminar</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            padding: '28px 12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: darkMode ? '#8e8e93' : '#8e8e93',
          }}
        >
          <Icon f7="calendar_badge_clock" size="32px" style={{ opacity: 0.5 }} />
          <span style={{ fontSize: 13 }}>Selecciona una audiencia o evento para ver sus detalles</span>
        </div>
      )}
    </div>
  );
};

export default AgendaEventDetail;
