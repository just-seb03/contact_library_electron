import type { FC, CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import type { CalendarEvent } from '../../calendar/types';
import type { ClientDocument } from '../types';
import type { Payment } from '../../payments/types';
import type { HearingEvent } from '../../../core/context/types';
import { formatCLP } from '../../../core/utils/format';
import { PaymentActionsMenu } from '../../payments/components/PaymentActionsMenu';
import { PaymentStatusIndicator } from '../../payments/components/PaymentStatusIndicator';
import { ClientDocumentsSection } from './ClientDocumentsSection';

const glassSectionStyle: CSSProperties = {
  backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.045))',
  border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.09))',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
  backdropFilter: 'blur(24px) saturate(160%)',
  WebkitBackdropFilter: 'blur(24px) saturate(160%)',
  borderRadius: 16,
  padding: '18px 20px',
};

const glassItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '12px 14px',
  borderRadius: 12,
  backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.035))',
  border: '1px solid var(--macos-divider, rgba(128, 128, 136, 0.14))',
};

const glassHeadingStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: 'var(--macos-text, #ececef)',
  margin: '0 0 12px 0',
};

const glassEmptyStyle: CSSProperties = {
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
  documents: ClientDocument[];
  onUploadDocument: (file: File) => Promise<void>;
  onDeleteDocument: (document: ClientDocument) => void;
}

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

export const ClientActivityDetails: FC<ClientActivityDetailsProps> = ({
  payments,
  events,
  legacyHearing,
  onEditPayment,
  onDeletePayment,
  documents,
  onUploadDocument,
  onDeleteDocument,
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
      <section style={glassSectionStyle} aria-labelledby="client-payments-heading">
        <h2 id="client-payments-heading" style={glassHeadingStyle}>Gestión de pagos</h2>
        {payments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {payments.map((payment) => (
              <div key={payment.id} style={glassItemStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                  <span style={{ color: 'var(--macos-text, #ececef)', fontSize: 14, fontWeight: 550 }}>
                    {payment.concept} · {formatCLP(payment.amount)}
                  </span>
                  <span style={{ color: 'var(--macos-text-secondary, #8e8e93)', fontSize: 12 }}>Fecha: {payment.date}</span>
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
          <p style={glassEmptyStyle}>Este cliente aún no tiene pagos registrados.</p>
        )}
      </section>

      <section style={glassSectionStyle} aria-labelledby="client-events-heading">
        <h2 id="client-events-heading" style={glassHeadingStyle}>Agenda del cliente</h2>
        {nextEvent && (
          <p style={{ ...glassEmptyStyle, marginBottom: 12, color: 'var(--macos-text, #ececef)', fontWeight: 550 }}>
            Próxima reunión: {nextEvent.title} · {formatEventDate(nextEvent.date)} · {nextEvent.startTime}
          </p>
        )}
        {showLegacyHearing && legacyHearing && (
          <div style={{ ...glassItemStyle, justifyContent: 'flex-start', marginBottom: 8 }}>
            <Icon f7="calendar" size="16px" style={{ color: 'var(--macos-text-secondary, #a4a4ab)', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
              <span style={{ color: 'var(--macos-text, #ececef)', fontSize: 14, fontWeight: 550 }}>
                Próxima audiencia
              </span>
              <span style={{ color: 'var(--macos-text-secondary, #8e8e93)', fontSize: 12 }}>
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
              <div key={event.id} style={glassItemStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <Icon f7="calendar" size="16px" style={{ color: 'var(--macos-text-secondary, #a4a4ab)', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                    <span style={{ color: 'var(--macos-text, #ececef)', fontSize: 14, fontWeight: 550 }}>
                      {event.title}
                    </span>
                    <span style={{ color: 'var(--macos-text-secondary, #8e8e93)', fontSize: 12 }}>
                      {formatEventDate(event.date)} · {event.startTime}–{event.endTime}
                    </span>
                    {event.details && (
                      <span style={{ color: 'var(--macos-text-secondary, #8e8e93)', fontSize: 12 }}>{event.details}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={glassEmptyStyle}>Este cliente aún no tiene eventos asociados.</p>
        )}
      </section>
      <ClientDocumentsSection
        documents={documents}
        onUpload={onUploadDocument}
        onDelete={onDeleteDocument}
      />
    </>
  );
};
