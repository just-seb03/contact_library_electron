import { useState, type FC, type CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import type { Client } from '../types';
import { ClientCard } from './ClientCard';

interface ClientCardGridProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
}

export const ClientCardGrid: FC<ClientCardGridProps> = ({ clients, onSelectClient }) => {
  const [filterText, setFilterText] = useState('');

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(filterText.toLowerCase()) ||
      client.phone.includes(filterText) ||
      (client.email?.toLowerCase().includes(filterText.toLowerCase()) ?? false) ||
      (client.caso?.materia?.toLowerCase().includes(filterText.toLowerCase()) ?? false)
  );

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  };

  const topBarStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 20px 14px 20px',
    flexShrink: 0,
  };

  const titleRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
  };

  const titleStyle: CSSProperties = {
    fontSize: 22,
    fontWeight: 700,
    color: '#1c1c1e',
    lineHeight: 1.2,
  };

  const counterStyle: CSSProperties = {
    fontSize: 15,
    fontWeight: 500,
    color: '#8e8e93',
  };

  const searchWrapperStyle: CSSProperties = {
    padding: '0 20px 16px 20px',
    flexShrink: 0,
  };

  const searchInnerStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const searchIconStyle: CSSProperties = {
    position: 'absolute',
    left: 12,
    color: '#8e8e93',
    pointerEvents: 'none',
    zIndex: 1,
  };

  const searchInputStyle: CSSProperties = {
    width: '100%',
    height: 38,
    paddingLeft: 38,
    paddingRight: filterText.length > 0 ? 36 : 14,
    fontSize: 14,
    color: '#1c1c1e',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e5ea',
    borderRadius: 10,
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  };

  const clearBtnStyle: CSSProperties = {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#8e8e93',
  };

  const gridScrollStyle: CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '0 20px 20px 20px',
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 14,
  };

  const emptyStateStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    gap: 12,
    color: '#8e8e93',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      {/* Encabezado */}
      <div style={topBarStyle}>
        <div style={titleRowStyle}>
          <span style={titleStyle}>Clientes</span>
          <span style={counterStyle}>({filteredClients.length})</span>
        </div>
      </div>

      {/* Buscador */}
      <div style={searchWrapperStyle}>
        <div style={searchInnerStyle}>
          <Icon f7="search" size="16px" style={searchIconStyle} />
          <input
            type="text"
            placeholder="Buscar por nombre, correo, teléfono o tipo de caso…"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={searchInputStyle}
          />
          {filterText.length > 0 && (
            <button
              type="button"
              onClick={() => setFilterText('')}
              style={clearBtnStyle}
              title="Limpiar búsqueda"
              aria-label="Limpiar búsqueda"
            >
              <Icon f7="xmark_circle_fill" size="16px" />
            </button>
          )}
        </div>
      </div>

      {/* Grilla de tarjetas */}
      <div style={gridScrollStyle}>
        {filteredClients.length > 0 ? (
          <div style={gridStyle}>
            {filteredClients.map((client) => (
              <ClientCard key={client.id} client={client} onSelect={onSelectClient} />
            ))}
          </div>
        ) : (
          <div style={emptyStateStyle}>
            <Icon f7="person_2_slash" size="40px" style={{ color: '#c7c7cc' }} />
            <p style={{ margin: 0, fontSize: 14 }}>No se encontraron clientes</p>
          </div>
        )}
      </div>
    </div>
  );
};
