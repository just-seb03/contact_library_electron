import type { FC, CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import type { Client } from '../types';

interface ClientCardProps {
  client: Client;
  pendingSummary: string;
  onSelect: (client: Client) => void;
}

export const ClientCard: FC<ClientCardProps> = ({
  client,
  pendingSummary,
  onSelect,
}) => {
  const rowStyle: CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: '16px 22px',
    borderRadius: 14,
    backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.045))',
    border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.09))',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.14)',
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'transform 0.14s ease, background-color 0.14s ease, border-color 0.14s ease',
  };

  return (
    <button
      type="button"
      style={rowStyle}
      onClick={() => onSelect(client)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.backgroundColor = 'var(--macos-hover-bg, rgba(255, 255, 255, 0.075))';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.backgroundColor = 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.045))';
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          minWidth: 0,
          flex: 1,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 450,
            letterSpacing: '-0.01em',
            color: 'var(--macos-text, #ececef)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: 1.25,
          }}
        >
          {client.name}
        </span>

        <span
          style={{
            fontSize: 12.5,
            fontWeight: 400,
            color: 'var(--macos-text-secondary, #8e8e93)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {pendingSummary}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13.5,
            fontWeight: 450,
            color: 'var(--macos-text-secondary, #a4a4ab)',
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          <Icon f7="phone" size="13px" style={{ opacity: 0.7 }} />
          <span>{client.phone}</span>
        </span>

        <Icon
          f7="chevron_right"
          size="13px"
          style={{ color: 'var(--macos-text-secondary, #8e8e93)', opacity: 0.7 }}
        />
      </div>
    </button>
  );
};
