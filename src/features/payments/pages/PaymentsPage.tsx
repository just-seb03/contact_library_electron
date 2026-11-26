import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Icon, Page } from 'framework7-react';

import { useApp } from '../../../core/context/AppContext';
import { useNavigationFocus } from '../../../navigation/useNavigationFocus';
import { fuzzyScore } from '../../../core/utils/fuzzySearch';
import { PaymentsStats } from '../components/pagosStatistics';
import { PaymentsTable } from '../components/pagosTable';
import { RegisterPaymentPopup } from '../components/RegisterPaymentPopup';
import type { Payment } from '../types';

/** Tiempo que la fila de un pago queda resaltada al abrirse desde una notificación. */
const PAYMENT_HIGHLIGHT_MS = 4000;

type PaymentStatusTab = 'all' | Payment['status'];

const STATUS_TABS: { id: PaymentStatusTab; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'completed', label: 'Cobrados' },
  { id: 'pending', label: 'Pendientes' },
  { id: 'overdue', label: 'Vencidos' },
];

export default function PaymentsPage() {
  const {
    clients,
    payments,
    registerPayment,
    updatePayment,
    deletePayment,
  } = useApp();
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [statusTab, setStatusTab] = useState<PaymentStatusTab>('all');
  const [searchText, setSearchText] = useState('');
  const [highlightedPaymentId, setHighlightedPaymentId] = useState<string | null>(null);

  // Apertura desde fuera de la página (clic en una notificación): resaltar la fila del pago.
  useNavigationFocus('payment', ({ id }) => {
    if (!payments.some((payment) => payment.id === id)) return false;
    setStatusTab('all');
    setSearchText('');
    setHighlightedPaymentId(id);
    return true;
  });

  useEffect(() => {
    if (!highlightedPaymentId) return;
    const timer = setTimeout(() => setHighlightedPaymentId(null), PAYMENT_HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [highlightedPaymentId]);

  const totalIngresos = useMemo(
    () => payments.filter((p) => p.status === 'completed').reduce((acc, p) => acc + p.amount, 0),
    [payments]
  );

  const totalPendientes = useMemo(
    () => payments.filter((p) => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0),
    [payments]
  );

  const totalVencidos = useMemo(
    () => payments.filter((p) => p.status === 'overdue').reduce((acc, p) => acc + p.amount, 0),
    [payments]
  );

  const filteredPayments = useMemo(() => {
    const byStatus = statusTab === 'all'
      ? payments
      : payments.filter((p) => p.status === statusTab);

    if (!searchText.trim()) return byStatus;

    return byStatus
      .map((payment) => ({
        payment,
        score: fuzzyScore(searchText, [
          payment.client,
          payment.concept,
          String(payment.amount),
          payment.date,
        ]),
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.payment);
  }, [payments, statusTab, searchText]);

  const rootWrapperStyle: CSSProperties = {
    height: 'calc(100vh - 58px)',
    width: '100%',
    maxWidth: 1080,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    overflow: 'hidden',
    maskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 120px), transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 120px), transparent 100%)',
  };

  const tabHeaderStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 24px 6px',
    flexShrink: 0,
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

  const scrollWrapperStyle: CSSProperties = {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    padding: '10px 24px 120px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    boxSizing: 'border-box',
  };

  const searchBarRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  };

  const searchInputStyle: CSSProperties = {
    width: '100%',
    height: 40,
    paddingLeft: 40,
    paddingRight: searchText.length > 0 ? 38 : 14,
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

  const addButtonStyle: CSSProperties = {
    width: 'auto',
    minWidth: 'auto',
    maxWidth: 'fit-content',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 0,
    height: 36,
    padding: '0 4px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--macos-text, #ececef)',
    fontSize: 12.5,
    fontWeight: 500,
    cursor: 'pointer',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  };

  return (
    <Page noNavbar noToolbar>
      <style>{`
        @keyframes payEnter {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes payFilterSwitch {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.992);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .pay-anim {
          opacity: 0;
          animation: payEnter 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .pay-filter-anim {
          animation: payFilterSwitch 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .add-pay-label {
          display: inline-block;
          overflow: hidden;
          max-width: 0;
          margin-right: 0;
          opacity: 0;
          transform: translateX(8px);
          transition: max-width 0.22s cubic-bezier(0.16, 1, 0.3, 1),
            margin-right 0.22s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.18s ease,
            transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
        }
        .add-pay-btn:hover .add-pay-label,
        .add-pay-btn:focus-visible .add-pay-label {
          max-width: 120px;
          margin-right: 6px;
          opacity: 0.85;
          transform: translateX(0);
        }
        .add-pay-btn .add-pay-plus {
          opacity: 0.78;
          transition: opacity 0.15s ease, transform 0.18s ease;
        }
        .add-pay-btn:hover .add-pay-plus {
          opacity: 1;
          transform: rotate(90deg);
        }
        @media (prefers-reduced-motion: reduce) {
          .pay-anim,
          .pay-filter-anim {
            opacity: 1;
            animation: none !important;
            transform: none !important;
          }
          .add-pay-label {
            transition: none !important;
          }
        }
      `}</style>

      <div style={rootWrapperStyle}>
        <div style={tabHeaderStyle}>
          <div style={tabSwitcherStyle} role="tablist" aria-label="Filtrar pagos por estado">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={statusTab === tab.id}
                onClick={() => setStatusTab(tab.id)}
                style={tabButtonStyle(statusTab === tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={scrollWrapperStyle}>
          <div className="pay-anim" style={{ animationDelay: '30ms' }}>
            <PaymentsStats
              totalIngresos={totalIngresos}
              totalPendientes={totalPendientes}
              totalVencidos={totalVencidos}
            />
          </div>

          <div className="pay-anim" style={{ ...searchBarRowStyle, animationDelay: '75ms' }}>
            <div style={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Icon
                f7="search"
                size="15px"
                style={{
                  position: 'absolute',
                  left: 14,
                  color: 'var(--macos-text-secondary, #8e8e93)',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              />
              <input
                type="text"
                placeholder="Buscar por cliente, concepto o monto…"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={searchInputStyle}
              />
              {searchText.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearchText('')}
                  title="Limpiar búsqueda"
                  aria-label="Limpiar búsqueda"
                  style={{
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
                  }}
                >
                  <Icon f7="xmark_circle_fill" size="16px" />
                </button>
              )}
            </div>

            <button
              type="button"
              className="add-pay-btn"
              onClick={() => setIsRegisterPopupOpen(true)}
              style={addButtonStyle}
              title="Registrar pago"
              aria-label="Registrar pago"
            >
              <span className="add-pay-label">Registrar pago</span>
              <Icon f7="plus" size="17px" className="add-pay-plus" />
            </button>
          </div>

          <div key={`${statusTab}-${filteredPayments.length}`} className="pay-filter-anim">
            <PaymentsTable
              payments={filteredPayments}
              highlightedPaymentId={highlightedPaymentId}
              onEdit={setEditingPayment}
              onDelete={deletePayment}
            />
          </div>
        </div>
      </div>

      <RegisterPaymentPopup
        opened={isRegisterPopupOpen || editingPayment !== null}
        clients={clients}
        payment={editingPayment}
        onClose={() => {
          setIsRegisterPopupOpen(false);
          setEditingPayment(null);
        }}
        onRegister={registerPayment}
        onUpdate={updatePayment}
      />
    </Page>
  );
}
