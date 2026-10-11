import { useState } from 'react';
import { List, ListItem, Icon, Card } from 'framework7-react';
import { Client } from './types';

type ClientListProps = {
  clients: Client[];
  selectedClient: Client | null;
  onSelectClient: (client: Client) => void;
};

export const ClientList = ({ clients, selectedClient, onSelectClient }: ClientListProps) => {
  const [filterText, setFilterText] = useState('');

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(filterText.toLowerCase()) ||
    c.phone.includes(filterText)
  );

  return (
    <Card 
      style={{ 
        margin: 0, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: '16px', 
        overflow: 'hidden', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        border: '1px solid #e8e8e8',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Buscador superior y herramientas */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fff' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: '#f4f5f7', borderRadius: '10px', padding: '8px 12px' }}>
          <Icon f7="search" size="16px" color="gray" />
          <input 
            type="text" 
            placeholder="Filtro de búsqueda" 
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ border: 'none', background: 'transparent', width: '100%', marginLeft: '8px', outline: 'none', fontSize: '13px', color: '#333' }} 
          />
          {filterText && (
            <span 
              onClick={() => setFilterText('')} 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Icon f7="xmark_circle_fill" size="14px" color="gray" />
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '14px', marginLeft: '14px' }}>
          <Icon f7="line_horizontal_3_decrease" size="18px" color="gray" style={{ cursor: 'pointer' }} />
          <Icon f7="plus" size="18px" color="gray" style={{ cursor: 'pointer' }} />
          <Icon f7="ellipsis_vertical" size="18px" color="gray" style={{ cursor: 'pointer' }} />
        </div>
      </div>

      {/* Lista de clientes scrolleable */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <List mediaList style={{ margin: 0 }}>
          {filteredClients.map((c) => {
            const isSelected = selectedClient?.id === c.id;
            return (
              <ListItem 
                key={c.id}
                title={c.name}
                onClick={() => onSelectClient(c)}
                style={{ 
                  backgroundColor: isSelected ? '#edf5ff' : '#fff', 
                  borderLeft: isSelected ? '4px solid #0056b3' : '4px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  borderBottom: '1px solid #f2f2f5',
                  padding: '6px 0',
                  fontWeight: isSelected ? '600' : '400',
                }}
              >
              </ListItem>
            );
          })}
          {filteredClients.length === 0 && (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
              No se encontraron clientes
            </div>
          )}
        </List>
      </div>
    </Card>
  );
};

