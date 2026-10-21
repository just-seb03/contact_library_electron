import type { FC, CSSProperties } from 'react';
import type { Client } from '../types';
import { ClientBanner } from './ClientBanner';
import { ClientCaseDetails } from './ClientCaseDetails';

interface ClientDetailsProps {
  client: Client;
}

export const ClientDetails: FC<ClientDetailsProps> = ({ client }) => {
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    paddingBottom: 16,
  };

  return (
    <div style={containerStyle}>
      <ClientBanner client={client} />
      <ClientCaseDetails client={client} />
    </div>
  );
};
