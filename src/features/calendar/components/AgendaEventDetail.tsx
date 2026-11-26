import type { FC, CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import type { CalendarEvent } from '../types';
import type { HearingEvent } from '../../../core/context/types';
import { getCalendarEventColor } from '../data/eventColors';

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
  const containerStyle: CSSProperties = {
    padding: '16px 14px',
    borderTop: '1px solid var(--macos-divider, rgba(128, 128, 136, 0.14))',
    userSelect: 'none',
  };

  const titleStyle: CSSProperties = {
    fontSize: 11.5,
    fontWeight: 650,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--macos-text-secondary, #8e8e93)',
    marginBottom: 12,
  };

  const infoRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    fontSize: 12.5,
    color: 'var(--macos-text-secondary, #a4a4ab)',
    lineHeight: 1.4,
  };

  const actionButtonStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 30,
    padding: '0 14px',
    borderRadius: 999,
    border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.22))',
    backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.05))',
    color: 'var(--macos-text, #ececef)',
    fontSize: 12,
    fontWeight: 550,
    cursor: 'pointer',
    transition: 'background-color 0.12s ease',
  };

  const dotColor = event
    ? 'date' in event
      ? getCalendarEventColor(event.colorId).accent
      : '#ff453a'
    : 'var(--macos-text-secondary, #8e8e93)';

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>Detalle del evento</div>

      {event ? (
        <div
          key={'id' in event ? event.id : 'selected-hearing'}
          className="cal-switch-anim"
          style={{
            backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.045))',
            borderRadius: 14,
            padding: '14px 16px',
            border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.09))',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.16)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {/* Título e insignia minimalista */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: dotColor,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 650,
                  color: 'var(--macos-text, #ececef)',
                  lineHeight: 1.3,
                }}
              >
                {'title' in event ? event.title : event.clientName}
              </span>
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 650,
                padding: '2px 8px',
                borderRadius: 999,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.22))',
                backgroundColor: 'var(--macos-active-bg, rgba(128, 128, 136, 0.14))',
                color: 'var(--macos-text-secondary, #a4a4ab)',
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
                <Icon f7="calendar" size="13px" style={{ opacity: 0.75, flexShrink: 0, marginTop: 2 }} />
                <span>{formatEventDate(event.date)}</span>
              </div>
              <div style={infoRowStyle}>
                <Icon f7="clock" size="13px" style={{ opacity: 0.75, flexShrink: 0, marginTop: 2 }} />
                <span>
                  {formatClockTime(event.startTime)} – {formatClockTime(event.endTime)}
                </span>
              </div>
            </>
          ) : (
            <>
              <div style={infoRowStyle}>
                <Icon f7="calendar" size="13px" style={{ opacity: 0.75, flexShrink: 0, marginTop: 2 }} />
                <span>{event.dateStr.split(' - ')[0]}</span>
              </div>
              <div style={infoRowStyle}>
                <Icon f7="clock" size="13px" style={{ opacity: 0.75, flexShrink: 0, marginTop: 2 }} />
                <span>
                  {formatHearingTime(event.timeStr)}
                  {hearingEndTime ? ` – ${formatClockTime(hearingEndTime)}` : ''}
                </span>
              </div>
              <div style={infoRowStyle}>
                <Icon f7="briefcase" size="13px" style={{ opacity: 0.75, flexShrink: 0, marginTop: 2 }} />
                <span>{event.materia}</span>
              </div>
              {event.juzgado && (
                <div style={infoRowStyle}>
                  <Icon f7="building_columns" size="13px" style={{ opacity: 0.75, flexShrink: 0, marginTop: 2 }} />
                  <span>{event.juzgado}</span>
                </div>
              )}
              {event.expediente && (
                <div style={infoRowStyle}>
                  <Icon f7="doc_text" size="13px" style={{ opacity: 0.75, flexShrink: 0, marginTop: 2 }} />
                  <span>Expediente: {event.expediente}</span>
                </div>
              )}
            </>
          )}

          {clientName && (
            <div style={infoRowStyle}>
              <Icon f7="person" size="13px" style={{ opacity: 0.75, flexShrink: 0, marginTop: 2 }} />
              <span>Cliente: {clientName}</span>
            </div>
          )}

          {'date' in event && event.details && (
            <div
              style={{
                fontSize: 12,
                color: 'var(--macos-text-secondary, #a4a4ab)',
                padding: '8px 10px',
                borderRadius: 10,
                border: '1px solid var(--macos-divider, rgba(128, 128, 136, 0.14))',
                backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.03))',
                whiteSpace: 'pre-wrap',
                marginTop: 2,
              }}
            >
              {event.details}
            </div>
          )}

          {/* Acciones */}
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
                  color: '#ff6961',
                  borderColor: 'rgba(255, 69, 58, 0.25)',
                  backgroundColor: 'rgba(255, 69, 58, 0.08)',
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
            minHeight: 112,
            padding: '20px 12px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--macos-text-secondary, #8e8e93)',
          }}
        >
          <span style={{ fontSize: 12.5, lineHeight: 1.45 }}>
            Selecciona una audiencia o evento para ver sus detalles
          </span>
        </div>
      )}
    </div>
  );
};

export default AgendaEventDetail;
