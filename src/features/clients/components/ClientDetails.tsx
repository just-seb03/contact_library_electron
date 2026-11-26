import type { FC, CSSProperties } from 'react';
import type { Client, ClientDocument } from '../types';
import { ClientBanner } from './ClientBanner';
import { ClientCaseDetails } from './ClientCaseDetails';
import { ClientActivityDetails } from './ClientActivityDetails';
import { ClientDocumentsSection } from './ClientDocumentsSection';
import type { Payment } from '../../payments/types';
import type { CalendarEvent } from '../../calendar/types';
import type { HearingEvent } from '../../../core/context/types';

interface ClientDetailsProps {
  client: Client;
  payments: Payment[];
  events: CalendarEvent[];
  legacyHearing: HearingEvent | null;
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

  const columnsStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 16,
    alignItems: 'start',
  };

  const columnStackStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    minWidth: 0,
  };

  return (
    <div style={containerStyle}>
      <ClientBanner client={client} />

      <div style={columnsStyle}>
        <div style={columnStackStyle}>
          <ClientCaseDetails client={client} />
          <ClientDocumentsSection
            documents={client.documentos ?? []}
            onUpload={onUploadDocument}
            onDelete={onDeleteDocument}
          />
        </div>

        <div style={columnStackStyle}>
          <ClientActivityDetails
            payments={payments}
            events={events}
            legacyHearing={legacyHearing}
            onEditPayment={onEditPayment}
            onDeletePayment={onDeletePayment}
          />
        </div>
      </div>
    </div>
  );
};
