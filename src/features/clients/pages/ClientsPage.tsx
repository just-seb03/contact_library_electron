import { Page } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
import { ClientCardGrid } from '../components/ClientCardGrid';
import { ClientDetails } from '../components/ClientDetails';
import type { Client } from '../types';
import type { CSSProperties } from 'react';

export default function Cliente() {
  const { clients, selectedClient, setSelectedClientId } = useApp();

  // Si hay un cliente seleccionado mostramos su detalle,
  // si no mostramos la grilla de tarjetas.
  const showDetail = selectedClient !== null;

  const handleSelectClient = (client: Client) => {
    setSelectedClientId(client.id);
  };

  const handleBack = () => {
    // Deseleccionamos volviendo a la grilla
    setSelectedClientId(null);
  };

  const pageStyle: CSSProperties = {
    height: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'var(--app-color-background)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  const backBarStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 20px 6px 20px',
    flexShrink: 0,
  };

  const backBtnStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#007aff',
    fontSize: 15,
    fontWeight: 500,
    padding: '4px 0',
  };

  const detailScrollStyle: CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '0 16px 16px 16px',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <Page noNavbar noToolbar>
      <div style={pageStyle}>
        {showDetail && selectedClient ? (
          <>
            {/* Botón volver */}
            <div style={backBarStyle}>
              <button
                type="button"
                style={backBtnStyle}
                onClick={handleBack}
                aria-label="Volver a clientes"
              >
                <svg
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                  style={{ marginRight: 2 }}
                >
                  <path
                    d="M7 1L1 7L7 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Clientes
              </button>
            </div>

            {/* Detalle del cliente seleccionado */}
            <div style={detailScrollStyle}>
              <ClientDetails client={selectedClient} />
            </div>
          </>
        ) : (
          /* Grilla de tarjetas */
          <ClientCardGrid clients={clients} onSelectClient={handleSelectClient} />
        )}
      </div>
    </Page>
  );
}
