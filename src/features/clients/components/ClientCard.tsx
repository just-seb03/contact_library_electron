import type { FC, CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import type { Client } from '../types';
import type { CalendarEvent } from '../../calendar/types';
import type { Payment } from '../../payments/types';

interface ClientCardProps {
  client: Client;
  onSelect: (client: Client) => void;
  payment?: Payment | null;
  event?: CalendarEvent | null;
}

export const ClientCard: FC<ClientCardProps> = ({ client, onSelect }) => {
  const rowStyle: CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: '18px 22px',
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
      <span
        style={{
          fontSize: 18,
          fontWeight: 650,
          letterSpacing: '-0.015em',
          color: 'var(--macos-text, #ececef)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
          flex: 1,
        }}
      >
        {client.name}
      </span>

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
            fontWeight: 500,
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
