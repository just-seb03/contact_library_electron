import type { FC, CSSProperties } from 'react';
import type { Client } from '../types';
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
}

export const ClientDetails: FC<ClientDetailsProps> = ({
  client,
  payments,
  events,
  legacyHearing,
  onEdit,
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
      <ClientCaseDetails client={client} onEdit={onEdit} />
      <ClientActivityDetails
        payments={payments}
        events={events}
        legacyHearing={legacyHearing}
      />
    </div>
  );
};
