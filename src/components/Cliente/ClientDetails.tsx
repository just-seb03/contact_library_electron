import { Icon } from 'framework7-react';
import { Client } from './types';

type ClientDetailsProps = {
  client: Client;
};

export const ClientDetails = ({ client }: ClientDetailsProps) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Apartado Azul: Cabecera con Nombre y Teléfono del Cliente */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #0056b3 0%, #00438a 100%)',
          color: '#fff', 
          padding: '22px 28px', 
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 6px 20px rgba(0, 86, 179, 0.25)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div 
            style={{ 
              width: '52px', 
              height: '52px', 
              borderRadius: '12px', 
              backgroundColor: 'rgba(255, 255, 255, 0.18)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Icon f7="person_crop_circle_fill" size="30px" color="white" />
          </div>

          <div>
            <h2 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.3px', color: '#ffffff' }}>
              {client.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: '500' }}>
              <Icon f7="phone_fill" size="14px" />
              <span>{client.phone}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span 
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.15)', 
              padding: '6px 14px', 
              borderRadius: '20px', 
              fontSize: '12px', 
              fontWeight: '600', 
              letterSpacing: '0.3px' 
            }}
          >
            ID #{client.id}
          </span>
        </div>
      </div>

      {/* Panel inferior: Detalles del cliente y seguimiento de caso */}
      <div 
        style={{ 
          flex: 1,
          padding: '32px', 
          backgroundColor: '#ffffff', 
          borderRadius: '16px', 
          border: '1px solid #e8e8e8',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#8e8e93' 
        }}
      >
        <div 
          style={{ 
            width: '72px', 
            height: '72px', 
            borderRadius: '50%', 
            backgroundColor: '#f5f7fa', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: '16px' 
          }}
        >
          <Icon f7="folder_badge_plus" size="36px" color="gray" />
        </div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '17px', fontWeight: '600', color: '#333' }}>
          Seguimiento de Caso
        </h3>
        <p style={{ fontSize: '14px', margin: 0, fontWeight: '400', maxWidth: '420px', textAlign: 'center', lineHeight: '1.5' }}>
          El expediente y seguimiento detallado de {client.name} se gestionará en este apartado.
        </p>
      </div>

    </div>
  );
};

