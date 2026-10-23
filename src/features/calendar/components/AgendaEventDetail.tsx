import type { FC, CSSProperties } from 'react';
import { APP_COLORS } from '../../../core/theme/style';
import type { CalendarEvent } from '../types';

interface AgendaEventDetailProps {
  event: CalendarEvent | null;
  clientName?: string;
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

export const AgendaEventDetail: FC<AgendaEventDetailProps> = ({ event, clientName }) => (
  <div style={containerStyle}>
    <div style={titleStyle}>Detalle del evento</div>
    {event ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <strong style={{ fontSize: 14, color: APP_COLORS.black }}>{event.title}</strong>
        <span style={detailTextStyle}>{formatEventDate(event.date)}</span>
        <span style={detailTextStyle}>
          {formatClockTime(event.startTime)} – {formatClockTime(event.endTime)}
        </span>
        {clientName && <span style={detailTextStyle}>Cliente: {clientName}</span>}
        <span style={detailTextStyle}>
          {event.alarmMinutes > 0
            ? `Aviso previo: ${event.alarmMinutes} minutos (no funcional)`
            : 'Sin aviso previo'}
        </span>
        {event.details && (
          <p style={{ ...detailTextStyle, margin: '4px 0 0' }}>{event.details}</p>
        )}
      </div>
    ) : (
      <div style={emptyTextStyle}>Selecciona un evento para ver sus detalles</div>
    )}
  </div>
);
