import { useState, type FC, type CSSProperties } from 'react';
import { Badge, Link, List, Searchbar } from 'framework7-react';
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

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 16px 8px 16px',
  };

  const titleRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const actionsStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  };

  const listContainerStyle: CSSProperties = {
    flex: 1,
    overflowY: 'auto',
  };

  return (
    <>
      {/* Cabecera: "Clientes (N)" + botones filtro y agregar */}
      <div style={headerStyle}>
        <div style={titleRowStyle}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Clientes</span>
          <Badge color="blue">{filteredClients.length}</Badge>
        </div>
        <div style={actionsStyle}>
          <Link
            iconF7="line_horizontal_3_decrease"
            iconSize="18px"
            className="text-color-gray"
            aria-label="Filtrar clientes"
          />
          <Link
            iconF7="plus"
            iconSize="18px"
            className="text-color-gray"
            aria-label="Agregar cliente"
          />
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="padding-horizontal" style={{ paddingBottom: 4 }}>
        <Searchbar
          inline
          customSearch
          clearButton
          placeholder="Buscar por nombre, teléfono..."
          value={filterText}
          onInput={(event) => setFilterText((event.target as HTMLInputElement).value)}
        />
      </div>

      {/* Lista de clientes */}
      <div style={listContainerStyle}>
        <List
          mediaList
          strongIos={false}
          outlineIos={false}
          dividersIos={false}
          className="no-margin-top no-margin-bottom"
        >
          {filteredClients.map((client) => (
            <ClientListItem
              key={client.id}
              client={client}
              isSelected={selectedClient?.id === client.id}
              onSelect={onSelectClient}
            />
          ))}
          {filteredClients.length === 0 && (
            <div className="text-align-center padding">
              <p className="text-color-gray">No se encontraron clientes</p>
            </div>
          )}
        </List>
      </div>
    </>
  );
};
