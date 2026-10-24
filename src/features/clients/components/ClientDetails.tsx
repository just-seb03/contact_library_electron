import type { FC, CSSProperties } from 'react';
import type { Client, ClientDocument } from '../types';
import { ClientBanner } from './ClientBanner';
import { ClientCaseDetails } from './ClientCaseDetails';
import { ClientActivityDetails } from './ClientActivityDetails';
import type { Payment } from '../../payments/types';
import type { CalendarEvent } from '../../calendar/types';
import type { HearingEvent } from '../../../core/context/types';

interface ClientDetailsProps {
  client: Client;
  payments: Payment[];
  events: CalendarEvent[];
  legacyHearing: HearingEvent | null;
  onEdit: () => void;
  onDelete: () => void;
  onEditPayment: (payment: Payment) => void;
  onDeletePayment: (payment: Payment) => void;
  onUploadDocument: (file: File) => Promise<void>;
  onDeleteDocument: (document: ClientDocument) => void;
}

export const ClientDetails: FC<ClientDetailsProps> = ({
  client,
  payments,
  events,
  legacyHearing,
  onEdit,
  onDelete,
  onEditPayment,
  onDeletePayment,
  onUploadDocument,
  onDeleteDocument,
}) => {
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    paddingBottom: 16,
  };

  return (
    <div style={containerStyle}>
      <ClientBanner client={client} />
      <ClientCaseDetails client={client} onEdit={onEdit} onDelete={onDelete} />
      <ClientActivityDetails
        payments={payments}
        events={events}
        legacyHearing={legacyHearing}
        onEditPayment={onEditPayment}
        onDeletePayment={onDeletePayment}
        documents={client.documentos ?? []}
        onUploadDocument={onUploadDocument}
        onDeleteDocument={onDeleteDocument}
      />
    </div>
  );
};
