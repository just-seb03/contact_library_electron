import type { FC } from 'react';
import { Icon } from 'framework7-react';
import type { CalendarEvent } from '../../calendar/types';
import type { ClientDocument } from '../types';
import type { Payment } from '../../payments/types';
import type { HearingEvent } from '../../../core/context/types';
import { formatCLP } from '../../../core/utils/format';
import { PaymentActionsMenu } from '../../payments/components/PaymentActionsMenu';
import { PaymentStatusIndicator } from '../../payments/components/PaymentStatusIndicator';
import { ClientDocumentsSection } from './ClientDocumentsSection';
import {
  APP_COLORS,
  EMPTY_TEXT_STYLE,
  MUTED_ITEM_STYLE,
  SECTION_HEADING_STYLE,
  SECTION_STYLE,
} from '../../../core/theme/style';

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
      <section style={SECTION_STYLE} aria-labelledby="client-payments-heading">
        <h2 id="client-payments-heading" style={SECTION_HEADING_STYLE}>Gestión de pagos</h2>
        {payments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {payments.map((payment) => (
              <div key={payment.id} style={MUTED_ITEM_STYLE}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                  <span style={{ color: 'var(--macos-text, #1c1c1e)', fontSize: 14, fontWeight: 600 }}>
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
          <p style={EMPTY_TEXT_STYLE}>Este cliente aún no tiene pagos registrados.</p>
        )}
      </section>

      <section style={SECTION_STYLE} aria-labelledby="client-events-heading">
        <h2 id="client-events-heading" style={SECTION_HEADING_STYLE}>Agenda del cliente</h2>
        {nextEvent && (
          <p style={{ ...EMPTY_TEXT_STYLE, marginBottom: 12, color: APP_COLORS.primary, fontWeight: 600 }}>
            Próxima reunión: {nextEvent.title} · {formatEventDate(nextEvent.date)} · {nextEvent.startTime}
          </p>
        )}
        {showLegacyHearing && legacyHearing && (
          <div style={{ ...MUTED_ITEM_STYLE, justifyContent: 'flex-start', marginBottom: 8 }}>
            <Icon f7="calendar" size="18px" style={{ color: APP_COLORS.primary, flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
              <span style={{ color: 'var(--macos-text, #1c1c1e)', fontSize: 14, fontWeight: 600 }}>
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
              <div key={event.id} style={MUTED_ITEM_STYLE}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <Icon f7="calendar" size="18px" style={{ color: APP_COLORS.primary, flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                    <span style={{ color: 'var(--macos-text, #1c1c1e)', fontSize: 14, fontWeight: 600 }}>
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
          <p style={EMPTY_TEXT_STYLE}>Este cliente aún no tiene eventos asociados.</p>
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
