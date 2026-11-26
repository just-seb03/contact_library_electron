import { useState, type FC, type CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import type { Client } from '../types';
import { ClientCard } from './ClientCard';
import type { CalendarEvent } from '../../calendar/types';
import type { Payment } from '../../payments/types';

interface ClientCardGridProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onAddClient: () => void;
  payments?: Payment[];
  events?: CalendarEvent[];
}

function getLocalDateValue(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

export const ClientCardGrid: FC<ClientCardGridProps> = ({
  clients,
  onSelectClient,
  onAddClient,
  payments = [],
  events = [],
}) => {
  const [filterText, setFilterText] = useState('');
  const today = getLocalDateValue();

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(filterText.toLowerCase()) ||
      client.phone.includes(filterText) ||
      (client.email?.toLowerCase().includes(filterText.toLowerCase()) ?? false) ||
      (client.caso?.materia?.toLowerCase().includes(filterText.toLowerCase()) ?? false)
  );

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  };

  const topBarStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 24px 14px 24px',
    flexShrink: 0,
  };

  const titleRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
  };

  const titleStyle: CSSProperties = {
    fontSize: 22,
    fontWeight: 650,
    letterSpacing: '-0.02em',
    color: 'var(--macos-text, #ececef)',
    lineHeight: 1.2,
  };

  const counterStyle: CSSProperties = {
    fontSize: 13.5,
    fontWeight: 500,
    color: 'var(--macos-text-secondary, #8e8e93)',
    fontVariantNumeric: 'tabular-nums',
  };

  const addClientButtonStyle: CSSProperties = {
    width: 'auto',
    minWidth: 'auto',
    maxWidth: 'fit-content',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    height: 30,
    padding: '0 12px',
    border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.14))',
    borderRadius: 999,
    backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.06))',
    color: 'var(--macos-text, #ececef)',
    fontSize: 12,
    fontWeight: 550,
    cursor: 'pointer',
    flexShrink: 0,
    whiteSpace: 'nowrap',
    transition: 'background-color 0.12s ease',
  };

  const searchWrapperStyle: CSSProperties = {
    padding: '0 24px 16px 24px',
    flexShrink: 0,
  };

  const searchInnerStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const searchIconStyle: CSSProperties = {
    position: 'absolute',
    left: 14,
    color: 'var(--macos-text-secondary, #8e8e93)',
    pointerEvents: 'none',
    zIndex: 1,
  };

  const searchInputStyle: CSSProperties = {
    width: '100%',
    height: 40,
    paddingLeft: 40,
    paddingRight: filterText.length > 0 ? 38 : 14,
    fontSize: 13.5,
    color: 'var(--macos-text, #ececef)',
    backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.045))',
    border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.09))',
    borderRadius: 12,
    outline: 'none',
    boxSizing: 'border-box',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  };

  const clearBtnStyle: CSSProperties = {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    padding: 4,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--macos-text-secondary, #8e8e93)',
  };

  const listScrollStyle: CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '2px 24px 96px 24px',
    maskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 88px), transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 88px), transparent 100%)',
  };

  const listStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  };

  const emptyStateStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 56,
    gap: 12,
    color: 'var(--macos-text-secondary, #8e8e93)',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes clientRowEnter {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .client-row-anim {
          opacity: 0;
          animation: clientRowEnter 0.34s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .client-row-anim {
            opacity: 1;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Encabezado */}
      <div style={topBarStyle}>
        <div style={titleRowStyle}>
          <span style={titleStyle}>Clientes</span>
          <span style={counterStyle}>{filteredClients.length}</span>
        </div>
        <button
          type="button"
          onClick={onAddClient}
          style={addClientButtonStyle}
          title="Añadir cliente"
          aria-label="Añadir cliente"
        >
          <Icon f7="plus" size="14px" />
          <span>Nuevo cliente</span>
        </button>
      </div>

      {/* Buscador */}
      <div style={searchWrapperStyle}>
        <div style={searchInnerStyle}>
          <Icon f7="search" size="15px" style={searchIconStyle} />
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono…"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={searchInputStyle}
          />
          {filterText.length > 0 && (
            <button
              type="button"
              onClick={() => setFilterText('')}
              style={clearBtnStyle}
              title="Limpiar búsqueda"
              aria-label="Limpiar búsqueda"
            >
              <Icon f7="xmark_circle_fill" size="16px" />
            </button>
          )}
        </div>
      </div>

      {/* Lista de rectángulos */}
      <div style={listScrollStyle}>
        {filteredClients.length > 0 ? (
          <div style={listStyle}>
            {filteredClients.map((client, index) => {
              const pendingPaymentsCount = payments.filter(
                (p) =>
                  (p.clientId === client.id || (!p.clientId && p.client === client.name)) &&
                  (p.status === 'pending' || p.status === 'overdue')
              ).length;
              const upcomingEventsCount = events.filter(
                (e) => e.clientId === client.id && e.date >= today
              ).length;
              const hasHearing = Boolean(client.caso?.proximaAudiencia);
              const totalAgenda = upcomingEventsCount + (hasHearing ? 1 : 0);

              let pendingSummary = 'Sin pendientes';
              if (pendingPaymentsCount > 0 && totalAgenda > 0) {
                pendingSummary = 'Pagos y eventos pendientes';
              } else if (pendingPaymentsCount > 0) {
                pendingSummary =
                  pendingPaymentsCount === 1
                    ? '1 pago pendiente'
                    : `${pendingPaymentsCount} pagos pendientes`;
              } else if (totalAgenda > 0) {
                pendingSummary =
                  totalAgenda === 1
                    ? '1 evento próximo'
                    : `${totalAgenda} eventos próximos`;
              }

              return (
                <div
                  key={client.id}
                  className="client-row-anim"
                  style={{ animationDelay: `${Math.min(index * 28, 220)}ms` }}
                >
                  <ClientCard
                    client={client}
                    pendingSummary={pendingSummary}
                    onSelect={onSelectClient}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div style={emptyStateStyle}>
            <Icon f7="person_2" size="36px" style={{ opacity: 0.6 }} />
            <p style={{ margin: 0, fontSize: 13.5 }}>No se encontraron clientes</p>
          </div>
        )}
      </div>
    </div>
  );
};
