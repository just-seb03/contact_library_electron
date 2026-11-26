import type { FC, CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import type { Client } from '../types';

interface ClientBannerProps {
  client: Client;
}

const isInvalidEmail = (email?: string): boolean => {
  if (!email) return true;
  const clean = email.trim().toLowerCase();
  return clean === '' || clean === 'sin_registro@consultorio.cl';
};

export const ClientBanner: FC<ClientBannerProps> = ({ client }) => {
  const hasValidEmail = !isInvalidEmail(client.email);

  const bannerStyle: CSSProperties = {
    backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.045))',
    border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.09))',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
    borderRadius: 16,
    padding: '20px 24px',
    color: 'var(--macos-text, #ececef)',
  };

  const topRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  };

  const profileAreaStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flex: '1 1 240px',
    minWidth: 0,
  };

  const profileTextStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const avatarStyle: CSSProperties = {
    width: 44,
    height: 44,
    minWidth: 44,
    borderRadius: '50%',
    backgroundColor: 'var(--macos-active-bg, rgba(128, 128, 136, 0.2))',
    border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.25))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const nameRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--macos-text, #ececef)',
  };

  const contactInfoStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: 16,
    rowGap: 4,
    marginTop: 4,
    fontSize: 13,
    color: 'var(--macos-text-secondary, #a4a4ab)',
  };

  const contactItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  };

  const emailItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    minWidth: 0,
    maxWidth: '100%',
    overflowWrap: 'anywhere',
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
    color: 'var(--macos-text-secondary, #a4a4ab)',
    opacity: 0.85,
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: 0.5,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  };

  return (
    <div style={bannerStyle}>
      <div style={topRowStyle}>
        <div style={profileAreaStyle}>
          <div style={avatarStyle}>
            <Icon f7="person_fill" size="22px" style={{ color: 'var(--macos-text, #ececef)' }} />
          </div>
          <div style={profileTextStyle}>
            <div style={nameRowStyle}>
              <span>{client.name}</span>
            </div>
            <div style={contactInfoStyle}>
              <span style={contactItemStyle}>
                <Icon f7="phone_fill" size="12px" style={{ color: 'var(--macos-text-secondary, #a4a4ab)' }} />
                {client.phone}
              </span>
              {hasValidEmail ? (
                <span style={emailItemStyle}>
                  <Icon f7="envelope_fill" size="12px" style={{ color: 'var(--macos-text-secondary, #a4a4ab)' }} />
                  {client.email}
                </span>
              ) : (
                <span style={noEmailTextStyle}>
                  <Icon f7="envelope" size="12px" style={{ color: 'var(--macos-text-secondary, #8e8e93)', opacity: 0.7 }} />
                  Sin correo registrado
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={actionsStyle}>
          <span style={idBadgeStyle}>ID #{client.id}</span>
        </div>
      </div>
    </div>
  );
};
