import { Block, Page } from 'framework7-react';
import { useApp } from '../context/AppContext';
import { ClientList } from '../components/Cliente/ClientList';
import { ClientDetails } from '../components/Cliente/ClientDetails';

export default function Cliente() {
  const { clients, selectedClient, setSelectedClientId } = useApp();

  return (
    <Page noNavbar noToolbar>
      <Block className="no-margin-top padding-top-half">
        <ClientList
          clients={clients}
          selectedClient={selectedClient}
          onSelectClient={(client) => setSelectedClientId(client.id)}
        />
        {selectedClient ? (
          <ClientDetails client={selectedClient} />
        ) : (
          <p className="text-color-gray">Selecciona un cliente para ver sus detalles</p>
        )}
      </Block>
    </Page>
  );
}
