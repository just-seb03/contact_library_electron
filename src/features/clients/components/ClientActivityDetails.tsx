import type { FC, CSSProperties } from 'react';
import type { CalendarEvent } from '../../calendar/types';
import type { Payment } from '../../payments/types';
import type { HearingEvent } from '../../../core/context/types';
import { formatCLP } from '../../../core/utils/format';
import { PaymentActionsMenu } from '../../payments/components/PaymentActionsMenu';
import { PaymentStatusIndicator } from '../../payments/components/PaymentStatusIndicator';

const sectionStyle: CSSProperties = {
  backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.045))',
  border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.09))',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.14)',
  backdropFilter: 'blur(24px) saturate(160%)',
  WebkitBackdropFilter: 'blur(24px) saturate(160%)',
  borderRadius: 16,
  padding: '16px 20px',
};

const headingStyle: CSSProperties = {
  fontSize: 13.5,
  fontWeight: 600,
  color: 'var(--macos-text, #ececef)',
  margin: '0 0 10px 0',
};

const rowStyle = (isLast: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '10px 0',
  borderBottom: isLast ? 'none' : '1px solid var(--macos-divider, rgba(128, 128, 136, 0.14))',
});

const emptyStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: 'var(--macos-text-secondary, #8e8e93)',
};

interface ClientActivityDetailsProps {
  payments: Payment[];
  events: CalendarEvent[];
  legacyHearing: HearingEvent | null;
  onEditPayment: (payment: Payment) => void;
  onDeletePayment: (payment: Payment) => void;
}

function formatEventDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}

function getLocalDateValue(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

export const ClientActivityDetails: FC<ClientActivityDetailsProps> = ({
  payments,
  events,
  legacyHearing,
  onEditPayment,
  onDeletePayment,
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

  const legacyHearingDate = legacyHearing
    ? `${legacyHearing.year}-${String(legacyHearing.monthIndex + 1).padStart(2, '0')}-${String(legacyHearing.day).padStart(2, '0')}`
    : null;
  const showLegacyHearing =
    legacyHearing !== null &&
    legacyHearingDate !== null &&
    legacyHearingDate >= today;

  const hasAnyEvent = showLegacyHearing || orderedEvents.length > 0;

  return (
    <>
      <section style={sectionStyle} aria-labelledby="client-payments-heading">
        <h2 id="client-payments-heading" style={headingStyle}>Pagos</h2>
        {payments.length > 0 ? (
          <div>
            {payments.map((payment, index) => (
              <div key={payment.id} style={rowStyle(index === payments.length - 1)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <span style={{ color: 'var(--macos-text, #ececef)', fontSize: 13.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {payment.concept}
                  </span>
                  <span style={{ color: 'var(--macos-text-secondary, #8e8e93)', fontSize: 12 }}>
                    {formatCLP(payment.amount)} · {payment.date}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <PaymentStatusIndicator status={payment.status} />
                  <PaymentActionsMenu
                    onEdit={() => onEditPayment(payment)}
                    onDelete={() => onDeletePayment(payment)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={emptyStyle}>Sin pagos registrados</p>
        )}
      </section>

      <section style={sectionStyle} aria-labelledby="client-events-heading">
        <h2 id="client-events-heading" style={headingStyle}>Agenda</h2>
        {hasAnyEvent ? (
          <div>
            {showLegacyHearing && legacyHearing && (
              <div style={rowStyle(orderedEvents.length === 0)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <span style={{ color: 'var(--macos-text, #ececef)', fontSize: 13.5, fontWeight: 500 }}>
                    Audiencia · {legacyHearing.juzgado}
                  </span>
                  <span style={{ color: 'var(--macos-text-secondary, #8e8e93)', fontSize: 12 }}>
                    {new Intl.DateTimeFormat('es-CL', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }).format(new Date(legacyHearing.year, legacyHearing.monthIndex, legacyHearing.day))}
                    {' · '}{legacyHearing.timeStr}
                  </span>
                </div>
              </div>
            )}

            {orderedEvents.map((event, index) => (
              <div key={event.id} style={rowStyle(index === orderedEvents.length - 1)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <span style={{ color: 'var(--macos-text, #ececef)', fontSize: 13.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {event.title}
                  </span>
                  <span style={{ color: 'var(--macos-text-secondary, #8e8e93)', fontSize: 12 }}>
                    {formatEventDate(event.date)} · {event.startTime}–{event.endTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={emptyStyle}>Sin eventos próximos</p>
        )}
      </section>
    </>
  );
};
