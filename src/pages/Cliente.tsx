import { useState } from 'react';
import { Page } from 'framework7-react';
import { Client } from '../components/Cliente/types';
import { ClientList } from '../components/Cliente/ClientList';
import { ClientDetails } from '../components/Cliente/ClientDetails';

const MOCK_CLIENTS: Client[] = [
  { id: 1, name: 'Juan Pérez García', phone: '+34 612 345 678' },
  { id: 2, name: 'María Gómez López', phone: '+34 689 123 456' },
  { id: 3, name: 'Carlos Rodríguez', phone: '+34 655 987 654' },
  { id: 4, name: 'Ana Martínez', phone: '+34 677 111 222' },
  { id: 5, name: 'Luis Fernando Torres', phone: '+34 633 444 555' },
  { id: 6, name: 'Sofía Castro', phone: '+34 699 888 777' },
  { id: 7, name: 'Alejandro Morales', phone: '+34 622 333 444' },
  { id: 8, name: 'Elena Navarro', phone: '+34 644 555 666' },
  { id: 9, name: 'David Romero', phone: '+34 666 777 888' },
  { id: 10, name: 'Carmen Delgado', phone: '+34 678 999 000' },
];

export default function Cliente() {
  const [selectedClient, setSelectedClient] = useState<Client>(MOCK_CLIENTS[0]);

  return (
    <Page className="liquid-page" pageContent={false}>
      <div 
        className="page-content" 
        style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          height: '100%', 
          padding: '70px 20px 20px 8px', 
          boxSizing: 'border-box', 
          gap: '16px',
          overflow: 'hidden' 
        }}
      >
        {/* Columna Izquierda: Clientes a la izquierda (a la derecha de LeftBar, casi pegados) */}
        <div style={{ width: '320px', minWidth: '280px', maxWidth: '360px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <ClientList 
            clients={MOCK_CLIENTS} 
            selectedClient={selectedClient} 
            onSelectClient={setSelectedClient} 
          />
        </div>

        {/* Columna Derecha: A la derecha de los clientes, título azul con nombre/teléfono arriba y detalles debajo */}
        <div style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <ClientDetails client={selectedClient} />
        </div>
      </div>
    </Page>
  );
}

