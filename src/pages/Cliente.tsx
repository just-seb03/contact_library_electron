import type { CSSProperties } from 'react';
import { Page } from 'framework7-react';
import { useApp } from '../context/AppContext';
import { ClientList } from '../components/Cliente/ClientList';
import { ClientDetails } from '../components/Cliente/ClientDetails';

export default function Cliente() {
  const { clients, selectedClient, setSelectedClientId } = useApp();

  return (
    <Page className="liquid-page" pageContent={false} style={{ background: 'transparent' }}>
      <div className="page-content" style={styles.pageContent}>
        {/* Columna Izquierda: Directorio de Clientes */}
        <div style={styles.leftColumn}>
          <ClientList 
            clients={clients} 
            selectedClient={selectedClient} 
            onSelectClient={(c) => setSelectedClientId(c.id)} 
          />
        </div>

        {/* Columna Derecha: Detalles del Cliente y Seguimiento de Caso */}
        <div style={styles.rightColumn}>
          {selectedClient ? (
            <ClientDetails client={selectedClient} />
          ) : (
            <div style={{ color: 'rgba(0,0,0,0.4)', padding: '24px' }}>
              Selecciona un cliente para ver sus detalles
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}

const styles: Record<string, CSSProperties> = {
  pageContent: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    padding: '70px 24px 24px 12px',
    boxSizing: 'border-box',
    gap: '18px',
    overflow: 'hidden',
    background: 'transparent',
  },
  leftColumn: {
    width: '340px',
    minWidth: '300px',
    maxWidth: '380px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  rightColumn: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
};
