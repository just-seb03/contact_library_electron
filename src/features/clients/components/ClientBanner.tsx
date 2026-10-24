import type { FC, CSSProperties } from 'react';
import { Badge, Icon } from 'framework7-react';
import type { Client, ClientStatus } from '../types';
import { APP_COLORS } from '../../../core/theme/style';

interface ClientBannerProps {
  client: Client;
}

const statusLabels: Record<ClientStatus, string> = {
  activo: 'Activo',
  en_proceso: 'En Proceso',
  completado: 'Completado',
};

const statusColors: Record<ClientStatus, string> = {
  activo: 'green',
  en_proceso: 'blue',
  completado: 'gray',
};

const isInvalidEmail = (email?: string): boolean => {
  if (!email) return true;
  const clean = email.trim().toLowerCase();
  return clean === '' || clean === 'sin_registro@consultorio.cl';
};

export const ClientBanner: FC<ClientBannerProps> = ({ client }) => {
  const hasValidEmail = !isInvalidEmail(client.email);

  const bannerStyle: CSSProperties = {
    background: `linear-gradient(135deg, ${APP_COLORS.primaryStrong} 0%, ${APP_COLORS.primaryLight} 100%)`,
    borderRadius: 16,
    padding: '20px 24px',
    color: APP_COLORS.white,
  };

  const topRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  };

  const profileAreaStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 0,
  };

  const avatarStyle: CSSProperties = {
    width: 44,
    height: 44,
    minWidth: 44,
    borderRadius: '50%',
    backgroundColor: APP_COLORS.whiteOverlay,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const nameRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 20,
    fontWeight: 700,
    color: APP_COLORS.white,
  };

  const contactInfoStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
    fontSize: 13,
    color: APP_COLORS.whiteTextMuted,
  };

  const contactItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  };

  const noEmailTextStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontStyle: 'italic',
    opacity: 0.75,
    fontSize: 13,
  };

  const actionsStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  /** Texto sutil sin fondo ni píldora para no confundir con botones (Heurística #4) */
  const idBadgeStyle: CSSProperties = {
    color: APP_COLORS.white,
    opacity: 0.85,
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: 0.5,
  };

  return (
    <div style={bannerStyle}>
      <div style={topRowStyle}>
        <div style={profileAreaStyle}>
          <div style={avatarStyle}>
            <Icon f7="person_fill" size="24px" style={{ color: APP_COLORS.white }} />
          </div>
          <div>
            <div style={nameRowStyle}>
              <span>{client.name}</span>
              {client.status && (
                <Badge
                  color={statusColors[client.status] ?? 'blue'}
                  style={{ fontSize: 11, fontWeight: 600 }}
                >
                  {statusLabels[client.status] ?? client.status}
                </Badge>
              )}
            </div>
            <div style={contactInfoStyle}>
              <span style={contactItemStyle}>
                <Icon f7="phone_fill" size="12px" style={{ color: APP_COLORS.whiteTextMuted }} />
                {client.phone}
              </span>
              {hasValidEmail ? (
                <span style={contactItemStyle}>
                  <Icon f7="envelope_fill" size="12px" style={{ color: APP_COLORS.whiteTextMuted }} />
                  {client.email}
                </span>
              ) : (
                <span style={noEmailTextStyle}>
                  <Icon f7="envelope" size="12px" style={{ color: APP_COLORS.whiteTextFaint }} />
                  Sin correo registrado
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={actionsStyle}>
          {/* Identificador informativo sutil */}
          <span style={idBadgeStyle}>ID #{client.id}</span>
        </div>
      </div>
    </div>
  );
};
