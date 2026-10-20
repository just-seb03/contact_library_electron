import type { FC } from 'react';
import { Badge, Card, CardContent, Icon, List, ListItem } from 'framework7-react';
import type { Client } from './types';

interface ClientBannerProps {
  client: Client;
}

const statusLabels: Record<string, string> = {
  activo: 'Activo',
  en_proceso: 'En proceso',
  completado: 'Completado',
};

export const ClientBanner: FC<ClientBannerProps> = ({ client }) => (
  <Card>
    <CardContent>
      <div className="display-flex align-items-center">
        <Icon f7="person_crop_circle_fill" size="32px" />
        <div className="margin-left">
          <h2>{client.name}</h2>
          {client.status && <Badge color="blue">{statusLabels[client.status] ?? client.status}</Badge>}
        </div>
        <Badge className="margin-left">ID #{client.id}</Badge>
      </div>
      <List>
        <ListItem title={client.phone}>
          <Icon slot="media" f7="phone_fill" />
        </ListItem>
        {client.email && (
          <ListItem title={client.email}>
            <Icon slot="media" f7="envelope_fill" />
          </ListItem>
        )}
      </List>
    </CardContent>
  </Card>
);
