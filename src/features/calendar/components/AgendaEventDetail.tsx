import type { FC, CSSProperties } from 'react';
import { Button, Icon } from 'framework7-react';
import { APP_COLORS } from '../../../core/theme/style';
import type { CalendarEvent } from '../types';
import type { HearingEvent } from '../../../core/context/types';

interface AgendaEventDetailProps {
  event: CalendarEvent | HearingEvent | null;
  clientName?: string;
  hearingEndTime?: string;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (event: CalendarEvent) => void;
}

const containerStyle: CSSProperties = {
  padding: '16px 12px',
  borderTop: '1px solid rgba(0,0,0,0.06)',
};

const titleStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: APP_COLORS.black,
  marginBottom: 12,
};

const emptyTextStyle: CSSProperties = {
  fontSize: 13,
  color: APP_COLORS.neutral,
  textAlign: 'center',
  padding: '24px 0',
};

const detailTextStyle: CSSProperties = {
  fontSize: 13,
  color: APP_COLORS.neutral,
  lineHeight: 1.5,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
};

const actionsStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  marginTop: 8,
};

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
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time;
  return `${match[1].padStart(2, '0')}:${match[2]} ${match[3].toUpperCase()}`;
}

export const AgendaEventDetail: FC<AgendaEventDetailProps> = ({
  event,
  clientName,
  hearingEndTime,
  onEdit,
  onDelete,
}) => (
  <div style={containerStyle}>
    <div style={titleStyle}>Detalle del evento</div>
    {event ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <strong style={{ fontSize: 14, color: APP_COLORS.black }}>
          {'title' in event ? event.title : event.clientName}
        </strong>
        {'date' in event ? (
          <>
            <span style={detailTextStyle}>{formatEventDate(event.date)}</span>
            <span style={detailTextStyle}>Hora de inicio: {formatClockTime(event.startTime)}</span>
            <span style={detailTextStyle}>Hora de término: {formatClockTime(event.endTime)}</span>
          </>
        ) : (
          <>
            <span style={detailTextStyle}>
              Fecha: {event.dateStr.split(' - ')[0]}
            </span>
            <span style={detailTextStyle}>
              Hora de inicio: {formatHearingTime(event.timeStr)}
            </span>
            <span style={detailTextStyle}>
              Hora de término: {
                hearingEndTime
                  ? formatClockTime(hearingEndTime)
                  : 'No hay un evento de calendario asociado'
              }
            </span>
            <span style={detailTextStyle}>{event.materia}</span>
            <span style={detailTextStyle}>{event.juzgado}</span>
            <span style={detailTextStyle}>Expediente: {event.expediente}</span>
          </>
        )}
        {clientName && <span style={detailTextStyle}>Cliente: {clientName}</span>}
        {'date' in event && (
          <>
            <span style={detailTextStyle}>
              {event.alarmMinutes > 0
                ? `Aviso previo: ${event.alarmMinutes} minutos (no funcional)`
                : 'Sin aviso previo'}
            </span>
            {event.details && (
              <p style={{ ...detailTextStyle, margin: '4px 0 0' }}>{event.details}</p>
            )}
            <div style={actionsStyle}>
              <Button small onClick={() => onEdit?.(event)}>
                <Icon f7="pencil" size="13px" /> Editar
              </Button>
              <Button small color="red" onClick={() => onDelete?.(event)}>
                <Icon f7="trash" size="13px" /> Eliminar
              </Button>
            </div>
          </>
        )}
      </div>
    ) : (
      <div style={emptyTextStyle}>Selecciona un evento para ver sus detalles</div>
    )}
  </div>
);
