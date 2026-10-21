import type { FC, CSSProperties } from 'react';
import { Icon, ListItem } from 'framework7-react';
import type { Client } from '../types';
import { formatCLP } from '../../../core/utils/format';

interface ClientListItemProps {
  client: Client;
  isSelected: boolean;
  onSelect: (client: Client) => void;
}

export const ClientListItem: FC<ClientListItemProps> = ({ client, isSelected, onSelect }) => {
  const selectedStyle: CSSProperties = isSelected
    ? {
        backgroundColor: 'var(--app-color-primary, #007aff)',
        borderRadius: 10,
        margin: '2px 8px',
      }
    : {
        borderRadius: 10,
        margin: '2px 8px',
      };

  const titleStyle: CSSProperties = isSelected
    ? { color: '#ffffff', fontWeight: 600 }
    : { fontWeight: 500 };

  const subtitleStyle: CSSProperties = isSelected
    ? { color: 'rgba(255,255,255,0.8)', fontSize: 12 }
    : { color: '#8e8e93', fontSize: 12 };

  const iconColor = isSelected ? 'white' : 'blue';

  return (
    <ListItem
      link="#"
      noChevron
      onClick={() => onSelect(client)}
      style={selectedStyle}
    >
      <Icon
        slot="media"
        f7="person_fill"
        size="20px"
        color={iconColor}
        style={{
          backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,122,255,0.1)',
          borderRadius: 8,
          width: 34,
          height: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
      <div slot="inner" style={{ padding: '6px 0' }}>
        <div style={titleStyle}>{client.name}</div>
        <div style={subtitleStyle}>
          {client.pago ? `${client.pago.concepto} · ${formatCLP(client.pago.monto)}` : client.phone}
        </div>
      </div>
    </ListItem>
  );
};
