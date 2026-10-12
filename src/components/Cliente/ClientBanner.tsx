import type { CSSProperties, FC } from 'react';
import { Icon } from 'framework7-react';
import { Client } from './types';

interface ClientBannerProps {
  client: Client;
}

export const ClientBanner: FC<ClientBannerProps> = ({ client }) => {
  return (
    <div style={styles.bannerContainer}>
      {/* Información del cliente */}
      <div style={styles.clientInfoWrapper}>
        <div style={styles.avatarBox}>
          <Icon f7="person_crop_circle_fill" size="32px" color="white" />
        </div>

        <div>
          <div style={styles.nameRow}>
            <h2 style={styles.clientName}>
              {client.name}
            </h2>
            {client.status && (
              <span style={getStatusBadgeStyle(client.status)}>
                {getStatusLabel(client.status)}
              </span>
            )}
          </div>

          <div style={styles.contactRow}>
            <div style={styles.contactItem}>
              <Icon f7="phone_fill" size="13px" />
              <span>{client.phone}</span>
            </div>
            {client.email && (
              <div style={styles.contactItem}>
                <Icon f7="envelope_fill" size="13px" />
                <span>{client.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ID del cliente */}
      <div style={styles.actionsWrapper}>
        <span style={styles.idBadge}>
          ID #{client.id}
        </span>
      </div>
    </div>
  );
};

const getStatusBadgeStyle = (status: string): CSSProperties => {
  const base: CSSProperties = {
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.3px',
    display: 'inline-flex',
    alignItems: 'center',
  };
  if (status === 'activo') {
    return { ...base, backgroundColor: 'rgba(52, 199, 89, 0.25)', color: '#a7f3d0' };
  }
  if (status === 'en_proceso') {
    return { ...base, backgroundColor: 'rgba(255, 159, 10, 0.25)', color: '#fde68a' };
  }
  return { ...base, backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' };
};

const getStatusLabel = (status: string) => {
  if (status === 'activo') return 'Activo';
  if (status === 'en_proceso') return 'En Proceso';
  return 'Completado';
};

const styles: Record<string, CSSProperties> = {
  bannerContainer: {
    flexShrink: 0,
    background: 'linear-gradient(135deg, rgba(0, 114, 235, 0.9) 0%, rgba(0, 75, 195, 0.96) 100%)',
    color: '#fff',
    padding: '20px 24px',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 10px 30px rgba(0, 80, 180, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.35)',
    backdropFilter: 'blur(25px) saturate(190%)',
    WebkitBackdropFilter: 'blur(25px) saturate(190%)',
  },
  clientInfoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  avatarBox: {
    width: '54px',
    height: '54px',
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  clientName: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 700,
    letterSpacing: '-0.3px',
    color: '#ffffff',
  },
  contactRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.88)',
    fontWeight: 500,
    marginTop: '4px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  actionsWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  idBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: '6px 14px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.3px',
    border: '1px solid rgba(255, 255, 255, 0.25)',
  },
};
