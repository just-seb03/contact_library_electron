import { useState } from 'react';
import { Page } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
import { ClientCardGrid } from '../components/ClientCardGrid';
import { ClientDetails } from '../components/ClientDetails';
import { AddClientPopup } from '../components/AddClientPopup';
import { RegisterPaymentPopup } from '../../payments/components/RegisterPaymentPopup';
import type { Client } from '../types';
import type { ClientDocument } from '../types';
import type { Payment } from '../../payments/types';
import {
  BACK_BUTTON_STYLE,
  PAGE_CONTENT_STYLE,
  PAGE_SCROLL_CONTENT_STYLE,
} from '../../../core/theme/style';

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

  const handleUploadDocument = (file: File): Promise<void> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string' || !selectedClient) {
        reject(new Error('No se pudo leer el documento.'));
        return;
      }
      const document: ClientDocument = {
        id: `document-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        dataUrl: reader.result,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };
      addClientDocument(selectedClient.id, document);
      resolve();
    };
    reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer el documento.'));
    reader.readAsDataURL(file);
  });

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

  const handleCloseClientPopup = () => {
    setIsAddClientOpen(false);
    setEditingClient(null);
  };

  return (
    <Page noNavbar noToolbar>
      <div style={PAGE_CONTENT_STYLE}>
        {showDetail && selectedClient ? (
          <>
            {/* Botón volver */}
            <div>
              <button
                type="button"
                style={BACK_BUTTON_STYLE}
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
            <div style={PAGE_SCROLL_CONTENT_STYLE}>
              <ClientDetails
                client={selectedClient}
                payments={payments.filter((payment) => (
                  payment.clientId === selectedClient.id
                  || (!payment.clientId && payment.client === selectedClient.name)
                ))}
                events={calendarEvents.filter((event) => event.clientId === selectedClient.id)}
                legacyHearing={hearings.find((hearing) => hearing.clientId === selectedClient.id) ?? null}
                onEdit={() => setEditingClient(selectedClient)}
                onDelete={() => deleteClient(selectedClient.id)}
                onEditPayment={(payment) => setEditingPayment(payment)}
                onDeletePayment={deletePayment}
                onUploadDocument={handleUploadDocument}
                onDeleteDocument={(document) => deleteClientDocument(selectedClient.id, document.id)}
              />
            </div>
          </>
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
