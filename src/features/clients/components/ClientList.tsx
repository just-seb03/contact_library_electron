import { useState, type FC, type CSSProperties } from 'react';
import { Icon, Link } from 'framework7-react';
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

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 16px 10px 16px',
  };

  const titleRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: 6,
  };

  const titleTextStyle: CSSProperties = {
    fontWeight: 700,
    fontSize: 18,
    color: '#1c1c1e',
  };

  const counterTextStyle: CSSProperties = {
    fontWeight: 500,
    fontSize: 14,
    color: '#8e8e93',
  };

  const actionsStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  };

  const searchBoxWrapperStyle: CSSProperties = {
    padding: '0 12px 10px 12px',
    position: 'relative',
    boxSizing: 'border-box',
  };

  const searchInputContainerStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const searchIconStyle: CSSProperties = {
    position: 'absolute',
    left: 10,
    color: '#8e8e93',
    pointerEvents: 'none',
  };

  const searchInputStyle: CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    height: 36,
    paddingLeft: 34,
    paddingRight: filterText.length > 0 ? 32 : 12,
    fontSize: 13,
    color: '#1c1c1e',
    backgroundColor: '#f2f2f7',
    border: 'none',
    borderRadius: 8,
    outline: 'none',
  };

  const clearButtonStyle: CSSProperties = {
    position: 'absolute',
    right: 6,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    padding: '4px 6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const listScrollStyle: CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: 8,
  };

  const emptyStateStyle: CSSProperties = {
    padding: 24,
    textAlign: 'center',
    color: '#8e8e93',
    fontSize: 13,
  };

  return (
    <div style={containerStyle}>
      {/* Cabecera con título y contador secundario entre paréntesis (Heurística #4 y #6) */}
      <div style={headerStyle}>
        <div style={titleRowStyle}>
          <span style={titleTextStyle}>Clientes</span>
          <span style={counterTextStyle}>({filteredClients.length})</span>
        </div>
        <div style={actionsStyle}>
          <span title="Filtrar clientes" style={{ display: 'inline-flex' }}>
            <Link
              iconF7="line_horizontal_3_decrease"
              iconSize="18px"
              className="text-color-gray"
              aria-label="Filtrar clientes"
            />
          </span>
          <span title="Agregar cliente" style={{ display: 'inline-flex' }}>
            <Link
              iconF7="plus"
              iconSize="18px"
              className="text-color-gray"
              aria-label="Agregar cliente"
            />
          </span>
        </div>
      </div>

      {/* Buscador con placeholder completo y botón condicional 'X' de limpieza (Heurística #3 y #6) */}
      <div style={searchBoxWrapperStyle}>
        <div style={searchInputContainerStyle}>
          <Icon f7="search" size="14px" style={searchIconStyle} />
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={searchInputStyle}
          />
          {filterText.length > 0 && (
            <button
              type="button"
              onClick={() => setFilterText('')}
              style={clearButtonStyle}
              title="Limpiar búsqueda"
              aria-label="Limpiar búsqueda"
            >
              <Icon f7="xmark_circle_fill" size="16px" style={{ color: '#8e8e93' }} />
            </button>
          )}
        </div>
      </div>

      {/* Listado con scroll vertical */}
      <div style={listScrollStyle}>
        {filteredClients.map((client) => (
          <ClientListItem
            key={client.id}
            client={client}
            isSelected={selectedClient?.id === client.id}
            onSelect={onSelectClient}
          />
        ))}

        {filteredClients.length === 0 && (
          <div style={emptyStateStyle}>No se encontraron clientes</div>
        )}
      </div>
    </div>
  );
};
