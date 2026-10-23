import type { CSSProperties, FC } from 'react';
import { Badge, Icon } from 'framework7-react';
import type { CalendarEvent } from '../../calendar/types';
import type { Payment } from '../../payments/types';
import type { HearingEvent } from '../../../core/context/types';
import { formatCLP } from '../../../core/utils/format';
import { navigateToTab } from '../../../navigation/navigation';

interface ClientActivityDetailsProps {
  payments: Payment[];
  events: CalendarEvent[];
  legacyHearing: HearingEvent | null;
}

const paymentStatusColor = (status: Payment['status']): string => {
  switch (status) {
    case 'completed': return 'green';
    case 'pending': return 'orange';
    case 'overdue': return 'red';
  }
};

const paymentStatusLabel = (status: Payment['status']): string => {
  switch (status) {
    case 'completed': return 'Cobrado';
    case 'pending': return 'Pendiente';
    case 'overdue': return 'Vencido';
  }
};

function formatEventDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}

function getLocalDateValue(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

const sectionStyle: CSSProperties = {
  backgroundColor: 'var(--app-color-white, #ffffff)',
  borderRadius: 16,
  padding: 24,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
};

const headingStyle: CSSProperties = {
  margin: '0 0 14px',
  color: '#1c1c1e',
  fontSize: 18,
  fontWeight: 600,
};

const itemStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  padding: '12px 14px',
  borderRadius: 10,
  backgroundColor: '#f9f9fb',
};

const emptyStyle: CSSProperties = {
  margin: 0,
  color: '#8e8e93',
  fontSize: 13,
};

export const ClientActivityDetails: FC<ClientActivityDetailsProps> = ({
  payments,
  events,
  legacyHearing,
}) => {
  const today = getLocalDateValue();
  const orderedEvents = [...events].sort((first, second) => {
    const firstIsUpcoming = first.date >= today;
    const secondIsUpcoming = second.date >= today;
    if (firstIsUpcoming !== secondIsUpcoming) return firstIsUpcoming ? -1 : 1;
    const comparison = `${first.date}T${first.startTime}`.localeCompare(
      `${second.date}T${second.startTime}`
    );
    return firstIsUpcoming ? comparison : -comparison;
  });
  const nextEvent = orderedEvents.find((event) => event.date >= today);
  const legacyHearingDate = legacyHearing
    ? `${legacyHearing.year}-${String(legacyHearing.monthIndex + 1).padStart(2, '0')}-${String(legacyHearing.day).padStart(2, '0')}`
    : null;
  const showLegacyHearing = !nextEvent
    && legacyHearing
    && legacyHearingDate !== null
    && legacyHearingDate >= today;

  return (
    <>
      <section style={sectionStyle} aria-labelledby="client-payments-heading">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <h2 id="client-payments-heading" style={headingStyle}>Gestión de pagos</h2>
          <button
            type="button"
            onClick={() => navigateToTab('pagos')}
            style={{
              width: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 12px',
              border: '1px solid #d1d1d6',
              borderRadius: 8,
              backgroundColor: '#f2f2f7',
              color: '#007aff',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Gestionar pagos
          </button>
        </div>
        {payments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {payments.map((payment) => (
              <div key={payment.id} style={itemStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                  <span style={{ color: '#1c1c1e', fontSize: 14, fontWeight: 600 }}>
                    {payment.concept} · {formatCLP(payment.amount)}
                  </span>
                  <span style={{ color: '#8e8e93', fontSize: 12 }}>Fecha: {payment.date}</span>
                </div>
                <Badge color={paymentStatusColor(payment.status)}>
                  {paymentStatusLabel(payment.status)}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p style={emptyStyle}>Este cliente aún no tiene pagos registrados.</p>
        )}
      </section>

      <section style={sectionStyle} aria-labelledby="client-events-heading">
        <h2 id="client-events-heading" style={headingStyle}>Agenda del cliente</h2>
        {nextEvent && (
          <p style={{ ...emptyStyle, marginBottom: 12, color: '#007aff', fontWeight: 600 }}>
            Próxima reunión: {nextEvent.title} · {formatEventDate(nextEvent.date)} · {nextEvent.startTime}
          </p>
        )}
        {showLegacyHearing && legacyHearing && (
          <div style={{ ...itemStyle, justifyContent: 'flex-start', marginBottom: 8 }}>
            <Icon f7="calendar" size="18px" style={{ color: '#007aff', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
              <span style={{ color: '#1c1c1e', fontSize: 14, fontWeight: 600 }}>
                Próxima audiencia
              </span>
              <span style={{ color: '#8e8e93', fontSize: 12 }}>
                {new Intl.DateTimeFormat('es-CL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).format(new Date(legacyHearing.year, legacyHearing.monthIndex, legacyHearing.day))}
                {' · '}{legacyHearing.timeStr}
              </span>
            </div>
          </div>
        )}
        {orderedEvents.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {orderedEvents.map((event) => (
              <div key={event.id} style={itemStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <Icon f7="calendar" size="18px" style={{ color: '#007aff', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                    <span style={{ color: '#1c1c1e', fontSize: 14, fontWeight: 600 }}>
                      {event.title}
                    </span>
                    <span style={{ color: '#8e8e93', fontSize: 12 }}>
                      {formatEventDate(event.date)} · {event.startTime}–{event.endTime}
                    </span>
                    {event.details && (
                      <span style={{ color: '#636366', fontSize: 12 }}>{event.details}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={emptyStyle}>Este cliente aún no tiene eventos asociados.</p>
        )}
      </section>
    </>
  );
};
