import React, { useState } from 'react';
import { Page } from 'framework7-react';

interface Payment {
  id: string;
  client: string;
  concept: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'overdue';
}

export default function PaymentsPage() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Datos simulados de cobros/pagos de la agenda
  const [payments] = useState<Payment[]>([
    { id: '1', client: 'El manzano', concept: 'Asesoría Mensual', amount: 450.00, date: '10 Oct, 2026', status: 'completed' },
    { id: '2', client: 'Sebastian Bastian', concept: 'Desarrollo de Modulo', amount: 1200.00, date: '14 Oct, 2026', status: 'pending' },
    { id: '3', client: 'MaxiMaxi', concept: 'Mantenimiento de Agenda', amount: 300.00, date: '05 Oct, 2026', status: 'overdue' },
    { id: '4', client: 'No se guardo', concept: 'Consulta Individual', amount: 80.00, date: '11 Oct, 2026', status: 'completed' },
  ]);

  const filteredPayments = payments.filter((item) => {
    if (filter === 'completed') return item.status === 'completed';
    if (filter === 'pending') return item.status === 'pending' || item.status === 'overdue';
    return true;
  });

  const totalIngresos = payments
    .filter((p) => p.status === 'completed')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalPendientes = payments
    .filter((p) => p.status !== 'completed')
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <Page style={styles.pageContainer}>
      <div style={styles.wrapper}>
        
        {/* Encabezado */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Gestión de Pagos</h1>
            <p style={styles.subtitle}>Control de honorarios, cobranzas y facturación</p>
          </div>
        </header>

        {/* Tarjetas Estadísticas Glassmorphism */}
        <section style={styles.statsGrid}>
          <div style={styles.glassCard}>
            <span style={styles.cardLabel}>Ingresos Cobrados</span>
            <div style={{ ...styles.cardValue, color: '#10b981' }}>${totalIngresos.toFixed(2)}</div>
            <span style={styles.cardSubtext}>Este mes</span>
          </div>

          <div style={styles.glassCard}>
            <span style={styles.cardLabel}>Por Cobrar</span>
            <div style={{ ...styles.cardValue, color: '#f59e0b' }}>${totalPendientes.toFixed(2)}</div>
            <span style={styles.cardSubtext}>{payments.filter(p => p.status !== 'completed').length} cobros pendientes</span>
          </div>

          <div style={styles.glassCard}>
            <span style={styles.cardLabel}>Total Transacciones</span>
            <div style={styles.cardValue}>{payments.length}</div>
            <span style={styles.cardSubtext}>Registradas en agenda</span>
          </div>
        </section>

        {/* Barra de Filtros */}
        <div style={styles.filterBar}>
          <button
            onClick={() => setFilter('all')}
            style={{ ...styles.filterTab, ...(filter === 'all' ? styles.activeFilterTab : {}) }}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('completed')}
            style={{ ...styles.filterTab, ...(filter === 'completed' ? styles.activeFilterTab : {}) }}
          >
            Completados
          </button>
          <button
            onClick={() => setFilter('pending')}
            style={{ ...styles.filterTab, ...(filter === 'pending' ? styles.activeFilterTab : {}) }}
          >
            Pendientes / Vencidos
          </button>
        </div>

        {/* Tabla / Lista de Pagos */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Cliente / Entidad</th>
                <th style={styles.th}>Concepto</th>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Monto</th>
                <th style={styles.th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((item) => (
                <tr key={item.id} style={styles.tableRow}>
                  <td style={styles.tdBold}>{item.client}</td>
                  <td style={styles.td}>{item.concept}</td>
                  <td style={styles.td}>{item.date}</td>
                  <td style={styles.tdAmount}>${item.amount.toFixed(2)}</td>
                  <td style={styles.td}>
                    <span style={getStatusBadgeStyle(item.status)}>
                      {item.status === 'completed' && 'Completado'}
                      {item.status === 'pending' && 'Pendiente'}
                      {item.status === 'overdue' && 'Vencido'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Contenedor */}
<div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '20px' }}>
  <button style={styles.primaryButton}>
    <i className="f7-icons" style={{ fontSize: '16px', marginRight: '6px' }}>
      plus_circle_fill
    </i>
    Registrar Cobro
  </button>
</div>
        
        </div>
    </Page>
  );
}

// Auxiliar para Insignias de Estado
const getStatusBadgeStyle = (status: Payment['status']): React.CSSProperties => {
  const base: React.CSSProperties = {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    display: 'inline-block',
  };

  if (status === 'completed') {
    return { ...base, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#065f46' };
  }
  if (status === 'pending') {
    return { ...base, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#92400e' };
  }
  return { ...base, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#991b1b' };
};

// Estilos Inline
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    margin: '30px',
    fontSize: '26px',
    fontWeight: '700',
    color: '#1d1d1f',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: '#6e6e73',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0071e3',
    width: 'auto',
    color: '#ffffff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 113, 227, 0.25)',
    transition: 'all 0.2s ease',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderRadius: '18px',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#86868b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '8px 0 4px 0',
    letterSpacing: '-0.5px',
    color: '#1d1d1f',
  },
  cardSubtext: {
    fontSize: '11px',
    color: '#86868b',
  },
  filterBar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  filterTab: {
    background: 'rgba(0, 0, 0, 0.04)',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#6e6e73',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeFilterTab: {
    background: 'rgba(255, 255, 255, 0.8)',
    color: '#1d1d1f',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    fontWeight: '600',
  },
  tableContainer: {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderRadius: '18px',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tableHeaderRow: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  th: {
    padding: '14px 18px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#86868b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
    transition: 'background-color 0.15s ease',
  },
  tdBold: {
    padding: '14px 18px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1d1d1f',
  },
  td: {
    padding: '14px 18px',
    fontSize: '13px',
    color: '#424245',
  },
  tdAmount: {
    padding: '14px 18px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1d1d1f',
  },
};