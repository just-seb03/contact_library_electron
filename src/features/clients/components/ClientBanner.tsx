import type { FC, CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import type { Client } from '../types';

interface ClientBannerProps {
  client: Client;
  onEdit?: () => void;
}

const isInvalidEmail = (email?: string): boolean => {
  if (!email) return true;
  const clean = email.trim().toLowerCase();
  return clean === '' || clean === 'sin_registro@consultorio.cl';
};

export const ClientBanner: FC<ClientBannerProps> = ({ client, onEdit }) => {
  const hasValidEmail = !isInvalidEmail(client.email);

  const bannerStyle: CSSProperties = {
    position: 'relative',
    backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.045))',
    border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.09))',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.14)',
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
    borderRadius: 16,
    padding: '18px 22px',
    color: 'var(--macos-text, #ececef)',
    userSelect: 'text',
    WebkitUserSelect: 'text',
  };

  const headerRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  };

  const nameStyle: CSSProperties = {
    fontSize: 22,
    fontWeight: 500,
    letterSpacing: '-0.015em',
    color: 'var(--macos-text, #ececef)',
    minWidth: 0,
  };

  const contactInfoStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: 18,
    rowGap: 6,
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
      <div style={headerRowStyle}>
        <div style={nameStyle}>{client.name}</div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label="Editar cliente"
            title="Editar cliente"
            style={{
              width: 28,
              height: 28,
              padding: 0,
              border: 'none',
              background: 'transparent',
              color: 'var(--macos-text-secondary, #a4a4ab)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              opacity: 0.78,
              transition: 'opacity 0.12s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.78';
            }}
          >
            <Icon f7="pencil" size="14px" />
          </button>
        )}
      </div>

      <div style={contactInfoStyle}>
        <span style={contactItemStyle}>
          <Icon f7="phone" size="12px" style={{ opacity: 0.75 }} />
          <span>{client.phone}</span>
        </span>
        {hasValidEmail && (
          <span style={contactItemStyle}>
            <Icon f7="envelope" size="12px" style={{ opacity: 0.75 }} />
            <span>{client.email}</span>
          </span>
        )}
        {client.rut && (
          <span style={contactItemStyle}>
            <Icon f7="person_text_rectangle" size="12px" style={{ opacity: 0.75 }} />
            <span>{client.rut}</span>
          </span>
        )}
      </div>
    </div>
  );
};
