import { List, ListItem, Icon, Card } from 'framework7-react';
import { Client } from './types';

type ClientListProps = {
  clients: Client[];
  selectedClient: Client | null;
  onSelectClient: (client: Client) => void;
};

export const ClientList = ({ clients, selectedClient, onSelectClient }: ClientListProps) => {
  return (
    <Card style={{ margin: 0, height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      {/* Buscador superior y herramientas */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fff' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '6px 12px' }}>
          <Icon f7="search" size="16px" color="gray" />
          <input 
            type="text" 
            placeholder="Filtro de búsqueda" 
            style={{ border: 'none', background: 'transparent', width: '100%', marginLeft: '8px', outline: 'none', fontSize: '14px', color: '#333' }} 
          />
        </div>
        <div style={{ display: 'flex', gap: '16px', marginLeft: '20px' }}>
          <Icon f7="line_horizontal_3_decrease" size="20px" color="gray" style={{ cursor: 'pointer' }} />
          <Icon f7="plus" size="20px" color="gray" style={{ cursor: 'pointer' }} />
          <Icon f7="ellipsis_vertical" size="20px" color="gray" style={{ cursor: 'pointer' }} />
        </div>
      </div>

      {/* Lista de clientes scrolleable */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <List mediaList style={{ margin: 0 }}>
          {clients.map(c => {
            const isSelected = selectedClient?.id === c.id;
            return (
              <ListItem 
                key={c.id}
                title={c.name}
                onClick={() => onSelectClient(c)}
                style={{ 
                  backgroundColor: isSelected ? '#f0f8ff' : '#fff', 
                  borderLeft: isSelected ? '4px solid #0056b3' : '4px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderBottom: '1px solid #f5f5f5',
                  padding: '8px 0'
                }}
              >
              </ListItem>
            );
          })}
        </List>
      </div>
    </Card>
  );
};
