import { Icon } from 'framework7-react';
import { Client } from './types';

type ClientDetailsProps = {
  client: Client;
};

export const ClientDetails = ({ client }: ClientDetailsProps) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Apartado Azul: Cabecera del Cliente */}
      <div style={{ 
        backgroundColor: '#0056b3',
        color: '#fff', 
        padding: '24px 32px', 
        borderRadius: '12px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '24px', 
        boxShadow: '0 8px 24px rgba(0,86,179,0.25)' 
      }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '600', letterSpacing: '-0.5px' }}>
            {client.name}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: 'rgba(255,255,255,0.85)' }}>
            <Icon f7="phone_fill" size="16px" />
            <span>{client.phone}</span>
          </div>
        </div>
      </div>

      {/* Espacio reservado para el seguimiento de caso */}
      <div style={{ 
        marginTop: '24px', 
        flex: 1,
        padding: '40px', 
        backgroundColor: '#fafafa', 
        borderRadius: '12px', 
        border: '2px dashed #eaeaea', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#a0a0a0' 
      }}>
        <Icon f7="folder_badge_plus" size="48px" style={{ marginBottom: '16px', opacity: 0.6 }} />
        <p style={{ fontSize: '16px', margin: 0, fontWeight: '500' }}>
          El seguimiento de caso de {client.name.split(' ')[0]} aparecerá aquí próximamente.
        </p>
      </div>

    </div>
  );
};
