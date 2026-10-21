import type { FC, CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import type { Client } from '../types';
import { formatCLP } from '../../../core/utils/format';

interface ClientListItemProps {
  client: Client;
  isSelected: boolean;
  onSelect: (client: Client) => void;
}

export const ClientListItem: FC<ClientListItemProps> = ({ client, isSelected, onSelect }) => {
  const itemContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 12px',
    margin: '3px 8px',
    borderRadius: 10,
    cursor: 'pointer',
    listStyle: 'none',
    boxSizing: 'border-box',
    backgroundColor: isSelected ? 'var(--app-color-primary, #007aff)' : 'transparent',
  };

  const avatarWrapperStyle: CSSProperties = {
    width: 34,
    height: 34,
    minWidth: 34,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 122, 255, 0.1)',
  };

  const textColumnStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const nameStyle: CSSProperties = {
    fontSize: 14,
    fontWeight: isSelected ? 600 : 500,
    color: isSelected ? '#ffffff' : '#1c1c1e',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: 1.25,
  };

  const detailsRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 3,
  };

  const serviceNameStyle: CSSProperties = {
    fontSize: 12,
    color: isSelected ? 'rgba(255, 255, 255, 0.85)' : '#8e8e93',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
  };

  const priceStyle: CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: isSelected ? 'rgba(255, 255, 255, 0.95)' : '#1c1c1e',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  };

  const fallbackSubtitleStyle: CSSProperties = {
    fontSize: 12,
    color: isSelected ? 'rgba(255, 255, 255, 0.85)' : '#8e8e93',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginTop: 3,
  };

  return (
    <div
      style={itemContainerStyle}
      onClick={() => onSelect(client)}
      title={`Seleccionar a ${client.name}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(client);
        }
      }}
    >
      <div style={avatarWrapperStyle}>
        <Icon
          f7="person_fill"
          size="18px"
          color={isSelected ? 'white' : 'blue'}
        />
      </div>

      <div style={textColumnStyle}>
        <div style={nameStyle}>{client.name}</div>
        {client.pago ? (
          <div style={detailsRowStyle}>
            <span style={serviceNameStyle}>{client.pago.concepto}</span>
            <span style={priceStyle}>{formatCLP(client.pago.monto)}</span>
          </div>
        ) : (
          <div style={fallbackSubtitleStyle}>{client.phone}</div>
        )}
      </div>
    </div>
  );
};
