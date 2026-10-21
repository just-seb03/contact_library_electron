import { Page } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
import { ClientList } from '../components/ClientList';
import { ClientDetails } from '../components/ClientDetails';

export default function Cliente() {
  const { clients, selectedClient, setSelectedClientId } = useApp();

  return (
    <Page noNavbar noToolbar>
      <div
        className="display-flex padding"
        style={{
          height: '100%',
          boxSizing: 'border-box',
          gap: 16,
          backgroundColor: 'var(--app-color-background)',
          overflow: 'hidden',
        }}
      >
        {/* Panel izquierdo: Lista de clientes en tarjeta blanca flotante */}
        <div
          style={{
            width: 280,
            minWidth: 280,
            maxWidth: 280,
            height: '100%',
            backgroundColor: 'var(--app-color-white, #ffffff)',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
          }}
        >
          <ClientList
            clients={clients}
            selectedClient={selectedClient}
            onSelectClient={(client) => setSelectedClientId(client.id)}
          />
        </div>

        {/* Panel derecho: Detalle del cliente sobre el fondo de la app */}
        <div
          style={{
            flex: 1,
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {selectedClient ? (
            <ClientDetails client={selectedClient} />
          ) : (
            <div
              className="display-flex justify-content-center align-items-center"
              style={{
                height: '100%',
                backgroundColor: 'var(--app-color-white, #ffffff)',
                borderRadius: 16,
              }}
            >
              <p className="text-color-gray">Selecciona un cliente para ver sus detalles</p>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
