import { useEffect, useState } from 'react';
import { Page } from 'framework7-react';

import { useApp } from '../../../core/context/AppContext';
import { useNavigationFocus } from '../../../navigation/useNavigationFocus';
import { PaymentsHeader } from '../components/pagosHeader';
import { PaymentsStats } from '../components/pagosStatistics';
import { PaymentsFilterBar } from '../components/pagosFilter';
import type { PaymentFilters } from '../components/pagosFilter';
import { PaymentsTable } from '../components/pagosTable';
import { RegisterPaymentPopup } from '../components/RegisterPaymentPopup';
import type { Payment } from '../types';
import { PAGE_CONTENT_STYLE } from '../../../core/theme/style';

/** Tiempo que la fila de un pago queda resaltada al abrirse desde una notificación. */
const PAYMENT_HIGHLIGHT_MS = 4000;

function parsePaymentDate(value: string): Date | null {
  const match = value.match(/^(\d{1,2})\s+([A-Za-z]{3}),\s+(\d{4})$/);
  const date = match
    ? new Date(`${match[2]} ${match[1]}, ${match[3]}`)
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

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
  const [filters, setFilters] = useState<PaymentFilters>({
    invoiceId: '',
    startDate: '',
    endDate: '',
  });
  const [highlightedPaymentId, setHighlightedPaymentId] = useState<string | null>(null);

  // Apertura desde fuera de la página (clic en una notificación): resaltar la fila del pago.
  useNavigationFocus('payment', ({ id }) => {
    if (!payments.some((payment) => payment.id === id)) return false;
    setHighlightedPaymentId(id);
    return true;
  });

  useEffect(() => {
    if (!highlightedPaymentId) return;
    const timer = setTimeout(() => setHighlightedPaymentId(null), PAYMENT_HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [highlightedPaymentId]);

  const totalIngresos = payments
    .filter((p) => p.status === 'completed')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalPendientes = payments
    .filter((p) => p.status === 'pending')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalVencidos = payments
    .filter((p) => p.status === 'overdue')
    .reduce((acc, p) => acc + p.amount, 0);

  const filteredPayments = payments.filter((payment) => {
    const matchesId =
      !filters.invoiceId.trim() ||
      payment.id.toLocaleLowerCase('es-CL').includes(filters.invoiceId.trim().toLocaleLowerCase('es-CL'));
    const paymentDate = parsePaymentDate(payment.date);
    const startDate = filters.startDate ? new Date(`${filters.startDate}T00:00:00`) : null;
    const endDate = filters.endDate ? new Date(`${filters.endDate}T23:59:59.999`) : null;
    const matchesStartDate = !startDate || (paymentDate !== null && paymentDate >= startDate);
    const matchesEndDate = !endDate || (paymentDate !== null && paymentDate <= endDate);

    return matchesId && matchesStartDate && matchesEndDate;
  });

  const filterKey = `${filters.invoiceId}-${filters.startDate}-${filters.endDate}-${filteredPayments.length}`;

  return (
    <Page noNavbar noToolbar>
      <style>{`
        @keyframes payEnter {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes payFilterSwitch {
          from {
            opacity: 0;
            transform: translateY(6px) scale(0.992);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .pay-anim {
          opacity: 0;
          animation: payEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .pay-filter-anim {
          animation: payFilterSwitch 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .pay-anim,
          .pay-filter-anim {
            opacity: 1;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
      <div
        style={{
          ...PAGE_CONTENT_STYLE,
          height: 'calc(100vh - 58px)',
          padding: '12px 24px 84px 24px',
          overflowY: 'auto',
          maskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 88px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 88px), transparent 100%)',
        }}
      >
        <div className="pay-anim" style={{ animationDelay: '40ms' }}>
          <PaymentsHeader onRegisterPayment={() => setIsRegisterPopupOpen(true)} />
        </div>
        <div className="pay-anim" style={{ animationDelay: '90ms' }}>
          <PaymentsStats
            totalIngresos={totalIngresos}
            totalPendientes={totalPendientes}
            totalVencidos={totalVencidos}
          />
        </div>
        <div className="pay-anim" style={{ animationDelay: '140ms' }}>
          <PaymentsFilterBar
            onApplyFilters={setFilters}
          />
        </div>
        <div key={filterKey} className="pay-filter-anim">
          <PaymentsTable
            payments={filteredPayments}
            highlightedPaymentId={highlightedPaymentId}
            onEdit={setEditingPayment}
            onDelete={deletePayment}
          />
        </div>
      </div>
      <RegisterPaymentPopup
        opened={isRegisterPopupOpen}
        clients={clients}
        onClose={() => setIsRegisterPopupOpen(false)}
        onRegister={registerPayment}
      />
      <RegisterPaymentPopup
        opened={editingPayment !== null}
        clients={clients}
        payment={editingPayment}
        onClose={() => setEditingPayment(null)}
        onRegister={registerPayment}
        onUpdate={updatePayment}
      />
    </Page>
  );
}