import { useState } from 'react';
import { Page, Block } from 'framework7-react';
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
];

export default function Cliente() {
  const [selectedClient, setSelectedClient] = useState<Client>(MOCK_CLIENTS[0]);

  return (
    <Page className="liquid-page">
      <Block style={{ marginTop: '60px', marginBottom: '24px' }}>
        <div className="row" style={{ height: 'calc(100vh - 100px)' }}>
          
          <div className="col-100 medium-35" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ClientList 
              clients={MOCK_CLIENTS} 
              selectedClient={selectedClient} 
              onSelectClient={setSelectedClient} 
            />
          </div>

          <div className="col-100 medium-65" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <ClientDetails client={selectedClient} />
          </div>

        </div>
      </Block>
    </Page>
  );
}
