import type { FC, CSSProperties } from 'react';
import { Badge, Icon } from 'framework7-react';
import type { Client } from '../types';

interface ClientBannerProps {
  client: Client;
}

const statusLabels: Record<string, string> = {
  activo: 'Activo',
  en_proceso: 'En Proceso',
  completado: 'Completado',
};

const statusColors: Record<string, string> = {
  activo: 'green',
  en_proceso: 'blue',
  completado: 'gray',
};

export const ClientBanner: FC<ClientBannerProps> = ({ client }) => {
  const bannerStyle: CSSProperties = {
    background: 'linear-gradient(135deg, #0a84ff 0%, #30b0ff 100%)',
    borderRadius: 16,
    padding: '20px 24px',
    margin: 0,
    color: '#ffffff',
  };

  const topRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const profileAreaStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  };

  const avatarStyle: CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const nameStyle: CSSProperties = {
    fontSize: 20,
    fontWeight: 700,
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const contactInfoStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    marginTop: 4,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  };

  const contactItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  };

  const actionsStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const idBadgeStyle: CSSProperties = {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#ffffff',
    borderRadius: 20,
    padding: '4px 14px',
    fontSize: 13,
    fontWeight: 600,
  };

  const actionBtnStyle: CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={bannerStyle}>
      <div style={topRowStyle}>
        <div style={profileAreaStyle}>
          <div style={avatarStyle}>
            <Icon f7="person_fill" size="24px" style={{ color: '#ffffff' }} />
          </div>
          <div>
            <div style={nameStyle}>
              {client.name}
              {client.status && (
                <Badge color={statusColors[client.status] ?? 'blue'} style={{ fontSize: 11, fontWeight: 600 }}>
                  {statusLabels[client.status] ?? client.status}
                </Badge>
              )}
            </div>
            <div style={contactInfoStyle}>
              <span style={contactItemStyle}>
                <Icon f7="phone_fill" size="12px" style={{ color: 'rgba(255,255,255,0.9)' }} />
                {client.phone}
              </span>
              {client.email && (
                <span style={contactItemStyle}>
                  <Icon f7="envelope_fill" size="12px" style={{ color: 'rgba(255,255,255,0.9)' }} />
                  {client.email}
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={actionsStyle}>
          <span style={idBadgeStyle}>ID #{client.id}</span>
          <div style={actionBtnStyle}>
            <Icon f7="phone_fill" size="16px" style={{ color: '#ffffff' }} />
          </div>
          <div style={actionBtnStyle}>
            <Icon f7="envelope_fill" size="16px" style={{ color: '#ffffff' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
