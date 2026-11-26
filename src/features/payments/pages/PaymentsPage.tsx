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
  { id: 'all', label: 'todos' },
  { id: 'pending', label: 'pendientes' },
  { id: 'overdue', label: 'vencidos' },
  { id: 'completed', label: 'pagados' },
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

  const completedPayments = useMemo(
    () => payments.filter((p) => p.status === 'completed'),
    [payments]
  );
  const pendingPayments = useMemo(
    () => payments.filter((p) => p.status === 'pending'),
    [payments]
  );
  const overduePayments = useMemo(
    () => payments.filter((p) => p.status === 'overdue'),
    [payments]
  );

  const totalIngresos = useMemo(
    () => completedPayments.reduce((acc, p) => acc + p.amount, 0),
    [completedPayments]
  );
  const totalPendientes = useMemo(
    () => pendingPayments.reduce((acc, p) => acc + p.amount, 0),
    [pendingPayments]
  );
  const totalVencidos = useMemo(
    () => overduePayments.reduce((acc, p) => acc + p.amount, 0),
    [overduePayments]
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
    margin: 0,
    padding: '20px 24px 0 16px',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 260px',
    gap: 36,
    boxSizing: 'border-box',
    overflow: 'hidden',
    maskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 120px), transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 120px), transparent 100%)',
  };

  const rightColumnStatsStyle: CSSProperties = {
    paddingTop: 8,
    minWidth: 0,
  };

  const leftColumnListStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    minHeight: 0,
  };

  const pivotHeaderStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: 22,
    paddingBottom: 14,
    flexShrink: 0,
    userSelect: 'none',
    overflowX: 'auto',
  };

  const pivotTabStyle = (active: boolean): CSSProperties => ({
    width: 'auto',
    minWidth: 'auto',
    padding: 0,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
    fontSize: 22,
    fontWeight: 400,
    cursor: 'pointer',
    color: 'var(--macos-text, #ececef)',
    opacity: active ? 1 : 0.36,
    transition: 'opacity 0.16s ease',
    whiteSpace: 'nowrap',
  });

  const searchBarRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 10,
    flexShrink: 0,
  };

  const searchInputStyle: CSSProperties = {
    width: '100%',
    height: 38,
    paddingLeft: 38,
    paddingRight: searchText.length > 0 ? 36 : 12,
    fontSize: 13.5,
    color: 'var(--macos-text, #ececef)',
    backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.04))',
    border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.08))',
    borderRadius: 10,
    outline: 'none',
    boxSizing: 'border-box',
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

  const listScrollStyle: CSSProperties = {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    paddingBottom: 130,
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
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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
        @media (max-width: 780px) {
          .payments-metro-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
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

      <div className="payments-metro-grid" style={rootWrapperStyle}>
        {/* Izquierda: Pivot estilo Windows Phone + Buscador fuzzy + Lista limpia */}
        <div style={leftColumnListStyle}>
          <div className="pay-anim" style={{ ...pivotHeaderStyle, animationDelay: '30ms' }} role="tablist" aria-label="Filtrar pagos por estado">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={statusTab === tab.id}
                onClick={() => setStatusTab(tab.id)}
                style={pivotTabStyle(statusTab === tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pay-anim" style={{ ...searchBarRowStyle, animationDelay: '65ms' }}>
            <div style={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Icon
                f7="search"
                size="14px"
                style={{
                  position: 'absolute',
                  left: 13,
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
                  <Icon f7="xmark_circle_fill" size="15px" />
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

          <div style={listScrollStyle}>
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

        {/* Derecha: Pendientes en grande arriba, Vencidos y Pagados debajo más pequeños */}
        <div className="pay-anim" style={{ ...rightColumnStatsStyle, animationDelay: '50ms' }}>
          <PaymentsStats
            totalIngresos={totalIngresos}
            totalPendientes={totalPendientes}
            totalVencidos={totalVencidos}
          />
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
