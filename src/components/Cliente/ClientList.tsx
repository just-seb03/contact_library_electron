import { useState } from 'react';
import type { CSSProperties, FC } from 'react';
import { Card, Icon, Button, Searchbar, Badge } from 'framework7-react';
import { Client } from './types';
import { ClientListItem } from './ClientListItem';

interface ClientListProps {
  clients: Client[];
  selectedClient: Client | null;
  onSelectClient: (client: Client) => void;
}

export const ClientList: FC<ClientListProps> = ({
  clients,
  selectedClient,
  onSelectClient,
}) => {
  const [filterText, setFilterText] = useState('');

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(filterText.toLowerCase()) ||
    c.phone.includes(filterText) ||
    (c.email && c.email.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <Card 
      outline={false}
      className="no-border margin-horizontal-none margin-vertical-none elevation-2"
      style={styles.cardContainer}
    >
      {/* Encabezado del Directorio */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <div style={styles.titleWithBadge}>
            <span style={styles.titleText}>Clientes</span>
            <Badge color="blue" style={styles.badge}>
              {filteredClients.length}
            </Badge>
          </div>

          <div style={styles.headerButtons}>
            <Button 
              round 
              small 
              className="display-flex align-items-center justify-content-center"
              style={styles.toolBtn}
              tooltip="Filtrar"
            >
              <Icon f7="line_horizontal_3_decrease" size="15px" color="gray" />
            </Button>
            <Button 
              round 
              small 
              className="display-flex align-items-center justify-content-center"
              style={styles.toolBtn}
              tooltip="Nuevo Cliente"
            >
              <Icon f7="plus" size="15px" color="gray" />
            </Button>
          </div>
        </div>

        {/* Buscador nativo Framework7 con Glassmorphism y backdrop desactivado */}
        <div style={styles.searchbarContainer}>
          <Searchbar
            inline
            customSearch
            disableButton={false}
            clearButton
            backdrop={false}
            placeholder="Buscar por nombre, teléfono..."
            value={filterText}
            onInput={(e) => setFilterText((e.target as HTMLInputElement).value)}
            style={styles.searchbar}
          />
        </div>
      </div>

      {/* Lista de clientes scrolleable con diseño cristalino */}
      <div style={styles.listContainer}>
        {filteredClients.map((client) => (
          <ClientListItem
            key={client.id}
            client={client}
            isSelected={selectedClient?.id === client.id}
            onSelect={onSelectClient}
          />
        ))}

        {filteredClients.length === 0 && (
          <div style={styles.emptyResults}>
            <Icon f7="person_crop_circle_badge_exclamation" size="36px" color="gray" style={{ opacity: 0.5, marginBottom: '8px' }} />
            <div>No se encontraron clientes</div>
          </div>
        )}
      </div>
    </Card>
  );
};

const styles: Record<string, CSSProperties> = {
  cardContainer: {
    margin: 0,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(25px) saturate(190%)',
    WebkitBackdropFilter: 'blur(25px) saturate(190%)',
    border: '1px solid rgba(255, 255, 255, 0.65)',
    borderRadius: '24px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },
  header: {
    padding: '16px 14px 12px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWithBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  titleText: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1d1d1f',
    letterSpacing: '-0.3px',
  },
  badge: {
    fontSize: '11px',
    fontWeight: 700,
    padding: '2px 8px',
  },
  headerButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  toolBtn: {
    width: '30px',
    height: '30px',
    minWidth: '30px',
    padding: 0,
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.75)',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  searchbarContainer: {
    width: '100%',
  },
  searchbar: {
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(15px) saturate(180%)',
    WebkitBackdropFilter: 'blur(15px) saturate(180%)',
    borderRadius: '18px',
    border: '1px solid rgba(255, 255, 255, 0.75)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '6px 4px',
  },
  emptyResults: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 16px',
    color: '#86868b',
    fontSize: '13px',
    textAlign: 'center',
  },
};
