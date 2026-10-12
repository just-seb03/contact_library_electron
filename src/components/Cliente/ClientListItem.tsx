import { useState } from 'react';
import type { CSSProperties, FC } from 'react';
import { Icon } from 'framework7-react';
import { Client } from './types';
import { formatCLP } from '../../utils/format';

interface ClientListItemProps {
  client: Client;
  isSelected: boolean;
  onSelect: (client: Client) => void;
}

export const ClientListItem: FC<ClientListItemProps> = ({
  client,
  isSelected,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  let itemStyle: CSSProperties = {
    ...styles.baseItem,
  };

  if (isSelected) {
    itemStyle = {
      ...itemStyle,
      background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.92) 0%, rgba(0, 90, 220, 0.98) 100%)',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.45)',
      boxShadow: '0 6px 18px rgba(0, 122, 255, 0.32), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
      transform: isHovered ? 'translateY(-2px)' : 'none',
    };
  } else if (isHovered) {
    itemStyle = {
      ...itemStyle,
      background: 'rgba(255, 255, 255, 0.85)',
      color: '#1d1d1f',
      border: '1px solid rgba(255, 255, 255, 0.9)',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
      transform: 'translateY(-2px)',
    };
  }

  return (
    <div
      className="client-list-item"
      onClick={() => onSelect(client)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={itemStyle}
    >
      {/* Avatar circular */}
      <div 
        style={{
          ...styles.avatar,
          backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 122, 255, 0.08)',
          border: isSelected ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(0, 122, 255, 0.15)',
        }}
      >
        <Icon 
          f7="person_fill" 
          size="16px" 
          color={isSelected ? 'white' : 'blue'} 
        />
      </div>

      {/* Datos del cliente */}
      <div style={styles.textContainer}>
        <div style={{ ...styles.name, color: isSelected ? '#ffffff' : 'inherit' }}>
          {client.name}
        </div>
        <div style={{ ...styles.phone, color: isSelected ? 'rgba(255, 255, 255, 0.85)' : '#86868b' }}>
          {client.pago ? `${client.pago.concepto} · ${formatCLP(client.pago.monto)}` : client.phone}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  baseItem: {
    margin: '6px 8px',
    padding: '10px 14px',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.42)',
    border: '1px solid rgba(255, 255, 255, 0.65)',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: '14px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    letterSpacing: '-0.2px',
  },
  phone: {
    fontSize: '12px',
    marginTop: '2px',
  },
};
