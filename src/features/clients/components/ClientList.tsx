import { useState, type FC } from 'react';
import { BlockTitle, Button, Card, Icon, List, Searchbar } from 'framework7-react';
import type { Client } from '../types';
import { ClientListItem } from './ClientListItem';

interface ClientListProps {
  clients: Client[];
  selectedClient: Client | null;
  onSelectClient: (client: Client) => void;
}

export const ClientList: FC<ClientListProps> = ({ clients, selectedClient, onSelectClient }) => {
  const [filterText, setFilterText] = useState('');
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(filterText.toLowerCase())
    || client.phone.includes(filterText)
    || (client.email?.toLowerCase().includes(filterText.toLowerCase()) ?? false)
  );

  return (
    <Card>
      <BlockTitle>
        Clientes ({filteredClients.length})
        <Button slot="after" small aria-label="Agregar cliente">
          <Icon f7="plus" />
        </Button>
      </BlockTitle>
      <Searchbar
        inline
        customSearch
        clearButton
        placeholder="Buscar por nombre, teléfono..."
        value={filterText}
        onInput={(event) => setFilterText((event.target as HTMLInputElement).value)}
      />
      <List mediaList>
        {filteredClients.map((client) => (
          <ClientListItem
            key={client.id}
            client={client}
            isSelected={selectedClient?.id === client.id}
            onSelect={onSelectClient}
          />
        ))}
        {filteredClients.length === 0 && (
          <p className="text-align-center text-color-gray">No se encontraron clientes</p>
        )}
      </List>
    </Card>
  );
};
