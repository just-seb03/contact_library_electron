import type { FC, CSSProperties } from 'react';
import { Badge, Icon } from 'framework7-react';
import type { Client } from '../types';
import type { CalendarEvent } from '../../calendar/types';
import type { Payment } from '../../payments/types';
import { formatCLP } from '../../../core/utils/format';

interface ClientCardProps {
  client: Client;
  onSelect: (client: Client) => void;
  payment: Payment | null;
  event: CalendarEvent | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  activo: { label: 'Activo', color: '#34c759', bg: 'rgba(52, 199, 89, 0.1)' },
  en_proceso: { label: 'En proceso', color: '#ff9500', bg: 'rgba(255, 149, 0, 0.1)' },
  completado: { label: 'Completado', color: '#007aff', bg: 'rgba(0, 122, 255, 0.1)' },
};

const PAYMENT_STATUS_LABELS: Record<Payment['status'], string> = {
  completed: 'Cobrado',
  pending: 'Pendiente',
  overdue: 'Vencido',
};

const PAYMENT_STATUS_COLORS: Record<Payment['status'], string> = {
  completed: 'green',
  pending: 'orange',
  overdue: 'red',
};

function formatEventDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(year, month - 1, day));
}

export const ClientCard: FC<ClientCardProps> = ({ client, onSelect, payment, event }) => {
  const status = client.status ? STATUS_CONFIG[client.status] : null;

  const cardStyle: CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: '20px 20px 16px 20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.04)',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    boxSizing: 'border-box',
    border: '1px solid rgba(0,0,0,0.05)',
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  };

  const nameBlockStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    flex: 1,
    minWidth: 0,
  };

  const nameStyle: CSSProperties = {
    fontSize: 16,
    fontWeight: 700,
    color: '#1c1c1e',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: 1.25,
  };

  const statusBadgeStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    paddingLeft: 8,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    backgroundColor: status?.bg ?? 'rgba(142,142,147,0.1)',
    color: status?.color ?? '#8e8e93',
    flexShrink: 0,
    alignSelf: 'flex-start',
  };

  const dividerStyle: CSSProperties = {
    height: 1,
    backgroundColor: '#f2f2f7',
    margin: '0 -20px',
  };

  const infoRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const infoIconStyle: CSSProperties = {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(0,122,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const infoTextStyle: CSSProperties = {
    fontSize: 13,
    color: '#3c3c43',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
    minWidth: 0,
  };

  const casoStyle: CSSProperties = {
    fontSize: 12,
    color: '#8e8e93',
    backgroundColor: '#f2f2f7',
    borderRadius: 6,
    padding: '5px 10px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const activityStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  };

  const activityRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    minWidth: 0,
    color: '#636366',
    fontSize: 12,
  };

  const activityTextStyle: CSSProperties = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
  };

  return (
    <div
      style={cardStyle}
      onClick={() => onSelect(client)}
      role="button"
      tabIndex={0}
      title={`Ver detalles de ${client.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect(client);
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 1px 4px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.04)';
      }}
    >
      {/* Cabecera: Nombre + estado */}
      <div style={headerStyle}>
        <div style={nameBlockStyle}>
          <span style={nameStyle}>{client.name}</span>
          {client.caso?.materia && (
            <span style={casoStyle}>{client.caso.materia}</span>
          )}
        </div>
        {status && (
          <span style={statusBadgeStyle}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: status.color,
                flexShrink: 0,
                display: 'inline-block',
              }}
            />
            {status.label}
          </span>
        )}
      </div>

      <div style={dividerStyle} />

      {/* Correo electrónico */}
      {client.email && (
        <div style={infoRowStyle}>
          <div style={infoIconStyle}>
            <Icon f7="envelope_fill" size="13px" color="blue" />
          </div>
          <span style={infoTextStyle}>{client.email}</span>
        </div>
      )}

      {/* Teléfono */}
      <div style={infoRowStyle}>
        <div style={infoIconStyle}>
          <Icon f7="phone_fill" size="13px" color="blue" />
        </div>
        <span style={infoTextStyle}>{client.phone}</span>
      </div>

      {(payment || event) && <div style={dividerStyle} />}
      <div style={activityStyle}>
        {payment && (
          <div style={activityRowStyle}>
            <span style={activityTextStyle}>
              {payment.concept} · {formatCLP(payment.amount)}
            </span>
            <Badge color={PAYMENT_STATUS_COLORS[payment.status]}>
              {PAYMENT_STATUS_LABELS[payment.status]}
            </Badge>
          </div>
        )}
        {event && (
          <div style={activityRowStyle}>
            <Icon f7="calendar" size="14px" color="blue" />
            <span style={activityTextStyle}>
              {event.title} · {formatEventDate(event.date)} {event.startTime}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
