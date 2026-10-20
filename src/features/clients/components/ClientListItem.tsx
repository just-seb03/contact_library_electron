import type { FC } from 'react';
import { Icon, ListItem } from 'framework7-react';
import type { Client } from '../types';
import { formatCLP } from '../../../core/utils/format';

interface ClientListItemProps {
  client: Client;
  isSelected: boolean;
  onSelect: (client: Client) => void;
}

export const ClientListItem: FC<ClientListItemProps> = ({ client, isSelected, onSelect }) => (
  <ListItem
    title={client.name}
    subtitle={client.pago ? `${client.pago.concepto} · ${formatCLP(client.pago.monto)}` : client.phone}
    className={isSelected ? 'item-selected' : ''}
    link="#"
    onClick={() => onSelect(client)}
  >
    <Icon slot="media" f7="person_fill" />
  </ListItem>
);
