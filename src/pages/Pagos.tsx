import React, { useState } from 'react';
import { Page } from 'framework7-react';

// Importamos los componentes modulares y el tipo
import { Payment } from '../components/Pagos/types';
import { PaymentsHeader } from '../components/Pagos/pagosHeader';
import { PaymentsStats } from '../components/Pagos/pagosStatistics';
import { PaymentsFilterBar } from '../components/Pagos/pagosFilter';
import { PaymentsTable } from '../components/Pagos/pagosTable';
import { RegisterPaymentButton } from '../components/Pagos/pagosRegisterButton';

export default function PaymentsPage() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Datos simulados (estado)
  const [payments] = useState<Payment[]>([
    { id: '1', client: 'El manzano', concept: 'Asesoría Mensual', amount: 450.00, date: '10 Oct, 2026', status: 'completed' },
    { id: '2', client: 'Sebastian Bastian', concept: 'Desarrollo de Modulo', amount: 1200.00, date: '14 Oct, 2026', status: 'pending' },
    { id: '3', client: 'MaxiMaxi', concept: 'Mantenimiento de Agenda', amount: 300.00, date: '05 Oct, 2026', status: 'overdue' },
    { id: '4', client: 'No se guardo', concept: 'Consulta Individual', amount: 80.00, date: '11 Oct, 2026', status: 'completed' },
  ]);

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
    <Page style={styles.pageContainer}>
      <div style={styles.wrapper}>
        
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

        <PaymentsTable payments={filteredPayments} />

        <RegisterPaymentButton onClick={handleRegisterPayment} />
        
      </div>
    </Page>
  );
}

// Estilos reducidos solo para el layout contenedor principal
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    background: 'transparent',
    overflowY: 'auto',
    height: '100%',
  },
  wrapper: {
    padding: '24px 32px',
    maxWidth: '1100px',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
};