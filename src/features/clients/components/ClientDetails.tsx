import { useState, type FC, type CSSProperties } from 'react';
import type { Client, ClientDocument } from '../types';
import { ClientBanner } from './ClientBanner';
import { ClientCaseDetails } from './ClientCaseDetails';
import { ClientActivityDetails } from './ClientActivityDetails';
import { ClientDocumentsSection } from './ClientDocumentsSection';
import type { Payment } from '../../payments/types';
import type { CalendarEvent } from '../../calendar/types';
import type { HearingEvent } from '../../../core/context/types';

type ClientDetailTab = 'expediente' | 'pagos' | 'agenda' | 'documentos';

const CLIENT_DETAIL_TABS: { id: ClientDetailTab; label: string }[] = [
  { id: 'expediente', label: 'Expediente' },
  { id: 'pagos', label: 'Pagos' },
  { id: 'agenda', label: 'Agenda' },
  { id: 'documentos', label: 'Documentos' },
];

interface ClientDetailsProps {
  client: Client;
  payments: Payment[];
  events: CalendarEvent[];
  legacyHearing: HearingEvent | null;
  onEditClient: () => void;
  onEditPayment: (payment: Payment) => void;
  onDeletePayment: (payment: Payment) => void;
  onUploadDocument: (file: File) => Promise<void>;
  onDeleteDocument: (document: ClientDocument) => void;
}

export const ClientDetails: FC<ClientDetailsProps> = ({
  client,
  payments,
  events,
  legacyHearing,
  onEditClient,
  onEditPayment,
  onDeletePayment,
  onUploadDocument,
  onDeleteDocument,
}) => {
  const [activeTab, setActiveTab] = useState<ClientDetailTab>('expediente');

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxWidth: 720,
    width: '100%',
    margin: '0 auto',
    paddingBottom: 16,
    userSelect: 'text',
    WebkitUserSelect: 'text',
  };

  const tabRowStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
  };

  const tabSwitcherStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: 3,
    borderRadius: 999,
    backgroundColor: 'var(--macos-subtle-bg, rgba(128, 128, 136, 0.1))',
    border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.18))',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    userSelect: 'none',
  };

  const tabButtonStyle = (active: boolean): CSSProperties => ({
    width: 'auto',
    minWidth: 'auto',
    padding: '5px 16px',
    borderRadius: 999,
    border: 'none',
    outline: 'none',
    fontSize: 12.5,
    fontWeight: active ? 600 : 500,
    cursor: 'pointer',
    backgroundColor: active ? 'var(--macos-active-bg, #323237)' : 'transparent',
    color: active ? 'var(--macos-text, #ececef)' : 'var(--macos-text-muted, #888890)',
    boxShadow: active ? '0 1px 4px rgba(0, 0, 0, 0.14)' : 'none',
    transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
    whiteSpace: 'nowrap',
  });

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes clientTabFade {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .client-tab-anim {
          animation: clientTabFade 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .client-tab-anim {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <ClientBanner client={client} onEdit={onEditClient} />

      <div style={tabRowStyle}>
        <div style={tabSwitcherStyle} role="tablist" aria-label="Secciones del cliente">
          {CLIENT_DETAIL_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={tabButtonStyle(activeTab === tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div key={activeTab} className="client-tab-anim">
        {activeTab === 'expediente' && <ClientCaseDetails client={client} />}
        {activeTab === 'pagos' && (
          <ClientActivityDetails
            payments={payments}
            events={events}
            legacyHearing={legacyHearing}
            onEditPayment={onEditPayment}
            onDeletePayment={onDeletePayment}
            section="payments"
          />
        )}
        {activeTab === 'agenda' && (
          <ClientActivityDetails
            payments={payments}
            events={events}
            legacyHearing={legacyHearing}
            onEditPayment={onEditPayment}
            onDeletePayment={onDeletePayment}
            section="agenda"
          />
        )}
        {activeTab === 'documentos' && (
          <ClientDocumentsSection
            documents={client.documentos ?? []}
            onUpload={onUploadDocument}
            onDelete={onDeleteDocument}
          />
        )}
      </div>
    </div>
  );
};
