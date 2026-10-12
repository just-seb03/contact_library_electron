import type { FC } from 'react';
import { Client } from './types';
import { ClientBanner } from './ClientBanner';
import { ClientCaseDetails } from './ClientCaseDetails';

interface ClientDetailsProps {
  client: Client;
}

export const ClientDetails: FC<ClientDetailsProps> = ({ client }) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
      {/* Cabecera cristalina con Nombre, Estado y Contacto */}
      <ClientBanner client={client} />

      {/* Panel inferior con Información del Caso y Expediente */}
      <ClientCaseDetails client={client} />
    </div>
  );
};
