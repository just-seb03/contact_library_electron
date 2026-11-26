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

  const nameStyle: CSSProperties = {
    fontSize: 22,
    fontWeight: 550,
    letterSpacing: '-0.015em',
    color: 'var(--macos-text, #ececef)',
  };

  const contactInfoStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: 16,
    rowGap: 4,
    marginTop: 6,
    fontSize: 13,
    color: 'var(--macos-text-secondary, #a4a4ab)',
  };

  const contactItemStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    whiteSpace: 'nowrap',
  };

  return (
    <div style={bannerStyle}>
      <div style={nameStyle}>{client.name}</div>
      <div style={contactInfoStyle}>
        <span style={contactItemStyle}>
          <Icon f7="phone_fill" size="12px" style={{ opacity: 0.75 }} />
          <span>{client.phone}</span>
        </span>
        {hasValidEmail ? (
          <span style={contactItemStyle}>
            <Icon f7="envelope_fill" size="12px" style={{ opacity: 0.75 }} />
            <span>{client.email}</span>
          </span>
        ) : (
          <span style={{ ...contactItemStyle, fontStyle: 'italic', opacity: 0.7 }}>
            <Icon f7="envelope" size="12px" style={{ opacity: 0.7 }} />
            <span>Sin correo registrado</span>
          </span>
        )}
      </div>
    </div>
  );
};
