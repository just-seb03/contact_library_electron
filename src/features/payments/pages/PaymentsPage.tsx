import { useState } from 'react';
import { Block, Page } from 'framework7-react';

// Importamos el contexto y componentes modulares
import { useApp } from '../../../core/context/AppContext';
import { PaymentsHeader } from '../components/pagosHeader';
import { PaymentsStats } from '../components/pagosStatistics';
import { PaymentsFilterBar } from '../components/pagosFilter';
import { PaymentsTable } from '../components/pagosTable';
import { RegisterPaymentButton } from '../components/pagosRegisterButton';

export default function PaymentsPage() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const { payments, updatePaymentStatus } = useApp();

  // Lógica de filtrado y estadísticas
  const filteredPayments = payments.filter((item) => {
    if (filter === 'completed') return item.status === 'completed';
    if (filter === 'pending') return item.status === 'pending' || item.status === 'overdue';
    return true;
  });

  const totalIngresos = payments
    .filter((p) => p.status === 'completed')
    .reduce((acc, p) => acc + p.amount, 0);

  const pendientesList = payments.filter((p) => p.status !== 'completed');
  const totalPendientes = pendientesList.reduce((acc, p) => acc + p.amount, 0);

  const handleRegisterPayment = () => {
    console.log("Abrir modal o navegar a creación de cobro...");
  };

  return (
    <Page noNavbar noToolbar>
      <Block className="no-margin-top padding-top-half">
        <PaymentsHeader />

        <PaymentsStats 
          totalIngresos={totalIngresos}
          totalPendientes={totalPendientes}
          cobrosPendientesCount={pendientesList.length}
          totalTransacciones={payments.length}
        />

        <PaymentsFilterBar 
          currentFilter={filter} 
          onFilterChange={setFilter} 
        />

        <PaymentsTable 
          payments={filteredPayments} 
          onStatusChange={updatePaymentStatus}
        />

        <RegisterPaymentButton onClick={handleRegisterPayment} />
      </Block>
    </Page>
  );
}