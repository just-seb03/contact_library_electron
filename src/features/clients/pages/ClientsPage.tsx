import { useState, useRef, useEffect, type CSSProperties } from 'react';
import { Page, Icon, f7 } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
import { ClientCardGrid } from '../components/ClientCardGrid';
import { ClientDetails } from '../components/ClientDetails';
import { AddClientPopup } from '../components/AddClientPopup';
import { RegisterPaymentPopup } from '../../payments/components/RegisterPaymentPopup';
import type { Client } from '../types';
import type { ClientDocument } from '../types';
import type { Payment } from '../../payments/types';
import { databaseService } from '../../../core/database/databaseService';
import { PAGE_SCROLL_CONTENT_STYLE } from '../../../core/theme/style';

const clientBackButtonStyle: CSSProperties = {
  width: 30,
  height: 30,
  minWidth: 30,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  borderRadius: 999,
  border: 'none',
  backgroundColor: 'transparent',
  color: 'var(--macos-text, #ececef)',
  cursor: 'pointer',
  opacity: 0.8,
  transition: 'opacity 0.12s ease, transform 0.12s ease',
};

const glassClientsContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: 'calc(100% - 32px)',
  maxWidth: 1080,
  height: 'calc(100vh - 82px)',
  minHeight: 320,
  margin: '12px auto 0 auto',
  borderRadius: 18,
  backgroundColor: 'var(--macos-subtle-bg, rgba(128, 128, 136, 0.06))',
  backdropFilter: 'blur(24px) saturate(160%)',
  WebkitBackdropFilter: 'blur(24px) saturate(160%)',
  border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.18))',
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.14)',
  boxSizing: 'border-box',
  overflow: 'hidden',
  maskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 120px), transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 120px), transparent 100%)',
};

export default function Cliente() {
  const {
    clients,
    selectedClient,
    payments,
    calendarEvents,
    hearings,
    setSelectedClientId,
    addClient,
    updateClient,
    deleteClient,
    updatePayment,
    deletePayment,
    addClientDocument,
    deleteClientDocument,
  } = useApp();
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [isClosingDetail, setIsClosingDetail] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const handleUploadDocument = (file: File): Promise<void> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result !== 'string' || !selectedClient) {
        reject(new Error('No se pudo leer el documento.'));
        return;
      }
      try {
        let document: ClientDocument = {
          id: `document-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          dataUrl: reader.result,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        };

        if (databaseService.isElectronDbAvailable()) {
          const uploaded = await databaseService.uploadDocument({
            clientId: selectedClient.id,
            name: file.name,
            dataUrl: reader.result,
            size: file.size,
          });
          if (uploaded) {
            document = uploaded;
          }
        }

        addClientDocument(selectedClient.id, document);
        resolve();
      } catch (err) {
        reject(err instanceof Error ? err : new Error('No se pudo guardar el documento.'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer el documento.'));
    reader.readAsDataURL(file);
  });

  // Si hay un cliente seleccionado mostramos su detalle,
  // si no mostramos la grilla de tarjetas.
  const showDetail = selectedClient !== null;

  const handleSelectClient = (client: Client) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsClosingDetail(false);
    setSelectedClientId(client.id);
  };

  const handleBack = () => {
    if (isClosingDetail) return;
    setIsClosingDetail(true);
    closeTimerRef.current = setTimeout(() => {
      setSelectedClientId(null);
      setIsClosingDetail(false);
      closeTimerRef.current = null;
    }, 180);
  };

  const handleCloseClientPopup = () => {
    setIsAddClientOpen(false);
    setEditingClient(null);
  };

  return (
    <Page noNavbar noToolbar>
      <style>{`
        @keyframes clientDetailIn {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes clientDetailOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(10px) scale(0.985);
          }
        }
        .client-detail-enter {
          animation: clientDetailIn 0.26s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .client-detail-exit {
          animation: clientDetailOut 0.18s cubic-bezier(0.4, 0, 1, 1) forwards;
          will-change: transform, opacity;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .client-detail-enter,
          .client-detail-exit {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
      <div style={glassClientsContainerStyle}>
        {showDetail && selectedClient ? (
          <div
            key={selectedClient.id}
            className={isClosingDetail ? 'client-detail-exit' : 'client-detail-enter'}
            style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '18px 24px 0 24px', boxSizing: 'border-box', gap: 14 }}
          >
            {/* Barra superior: Flecha volver + Eliminar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <button
                type="button"
                style={clientBackButtonStyle}
                onClick={handleBack}
                aria-label="Volver a clientes"
                title="Volver"
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateX(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <svg
                  width="9"
                  height="15"
                  viewBox="0 0 8 14"
                  fill="none"
                >
                  <path
                    d="M7 1L1 7L7 13"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                aria-label="Eliminar cliente"
                title="Eliminar cliente"
                onClick={() => {
                  f7.dialog.confirm(
                    `Se eliminará a ${selectedClient.name}, sus pagos y se desvinculará de sus eventos. Esta acción no se puede deshacer.`,
                    'Eliminar cliente',
                    () => deleteClient(selectedClient.id)
                  );
                }}
                style={{
                  width: 30,
                  height: 30,
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--macos-text-secondary, #a4a4ab)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Icon f7="trash" size="15px" />
              </button>
            </div>

            {/* Detalle del cliente seleccionado */}
            <div style={{ ...PAGE_SCROLL_CONTENT_STYLE, paddingBottom: 120 }}>
              <ClientDetails
                client={selectedClient}
                payments={payments.filter((payment) => (
                  payment.clientId === selectedClient.id
                  || (!payment.clientId && payment.client === selectedClient.name)
                ))}
                events={calendarEvents.filter((event) => event.clientId === selectedClient.id)}
                legacyHearing={hearings.find((hearing) => hearing.clientId === selectedClient.id) ?? null}
                onEditClient={() => setEditingClient(selectedClient)}
                onEditPayment={(payment) => setEditingPayment(payment)}
                onDeletePayment={deletePayment}
                onUploadDocument={handleUploadDocument}
                onDeleteDocument={(document) => deleteClientDocument(selectedClient.id, document.id)}
              />
            </div>
          </div>
        ) : (
          /* Grilla de tarjetas */
          <ClientCardGrid
            clients={clients}
            onSelectClient={handleSelectClient}
            onAddClient={() => setIsAddClientOpen(true)}
            payments={payments}
            events={calendarEvents}
          />
        )}
      </div>
      <AddClientPopup
        opened={isAddClientOpen || editingClient !== null}
        clients={clients}
        client={editingClient}
        onClose={handleCloseClientPopup}
        onAdd={addClient}
        onUpdate={updateClient}
      />
      <RegisterPaymentPopup
        opened={editingPayment !== null}
        clients={clients}
        payment={editingPayment}
        onClose={() => setEditingPayment(null)}
        onRegister={() => undefined}
        onUpdate={updatePayment}
      />
    </Page>
  );
}
