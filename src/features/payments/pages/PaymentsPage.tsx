import { useState } from 'react';
import { Page } from 'framework7-react';

import { useApp } from '../../../core/context/AppContext';
import { PaymentsHeader } from '../components/pagosHeader';
import { PaymentsStats } from '../components/pagosStatistics';
import { PaymentsFilterBar } from '../components/pagosFilter';
import type { PaymentFilters } from '../components/pagosFilter';
import { PaymentsTable } from '../components/pagosTable';
import { RegisterPaymentPopup } from '../components/RegisterPaymentPopup';
import type { Payment } from '../types';
import { PAGE_CONTENT_STYLE } from '../../../core/theme/style';

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

  return (
    <Page noNavbar noToolbar>
      <div style={PAGE_CONTENT_STYLE}>
        <PaymentsHeader onRegisterPayment={() => setIsRegisterPopupOpen(true)} />
        <PaymentsStats
          totalIngresos={totalIngresos}
          totalPendientes={totalPendientes}
          totalVencidos={totalVencidos}
        />
        <PaymentsFilterBar
          onApplyFilters={setFilters}
        />
        <PaymentsTable
          payments={filteredPayments}
          onEdit={setEditingPayment}
          onDelete={deletePayment}
        />
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