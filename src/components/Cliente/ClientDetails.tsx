import type { FC } from 'react';
import { Client } from './types';
import { ClientBanner } from './ClientBanner';
import { ClientCaseDetails } from './ClientCaseDetails';

interface ClientDetailsProps {
  client: Client;
}

export const ClientDetails: FC<ClientDetailsProps> = ({ client }) => {
  return (
    <div className="display-flex flex-direction-column">
      <ClientBanner client={client} />
      <ClientCaseDetails client={client} />
    </div>
  );
};
